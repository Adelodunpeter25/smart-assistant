"""Task models."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, Boolean
import enum
from app.core.database import Base


class TaskPriority(str, enum.Enum):
    """Task priority enum."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TaskStatus(str, enum.Enum):
    """Task status enum."""
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Task(Base):
    """Task model."""
    
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(String(2000), nullable=True)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING)
    due_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
