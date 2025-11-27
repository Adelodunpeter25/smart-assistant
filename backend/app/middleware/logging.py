"""Logging middleware for request/response tracking."""

import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all HTTP requests and responses."""

    async def dispatch(self, request: Request, call_next):
        """Log request details and response time."""
        start_time = time.time()
        
        logger.info(f"{request.method} {request.url.path}")
        
        response = await call_next(request)
        
        duration = time.time() - start_time
        logger.info(f"{response.status_code} - {duration:.3f}s")
        
        return response
