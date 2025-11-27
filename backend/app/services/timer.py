"""Timer service."""

from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Timer, TimerType, TimerStatus
from app.schemas.timer import TimerCreate


class TimerService:
    """Service for timer operations."""

    @staticmethod
    async def create_timer(
        db: AsyncSession,
        duration_seconds: int,
        user_id: int,
        label: str | None = None,
    ) -> Timer:
        """Create a timer that triggers after specified duration."""
        trigger_time = datetime.utcnow() + timedelta(seconds=duration_seconds)
        
        timer = Timer(
            user_id=user_id,
            type=TimerType.TIMER,
            duration_seconds=duration_seconds,
            trigger_time=trigger_time,
            label=label,
            status=TimerStatus.ACTIVE,
        )
        db.add(timer)
        await db.flush()
        await db.refresh(timer)
        return timer

    @staticmethod
    async def create_alarm(
        db: AsyncSession,
        trigger_time: datetime,
        user_id: int,
        label: str | None = None,
    ) -> Timer:
        """Create an alarm that triggers at specific time."""
        timer = Timer(
            user_id=user_id,
            type=TimerType.ALARM,
            trigger_time=trigger_time,
            label=label,
            status=TimerStatus.ACTIVE,
        )
        db.add(timer)
        await db.flush()
        await db.refresh(timer)
        return timer

    @staticmethod
    async def get_timers(
        db: AsyncSession,
        user_id: int,
        status: TimerStatus | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Timer]:
        """Get timers with optional status filtering."""
        query = select(Timer).where(Timer.user_id == user_id)
        
        if status:
            query = query.where(Timer.status == status)
        
        query = query.order_by(Timer.trigger_time.asc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_timer(db: AsyncSession, timer_id: int, user_id: int) -> Timer | None:
        """Get a specific timer."""
        query = select(Timer).where(Timer.id == timer_id, Timer.user_id == user_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def cancel_timer(db: AsyncSession, timer_id: int, user_id: int) -> Timer | None:
        """Cancel a timer."""
        timer = await TimerService.get_timer(db, timer_id, user_id)
        if timer and timer.status == TimerStatus.ACTIVE:
            timer.status = TimerStatus.CANCELLED
            timer.completed_at = datetime.utcnow()
            await db.flush()
            await db.refresh(timer)
        return timer

    @staticmethod
    async def get_triggered_timers(db: AsyncSession) -> list[Timer]:
        """Get all active timers that should trigger now."""
        now = datetime.utcnow()
        query = select(Timer).where(
            Timer.status == TimerStatus.ACTIVE,
            Timer.trigger_time <= now,
            Timer.is_notified == False,
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def mark_timer_completed(db: AsyncSession, timer_id: int) -> Timer | None:
        """Mark timer as completed and notified."""
        query = select(Timer).where(Timer.id == timer_id)
        result = await db.execute(query)
        timer = result.scalar_one_or_none()
        
        if timer:
            timer.status = TimerStatus.COMPLETED
            timer.is_notified = True
            timer.completed_at = datetime.utcnow()
            await db.flush()
            await db.refresh(timer)
        
        return timer
