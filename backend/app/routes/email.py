"""Email routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.email import EmailService
from app.schemas import EmailSend, EmailLogResponse, EmailDraftRequest, EmailDraftResponse, SuccessResponse
from app.models.user import User

router = APIRouter(prefix="/email", tags=["Email"])


@router.post("/send", response_model=SuccessResponse[EmailLogResponse])
async def send_email(
    email_data: EmailSend,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Send an email."""
    email_log = await EmailService.send_email(db, email_data, current_user.id)
    message = "Email sent successfully" if email_log.status == "sent" else "Email failed to send"
    return SuccessResponse(data=email_log, message=message)


@router.post("/draft", response_model=SuccessResponse[EmailDraftResponse])
async def draft_email(
    draft_request: EmailDraftRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate email draft."""
    draft = EmailService.draft_email(draft_request.context, draft_request.tone)
    return SuccessResponse(data=draft, message="Email draft generated")


@router.get("/logs", response_model=SuccessResponse[list[EmailLogResponse]])
async def get_email_logs(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get email logs."""
    logs = await EmailService.get_email_logs(db, current_user.id, skip, limit)
    return SuccessResponse(data=logs)
