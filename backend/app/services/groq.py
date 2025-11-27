"""Groq service for natural language processing."""

import json
from groq import Groq
from app.core.config import get_settings
from app.utils.prompts import SYSTEM_PROMPT, RESPONSE_PROMPT
from app.utils.tools import TOOLS

settings = get_settings()
client = Groq(api_key=settings.GROQ_API_KEY)


class GroqService:
    """Service for Groq LLM operations."""

    @staticmethod
    def process_message(user_message: str, tool_result: dict | None = None) -> dict:
        """Process user message, extract tool calls, and generate response if tool executed."""
        
        # If tool result provided, generate response
        if tool_result:
            result_summary = json.dumps(tool_result.get("data", {}), indent=2)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": RESPONSE_PROMPT},
                    {"role": "user", "content": f"User asked: {user_message}\n\nResult: {result_summary}\n\nGenerate a natural response:"},
                ],
                temperature=0.9,
                max_tokens=200,
            )
            return {"response": response.choices[0].message.content}
        
        # Extract tool call from user message
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            tools=TOOLS,
            tool_choice="auto",
            temperature=0.9,
            max_tokens=500,
        )

        message = response.choices[0].message

        if message.tool_calls:
            tool_call = message.tool_calls[0]
            return {
                "tool_name": tool_call.function.name,
                "parameters": json.loads(tool_call.function.arguments),
            }

        return {"tool_name": None, "response": message.content}
