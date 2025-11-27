"""Reminder models."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum
import enum
from app.core.database import Base


class ReminderStatus(str, enum.Enum):
    """Reminder status enum."""
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Reminder(Base):
    """Reminder model."""
    
    __tablename__ = "reminders"
    
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String(500), nullable=False)
    reminder_time = Column(DateTime, nullable=False)
    status = Column(Enum(ReminderStatus), default=ReminderStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
