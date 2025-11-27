"""Timer and alarm models."""

import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class TimerType(str, enum.Enum):
    """Timer type enum."""
    TIMER = "timer"
    ALARM = "alarm"


class TimerStatus(str, enum.Enum):
    """Timer status enum."""
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Timer(Base):
    """Timer/Alarm model."""
    __tablename__ = "timers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(Enum(TimerType), nullable=False)
    duration_seconds = Column(Integer, nullable=True)  # For timers
    trigger_time = Column(DateTime, nullable=False)
    label = Column(String, nullable=True)
    status = Column(Enum(TimerStatus), default=TimerStatus.ACTIVE, nullable=False)
    is_notified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="timers")
