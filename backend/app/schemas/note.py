"""Note schemas."""

from datetime import datetime
from pydantic import BaseModel


class NoteCreate(BaseModel):
    """Schema for creating note."""
    content: str
    tags: str | None = None


class NoteUpdate(BaseModel):
    """Schema for updating note."""
    content: str | None = None
    tags: str | None = None


class NoteResponse(BaseModel):
    """Schema for note response."""
    id: int
    content: str
    tags: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
