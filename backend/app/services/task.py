"""Task service for managing tasks."""

from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Task, TaskStatus
from app.schemas import TaskCreate, TaskUpdate


class TaskService:
    """Service for task operations."""

    @staticmethod
    async def create_task(db: AsyncSession, task_data: TaskCreate) -> Task:
        """Create a new task."""
        task = Task(**task_data.model_dump())
        db.add(task)
        await db.flush()
        await db.refresh(task)
        return task

    @staticmethod
    async def get_tasks(
        db: AsyncSession,
        status: TaskStatus | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Task]:
        """Get tasks with optional status filtering."""
        query = select(Task)
        
        if status:
            query = query.where(Task.status == status)
        
        query = query.order_by(Task.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_task(db: AsyncSession, task_id: int) -> Task | None:
        """Get a specific task by ID."""
        query = select(Task).where(Task.id == task_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def update_task(db: AsyncSession, task_id: int, task_data: TaskUpdate) -> Task | None:
        """Update a task."""
        query = select(Task).where(Task.id == task_id)
        result = await db.execute(query)
        task = result.scalar_one_or_none()
        
        if not task:
            return None
        
        update_data = task_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)
        
        await db.flush()
        await db.refresh(task)
        return task

    @staticmethod
    async def complete_task(db: AsyncSession, task_id: int) -> Task | None:
        """Mark a task as completed."""
        query = select(Task).where(Task.id == task_id)
        result = await db.execute(query)
        task = result.scalar_one_or_none()
        
        if not task:
            return None
        
        task.status = TaskStatus.COMPLETED
        task.completed_at = datetime.utcnow()
        
        await db.flush()
        await db.refresh(task)
        return task

    @staticmethod
    async def delete_task(db: AsyncSession, task_id: int) -> bool:
        """Delete a task."""
        query = select(Task).where(Task.id == task_id)
        result = await db.execute(query)
        task = result.scalar_one_or_none()
        
        if not task:
            return False
        
        await db.delete(task)
        return True
