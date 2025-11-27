"""API routes."""

from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.calendar import router as calendar_router
from app.routes.note import router as note_router
from app.routes.email import router as email_router
from app.routes.search import router as search_router
from app.routes.calculator import router as calculator_router
from app.routes.task import router as task_router
from app.routes.chat import router as chat_router

__all__ = ["health_router", "auth_router", "calendar_router", "note_router", "email_router", "search_router", "calculator_router", "task_router", "chat_router"]
