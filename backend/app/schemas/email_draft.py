"""Email draft schemas."""

from pydantic import BaseModel


class EmailDraftRequest(BaseModel):
    """Schema for email draft request."""
    context: str
    tone: str = "professional"


class EmailDraftResponse(BaseModel):
    """Schema for email draft response."""
    subject: str
    body: str
