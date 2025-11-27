"""Note routes."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.note import NoteService
from app.schemas import NoteCreate, NoteUpdate, NoteResponse, SuccessResponse
from app.models.user import User

router = APIRouter(prefix="/notes", tags=["Notes"])


@router.post("", response_model=SuccessResponse[NoteResponse])
async def create_note(
    note_data: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new note."""
    note = await NoteService.create_note(db, note_data, current_user.id)
    return SuccessResponse(data=note, message="Note created successfully")


@router.get("", response_model=SuccessResponse[list[NoteResponse]])
async def get_notes(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all notes with pagination."""
    notes = await NoteService.get_notes(db, current_user.id, skip, limit)
    return SuccessResponse(data=notes)


@router.get("/search", response_model=SuccessResponse[list[NoteResponse]])
async def search_notes(
    q: str = Query(None, description="Search query"),
    tags: str = Query(None, description="Comma-separated tags"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Search notes by content or tags."""
    notes = await NoteService.search_notes(db, current_user.id, q, tags)
    return SuccessResponse(data=notes)


@router.get("/{note_id}", response_model=SuccessResponse[NoteResponse])
async def get_note(
    note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific note."""
    note = await NoteService.get_note(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return SuccessResponse(data=note)


@router.put("/{note_id}", response_model=SuccessResponse[NoteResponse])
async def update_note(
    note_id: int,
    note_data: NoteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a note."""
    note = await NoteService.update_note(db, note_id, note_data, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return SuccessResponse(data=note, message="Note updated successfully")


@router.delete("/{note_id}", response_model=SuccessResponse[dict])
async def delete_note(
    note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a note."""
    deleted = await NoteService.delete_note(db, note_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Note not found")
    return SuccessResponse(data={"id": note_id}, message="Note deleted successfully")
