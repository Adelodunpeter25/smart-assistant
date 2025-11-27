"""Email log models."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey
import enum
from app.core.database import Base


class EmailStatus(str, enum.Enum):
    """Email status enum."""
    SENT = "sent"
    FAILED = "failed"


class EmailLog(Base):
    """Email log model."""
    
    __tablename__ = "email_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    recipient = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    status = Column(Enum(EmailStatus), nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow)
