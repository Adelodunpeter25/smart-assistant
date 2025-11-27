"""Cloudflare Workers AI service for natural language processing."""

import json
import httpx
from app.core.config import get_settings
from app.utils.prompts import SYSTEM_PROMPT, RESPONSE_PROMPT
from app.utils.tools import TOOLS

settings = get_settings()


class WorkersAIService:
    """Service for Cloudflare Workers AI LLM operations."""

    @staticmethod
    async def process_message(user_message: str, tool_result: dict | None = None) -> dict:
        """Process user message, extract tool calls, and generate response if tool executed."""
        
        # If tool result provided, generate response
        if tool_result:
            result_summary = json.dumps(tool_result.get("data", {}), indent=2)
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://api.cloudflare.com/client/v4/accounts/{settings.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast",
                    headers={
                        "Authorization": f"Bearer {settings.CLOUDFLARE_API_TOKEN}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "messages": [
                            {"role": "system", "content": RESPONSE_PROMPT},
                            {"role": "user", "content": f"User asked: {user_message}\n\nResult: {result_summary}\n\nGenerate a natural response:"},
                        ],
                        "temperature": 0.9,
                        "max_tokens": 200,
                    },
                    timeout=30.0,
                )
                data = response.json()
                return {"response": data["result"]["response"]}
        
        # Extract tool call from user message
        # Convert tools to OpenAI format for Workers AI
        tools_formatted = []
        for tool in TOOLS:
            tools_formatted.append({
                "type": "function",
                "function": {
                    "name": tool["function"]["name"],
                    "description": tool["function"]["description"],
                    "parameters": tool["function"]["parameters"],
                }
            })
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.cloudflare.com/client/v4/accounts/{settings.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast",
                headers={
                    "Authorization": f"Bearer {settings.CLOUDFLARE_API_TOKEN}",
                    "Content-Type": "application/json",
                },
                json={
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_message},
                    ],
                    "tools": tools_formatted,
                    "temperature": 0.3,
                    "max_tokens": 500,
                },
                timeout=30.0,
            )
            data = response.json()
            
            # Parse response
            result = data.get("result", {})
            response_text = result.get("response", "")
            tool_calls = result.get("tool_calls", [])
            
            if tool_calls and len(tool_calls) > 0:
                tool_call = tool_calls[0]
                function = tool_call.get("function", {})
                return {
                    "tool_name": function.get("name"),
                    "parameters": json.loads(function.get("arguments", "{}")),
                }
            
            return {"tool_name": None, "response": response_text}
