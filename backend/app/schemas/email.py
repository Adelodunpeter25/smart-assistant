"""Email schemas."""

from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.email_log import EmailStatus


class EmailSend(BaseModel):
    """Schema for sending email."""
    recipient: EmailStr
    subject: str
    body: str


class EmailLogResponse(BaseModel):
    """Schema for email log response."""
    id: int
    recipient: str
    subject: str
    body: str
    status: EmailStatus
    sent_at: datetime

    class Config:
        from_attributes = True
