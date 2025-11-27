"""Pydantic schemas for request/response validation."""

from app.schemas.calendar import CalendarEventCreate, CalendarEventResponse
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.schemas.reminder import ReminderCreate, ReminderResponse
from app.schemas.email import EmailSend, EmailLogResponse
from app.schemas.email_draft import EmailDraftRequest, EmailDraftResponse
from app.schemas.search import (
    SearchRequest,
    SearchResponse,
    SearchResult,
    SummarizeRequest,
    SummarizeResponse,
)
from app.schemas.calculator import (
    CalculateRequest,
    CalculateResponse,
    ConvertCurrencyRequest,
    ConvertCurrencyResponse,
)
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.schemas.response import SuccessResponse, ErrorResponse

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
    "EmailDraftRequest",
    "EmailDraftResponse",
    "SearchRequest",
    "SearchResponse",
    "SearchResult",
    "SummarizeRequest",
    "SummarizeResponse",
    "CalculateRequest",
    "CalculateResponse",
    "ConvertCurrencyRequest",
    "ConvertCurrencyResponse",
    "TaskCreate",
    "TaskUpdate",
    "TaskResponse",
    "SuccessResponse",
    "ErrorResponse",
]
