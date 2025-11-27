"""Tool executor for calling actual service functions."""

from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.task import TaskService
from app.services.calendar import CalendarService
from app.services.note import NoteService
from app.services.email import EmailService
from app.services.search import SearchService
from app.services.calculator import CalculatorService
from app.schemas import (
    TaskCreate,
    CalendarEventCreate,
    NoteCreate,
    EmailSend,
)


class ToolExecutor:
    """Execute tools by calling actual services."""

    @staticmethod
    async def execute(db: AsyncSession, tool_name: str, parameters: dict) -> dict:
        """Execute a tool with given parameters."""
        
        if tool_name == "create_task":
            task_data = TaskCreate(**parameters)
            task = await TaskService.create_task(db, task_data)
            return {"success": True, "data": {"id": task.id, "title": task.title}}

        elif tool_name == "create_event":
            event_data = CalendarEventCreate(**parameters)
            event = await CalendarService.add_event(db, event_data)
            return {"success": True, "data": {"id": event.id, "title": event.title}}

        elif tool_name == "create_note":
            note_data = NoteCreate(**parameters)
            note = await NoteService.create_note(db, note_data)
            return {"success": True, "data": {"id": note.id, "content": note.content[:50]}}

        elif tool_name == "send_email":
            email_data = EmailSend(**parameters)
            email_log = await EmailService.send_email(db, email_data)
            return {"success": True, "data": {"status": email_log.status}}

        elif tool_name == "search_web":
            query = parameters.get("query")
            max_results = int(parameters.get("max_results", 5))
            results = await SearchService.search_web(query, max_results)
            return {"success": True, "data": {"results": results[:3]}}

        elif tool_name == "calculate":
            expression = parameters.get("expression")
            result = CalculatorService.calculate(expression)
            return {"success": True, "data": {"result": result}}

        else:
            return {"success": False, "error": f"Unknown tool: {tool_name}"}
