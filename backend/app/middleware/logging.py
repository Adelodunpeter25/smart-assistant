"""Logging configuration."""

import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler
from app.core.config import get_settings

settings = get_settings()


def setup_logging():
    """Configure application logging."""
    level = logging.DEBUG if settings.DEBUG else logging.INFO
    
    # Create logs directory
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Rotating file handler - clears at ~2000 lines (assuming ~100 chars per line)
    file_handler = RotatingFileHandler(
        log_dir / "smart_assistant.log",
        maxBytes=200000,  # ~2000 lines
        backupCount=1
    )
    file_handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
    
    logging.basicConfig(
        level=level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            file_handler
        ]
    )
    
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
