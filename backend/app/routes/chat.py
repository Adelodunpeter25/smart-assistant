"""Chat routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import get_settings
from app.services.groq import GroqService
from app.services.workersai import WorkersAIService

settings = get_settings()
from app.services.tool_executor import ToolExecutor
from app.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    chat_request: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """Process chat message and execute tools if needed."""
    
    # Get LLM response with tool call
    if settings.LLM_PROVIDER == "workersai":
        llm_result = await WorkersAIService.process_message(chat_request.message)
    else:
        llm_result = GroqService.process_message(chat_request.message)
    
    # If LLM wants to use a tool, execute it
    if llm_result.get("tool_name"):
        tool_name = llm_result["tool_name"]
        parameters = llm_result["parameters"]
        
        # Execute the tool
        tool_result = await ToolExecutor.execute(db, tool_name, parameters)
        
        # Generate natural response using LLM
        if tool_result["success"]:
            if settings.LLM_PROVIDER == "workersai":
                llm_response = await WorkersAIService.process_message(chat_request.message, tool_result)
            else:
                llm_response = GroqService.process_message(chat_request.message, tool_result)
            response = llm_response["response"]
        else:
            response = f"Sorry, I couldn't complete that: {tool_result.get('error')}"
        
        return ChatResponse(
            response=response,
            tool_used=tool_name,
            tool_result=tool_result,
        )
    
    # No tool needed, just return LLM response
    return ChatResponse(
        response=llm_result.get("response", "I'm not sure how to help with that."),
        tool_used=None,
        tool_result=None,
    )
