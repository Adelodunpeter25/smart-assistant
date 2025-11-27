"""Timer routes."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.timer import TimerService
from app.schemas import TimerResponse, SuccessResponse
from app.models import TimerStatus, User
from pydantic import BaseModel, Field


class SetTimerRequest(BaseModel):
    """Request to set a timer."""
    duration_seconds: int = Field(..., gt=0, description="Duration in seconds")
    label: str | None = Field(None, description="Optional label")


class SetAlarmRequest(BaseModel):
    """Request to set an alarm."""
    trigger_time: datetime = Field(..., description="When alarm should trigger")
    label: str | None = Field(None, description="Optional label")


router = APIRouter(prefix="/timers", tags=["Timers"])


@router.post("/timer", response_model=SuccessResponse[TimerResponse])
async def set_timer(
    request: SetTimerRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Set a timer."""
    timer = await TimerService.create_timer(
        db, request.duration_seconds, current_user.id, request.label
    )
    return SuccessResponse(data=timer, message="Timer set successfully")


@router.post("/alarm", response_model=SuccessResponse[TimerResponse])
async def set_alarm(
    request: SetAlarmRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Set an alarm."""
    timer = await TimerService.create_alarm(
        db, request.trigger_time, current_user.id, request.label
    )
    return SuccessResponse(data=timer, message="Alarm set successfully")


@router.get("", response_model=SuccessResponse[list[TimerResponse]])
async def get_timers(
    status: TimerStatus | None = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get timers with optional status filtering."""
    timers = await TimerService.get_timers(db, current_user.id, status, skip, limit)
    return SuccessResponse(data=timers)


@router.get("/{timer_id}", response_model=SuccessResponse[TimerResponse])
async def get_timer(
    timer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific timer."""
    timer = await TimerService.get_timer(db, timer_id, current_user.id)
    if not timer:
        raise HTTPException(status_code=404, detail="Timer not found")
    return SuccessResponse(data=timer)


@router.delete("/{timer_id}", response_model=SuccessResponse[TimerResponse])
async def cancel_timer(
    timer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cancel a timer."""
    timer = await TimerService.cancel_timer(db, timer_id, current_user.id)
    if not timer:
        raise HTTPException(status_code=404, detail="Timer not found")
    return SuccessResponse(data=timer, message="Timer cancelled successfully")
