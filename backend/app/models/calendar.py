"""Calendar event models."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.core.database import Base


class CalendarEvent(Base):
    """Calendar event model."""
    
    __tablename__ = "calendar_events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    description = Column(Text, nullable=True)
    attendees = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
