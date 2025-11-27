"""Pydantic schemas for request/response validation."""

from app.schemas.calendar import CalendarEventCreate, CalendarEventResponse
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.schemas.reminder import ReminderCreate, ReminderResponse
from app.schemas.email import EmailSend, EmailLogResponse

__all__ = [
    "CalendarEventCreate",
    "CalendarEventResponse",
    "NoteCreate",
    "NoteUpdate",
    "NoteResponse",
    "ReminderCreate",
    "ReminderResponse",
    "EmailSend",
    "EmailLogResponse",
]
