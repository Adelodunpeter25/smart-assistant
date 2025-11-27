"""API routes."""

from app.routes.health import router as health_router
from app.routes.calendar import router as calendar_router
from app.routes.note import router as note_router

__all__ = ["health_router", "calendar_router", "note_router"]
