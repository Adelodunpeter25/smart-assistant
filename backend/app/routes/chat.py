"""Chat routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import get_settings
from app.core.deps import get_current_user
from app.services.groq import GroqService
from app.services.workersai import WorkersAIService
from app.models.user import User

settings = get_settings()
from app.services.tool_executor import ToolExecutor
from app.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    chat_request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Process chat message and execute tools if needed."""
    
    # Template instructions mapping
    template_instructions = {
        "search_web": f"Search the web for: {chat_request.message}",
        "save_note": f"Save this as a note: {chat_request.message}",
        "create_task": f"Create a task: {chat_request.message}",
        "set_timer": f"Set a timer for: {chat_request.message}",
        "calculate": f"Calculate: {chat_request.message}",
        "convert_currency": f"Convert currency: {chat_request.message}",
    }
    
    # Use template instruction if provided, otherwise use original message
    message = template_instructions.get(chat_request.template, chat_request.message) if chat_request.template else chat_request.message
    
    # Get LLM response with tool call
    if settings.LLM_PROVIDER == "workersai":
        llm_result = await WorkersAIService.process_message(message)
    else:
        llm_result = GroqService.process_message(message)
    
    # If LLM wants to use a tool, execute it
    if llm_result.get("tool_name"):
        tool_name = llm_result["tool_name"]
        parameters = llm_result["parameters"]
        
        # Execute the tool
        tool_result = await ToolExecutor.execute(db, tool_name, parameters, current_user.id)
        
        # Generate natural response using LLM
        if tool_result["success"]:
            if settings.LLM_PROVIDER == "workersai":
                llm_response = await WorkersAIService.process_message(message, tool_result)
            else:
                llm_response = GroqService.process_message(message, tool_result)
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
