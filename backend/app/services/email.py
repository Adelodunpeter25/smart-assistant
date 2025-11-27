"""Email service for sending emails."""

import resend
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import get_settings
from app.models import EmailLog, EmailStatus
from app.schemas import EmailSend

settings = get_settings()
resend.api_key = settings.RESEND_API_KEY


class EmailService:
    """Service for email operations."""

    @staticmethod
    async def send_email(db: AsyncSession, email_data: EmailSend) -> EmailLog:
        """Send an email using Resend."""
        try:
            resend.Emails.send({
                "from": settings.EMAIL_FROM,
                "to": email_data.recipient,
                "subject": email_data.subject,
                "html": email_data.body,
            })
            status = EmailStatus.SENT
        except Exception:
            status = EmailStatus.FAILED
        
        email_log = EmailLog(
            recipient=email_data.recipient,
            subject=email_data.subject,
            body=email_data.body,
            status=status,
        )
        db.add(email_log)
        await db.flush()
        await db.refresh(email_log)
        return email_log

    @staticmethod
    async def get_email_logs(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[EmailLog]:
        """Get email logs with pagination."""
        from sqlalchemy import select
        query = select(EmailLog).order_by(EmailLog.sent_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    def draft_email(context: str, tone: str = "professional") -> dict:
        """Generate email draft based on context."""
        # Simple template-based drafting (will be replaced with LLM later)
        subject = f"Regarding: {context[:50]}"
        body = f"<p>Dear recipient,</p><p>{context}</p><p>Best regards</p>"
        return {"subject": subject, "body": body}
