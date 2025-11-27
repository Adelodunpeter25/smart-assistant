"""Timer schemas."""

from datetime import datetime
from pydantic import BaseModel, Field
from app.models import TimerType, TimerStatus


class TimerCreate(BaseModel):
    """Schema for creating a timer."""
    type: TimerType
    duration_seconds: int | None = Field(None, description="Duration in seconds for timers")
    trigger_time: datetime = Field(..., description="When the timer/alarm should trigger")
    label: str | None = Field(None, description="Optional label for the timer")


class TimerResponse(BaseModel):
    """Schema for timer response."""
    id: int
    user_id: int
    type: TimerType
    duration_seconds: int | None
    trigger_time: datetime
    label: str | None
    status: TimerStatus
    is_notified: bool
    created_at: datetime
    completed_at: datetime | None

    class Config:
        from_attributes = True
