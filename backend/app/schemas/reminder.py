"""Reminder schemas."""

from datetime import datetime
from pydantic import BaseModel
from app.models.reminder import ReminderStatus


class ReminderCreate(BaseModel):
    """Schema for creating reminder."""
    message: str
    reminder_time: datetime


class ReminderResponse(BaseModel):
    """Schema for reminder response."""
    id: int
    message: str
    reminder_time: datetime
    status: ReminderStatus
    created_at: datetime

    class Config:
        from_attributes = True
