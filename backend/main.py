"""Main FastAPI application."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.middleware import setup_logging
from app.utils.celery_starter import start_celery, stop_celery
from app.routes import health_router, calendar_router, note_router, email_router, search_router, calculator_router, task_router, timer_router, chat_router, auth_router
from app.websockets.notifications import router as ws_router

settings = get_settings()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    setup_logging()
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    start_celery()
    yield
    stop_celery()
    logger.info("Shutting down application")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan,
    swagger_ui_parameters={"defaultModelsExpandDepth": -1},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(calendar_router)
app.include_router(note_router)
app.include_router(email_router)
app.include_router(search_router)
app.include_router(calculator_router)
app.include_router(task_router)
app.include_router(timer_router)
app.include_router(chat_router)
app.include_router(ws_router)
