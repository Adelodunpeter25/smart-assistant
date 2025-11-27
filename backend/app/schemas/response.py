"""Generic API response schemas."""

from typing import Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    """Generic success response."""
    success: bool = True
    data: T
    message: str | None = None


class ErrorResponse(BaseModel):
    """Generic error response."""
    success: bool = False
    error: str
    details: dict | None = None
