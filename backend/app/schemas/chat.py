"""Chat schemas."""

from pydantic import BaseModel


class ChatRequest(BaseModel):
    """Schema for chat request."""
    message: str


class ChatResponse(BaseModel):
    """Schema for chat response."""
    response: str
    tool_used: str | None = None
    tool_result: dict | None = None
