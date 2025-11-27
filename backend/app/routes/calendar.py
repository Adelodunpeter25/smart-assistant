"""Calendar and reminder routes."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.calendar import CalendarService
from app.schemas import (
    CalendarEventCreate,
    CalendarEventResponse,
    ReminderCreate,
    ReminderResponse,
    SuccessResponse,
)
from app.models import ReminderStatus

router = APIRouter(prefix="/calendar", tags=["Calendar"])


@router.post("/events", response_model=SuccessResponse[CalendarEventResponse])
async def create_event(
    event_data: CalendarEventCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new calendar event."""
    event = await CalendarService.add_event(db, event_data)
    return SuccessResponse(data=event, message="Event created successfully")


@router.get("/events", response_model=SuccessResponse[list[CalendarEventResponse]])
async def get_events(
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Get calendar events with optional date filtering."""
    events = await CalendarService.get_events(db, start_date, end_date)
    return SuccessResponse(data=events)


@router.delete("/events/{event_id}", response_model=SuccessResponse[dict])
async def delete_event(
    event_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a calendar event."""
    deleted = await CalendarService.delete_event(db, event_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Event not found")
    return SuccessResponse(data={"id": event_id}, message="Event deleted successfully")


@router.post("/reminders", response_model=SuccessResponse[ReminderResponse])
async def create_reminder(
    reminder_data: ReminderCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new reminder."""
    reminder = await CalendarService.add_reminder(db, reminder_data)
    return SuccessResponse(data=reminder, message="Reminder created successfully")


@router.get("/reminders", response_model=SuccessResponse[list[ReminderResponse]])
async def get_reminders(
    status: ReminderStatus | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Get reminders with optional status filtering."""
    reminders = await CalendarService.get_reminders(db, status)
    return SuccessResponse(data=reminders)
