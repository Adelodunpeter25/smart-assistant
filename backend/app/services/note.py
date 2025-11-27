"""Note service for managing notes."""

from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Note
from app.schemas import NoteCreate, NoteUpdate


class NoteService:
    """Service for note operations."""

    @staticmethod
    async def create_note(db: AsyncSession, note_data: NoteCreate, user_id: int) -> Note:
        """Create a new note."""
        note = Note(**note_data.model_dump(), user_id=user_id)
        db.add(note)
        await db.flush()
        await db.refresh(note)
        return note

    @staticmethod
    async def get_notes(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100) -> list[Note]:
        """Get all notes with pagination."""
        query = select(Note).where(Note.user_id == user_id).order_by(Note.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_note(db: AsyncSession, note_id: int, user_id: int) -> Note | None:
        """Get a specific note by ID."""
        query = select(Note).where(Note.id == note_id, Note.user_id == user_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def search_notes(db: AsyncSession, user_id: int, query: str, tags: str | None = None) -> list[Note]:
        """Search notes by content or tags."""
        stmt = select(Note).where(Note.user_id == user_id)
        
        if query:
            stmt = stmt.where(Note.content.ilike(f"%{query}%"))
        
        if tags:
            tag_list = [t.strip() for t in tags.split(",")]
            tag_filters = [Note.tags.ilike(f"%{tag}%") for tag in tag_list]
            stmt = stmt.where(or_(*tag_filters))
        
        stmt = stmt.order_by(Note.created_at.desc())
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def update_note(db: AsyncSession, note_id: int, note_data: NoteUpdate, user_id: int) -> Note | None:
        """Update a note."""
        query = select(Note).where(Note.id == note_id, Note.user_id == user_id)
        result = await db.execute(query)
        note = result.scalar_one_or_none()
        
        if not note:
            return None
        
        update_data = note_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(note, field, value)
        
        await db.flush()
        await db.refresh(note)
        return note

    @staticmethod
    async def delete_note(db: AsyncSession, note_id: int, user_id: int) -> bool:
        """Delete a note."""
        query = select(Note).where(Note.id == note_id, Note.user_id == user_id)
        result = await db.execute(query)
        note = result.scalar_one_or_none()
        
        if not note:
            return False
        
        await db.delete(note)
        return True
