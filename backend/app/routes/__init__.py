"""API routes."""

from app.routes.health import router as health_router
from app.routes.calendar import router as calendar_router

__all__ = ["health_router", "calendar_router"]
