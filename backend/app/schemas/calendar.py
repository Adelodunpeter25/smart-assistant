"""Calendar event schemas."""

from datetime import datetime
from pydantic import BaseModel


class CalendarEventCreate(BaseModel):
    """Schema for creating calendar event."""
    title: str
    start_time: datetime
    end_time: datetime
    description: str | None = None
    attendees: str | None = None


class CalendarEventResponse(BaseModel):
    """Schema for calendar event response."""
    id: int
    title: str
    start_time: datetime
    end_time: datetime
    description: str | None
    attendees: str | None
    created_at: datetime

    class Config:
        from_attributes = True
