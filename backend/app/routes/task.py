"""Task routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.task import TaskService
from app.schemas import TaskCreate, TaskUpdate, TaskResponse, SuccessResponse
from app.models import TaskStatus

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("", response_model=SuccessResponse[TaskResponse])
async def create_task(
    task_data: TaskCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new task."""
    task = await TaskService.create_task(db, task_data)
    return SuccessResponse(data=task, message="Task created successfully")


@router.get("", response_model=SuccessResponse[list[TaskResponse]])
async def get_tasks(
    status: TaskStatus | None = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """Get tasks with optional status filtering."""
    tasks = await TaskService.get_tasks(db, status, skip, limit)
    return SuccessResponse(data=tasks)


@router.get("/{task_id}", response_model=SuccessResponse[TaskResponse])
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific task."""
    task = await TaskService.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return SuccessResponse(data=task)


@router.put("/{task_id}", response_model=SuccessResponse[TaskResponse])
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a task."""
    task = await TaskService.update_task(db, task_id, task_data)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return SuccessResponse(data=task, message="Task updated successfully")


@router.post("/{task_id}/complete", response_model=SuccessResponse[TaskResponse])
async def complete_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Mark a task as completed."""
    task = await TaskService.complete_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return SuccessResponse(data=task, message="Task completed successfully")


@router.delete("/{task_id}", response_model=SuccessResponse[dict])
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a task."""
    deleted = await TaskService.delete_task(db, task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
    return SuccessResponse(data={"id": task_id}, message="Task deleted successfully")
