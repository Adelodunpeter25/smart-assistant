"""Calendar service for managing events and reminders."""

from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import CalendarEvent, Reminder, ReminderStatus
from app.schemas import CalendarEventCreate, ReminderCreate


class CalendarService:
    """Service for calendar operations."""

    @staticmethod
    async def add_event(db: AsyncSession, event_data: CalendarEventCreate) -> CalendarEvent:
        """Create a new calendar event."""
        event = CalendarEvent(**event_data.model_dump())
        db.add(event)
        await db.flush()
        await db.refresh(event)
        return event

    @staticmethod
    async def get_events(
        db: AsyncSession,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> list[CalendarEvent]:
        """Get calendar events with optional date filtering."""
        query = select(CalendarEvent)
        
        if start_date:
            query = query.where(CalendarEvent.start_time >= start_date)
        if end_date:
            query = query.where(CalendarEvent.end_time <= end_date)
        
        query = query.order_by(CalendarEvent.start_time)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def delete_event(db: AsyncSession, event_id: int) -> bool:
        """Delete a calendar event."""
        query = select(CalendarEvent).where(CalendarEvent.id == event_id)
        result = await db.execute(query)
        event = result.scalar_one_or_none()
        
        if not event:
            return False
        
        await db.delete(event)
        return True

    @staticmethod
    async def add_reminder(db: AsyncSession, reminder_data: ReminderCreate) -> Reminder:
        """Create a new reminder."""
        reminder = Reminder(**reminder_data.model_dump())
        db.add(reminder)
        await db.flush()
        await db.refresh(reminder)
        return reminder

    @staticmethod
    async def get_reminders(db: AsyncSession, status: ReminderStatus | None = None) -> list[Reminder]:
        """Get reminders with optional status filtering."""
        query = select(Reminder)
        
        if status:
            query = query.where(Reminder.status == status)
        
        query = query.order_by(Reminder.reminder_time)
        result = await db.execute(query)
        return list(result.scalars().all())
