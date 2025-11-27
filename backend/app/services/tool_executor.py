"""Tool executor for calling actual service functions."""

from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.task import TaskService
from app.services.calendar import CalendarService
from app.services.note import NoteService
from app.services.email import EmailService
from app.services.search import SearchService
from app.services.calculator import CalculatorService
from app.services.timer import TimerService
from app.schemas import (
    TaskCreate,
    CalendarEventCreate,
    NoteCreate,
    EmailSend,
)


class ToolExecutor:
    """Execute tools by calling actual services."""

    @staticmethod
    async def execute(db: AsyncSession, tool_name: str, parameters: dict | None, user_id: int) -> dict:
        """Execute a tool with given parameters."""
        
        if parameters is None:
            parameters = {}
        
        # Task tools
        if tool_name == "create_task":
            task_data = TaskCreate(**parameters)
            task = await TaskService.create_task(db, task_data, user_id)
            return {"success": True, "data": {"id": task.id, "title": task.title}}
        
        elif tool_name == "list_tasks":
            status = parameters.get("status")
            tasks = await TaskService.get_tasks(db, user_id, status=status)
            return {"success": True, "data": {"tasks": [{"id": t.id, "title": t.title, "status": t.status.value} for t in tasks]}}
        
        elif tool_name == "complete_task":
            task_id = parameters.get("task_id")
            task = await TaskService.complete_task(db, task_id, user_id)
            if not task:
                return {"success": False, "error": "Task not found"}
            return {"success": True, "data": {"id": task.id, "title": task.title, "status": task.status.value}}
        
        elif tool_name == "delete_task":
            task_id = parameters.get("task_id")
            deleted = await TaskService.delete_task(db, task_id, user_id)
            if not deleted:
                return {"success": False, "error": "Task not found"}
            return {"success": True, "data": {"message": "Task deleted"}}

        # Calendar tools
        elif tool_name == "create_event":
            event_data = CalendarEventCreate(**parameters)
            event = await CalendarService.add_event(db, event_data, user_id)
            return {"success": True, "data": {"id": event.id, "title": event.title}}
        
        elif tool_name == "list_events":
            start_date = parameters.get("start_date")
            end_date = parameters.get("end_date")
            events = await CalendarService.get_events(db, user_id, start_date=start_date, end_date=end_date)
            return {"success": True, "data": {"events": [{"id": e.id, "title": e.title, "start_time": str(e.start_time)} for e in events]}}
        
        elif tool_name == "delete_event":
            event_id = parameters.get("event_id")
            deleted = await CalendarService.delete_event(db, event_id, user_id)
            if not deleted:
                return {"success": False, "error": "Event not found"}
            return {"success": True, "data": {"message": "Event deleted"}}

        # Note tools
        elif tool_name == "create_note":
            note_data = NoteCreate(**parameters)
            note = await NoteService.create_note(db, note_data, user_id)
            return {"success": True, "data": {"id": note.id, "content": note.content[:50]}}
        
        elif tool_name == "list_notes":
            notes = await NoteService.get_notes(db, user_id)
            return {"success": True, "data": {"notes": [{"id": n.id, "content": n.content[:50]} for n in notes]}}
        
        elif tool_name == "search_notes":
            query = parameters.get("query")
            tags = parameters.get("tags")
            notes = await NoteService.search_notes(db, user_id, query=query, tags=tags)
            return {"success": True, "data": {"notes": [{"id": n.id, "content": n.content[:50]} for n in notes]}}
        
        elif tool_name == "delete_note":
            note_id = parameters.get("note_id")
            deleted = await NoteService.delete_note(db, note_id, user_id)
            if not deleted:
                return {"success": False, "error": "Note not found"}
            return {"success": True, "data": {"message": "Note deleted"}}

        # Email tool
        elif tool_name == "send_email":
            email_data = EmailSend(**parameters)
            email_log = await EmailService.send_email(db, email_data, user_id)
            return {"success": True, "data": {"status": email_log.status}}

        # Search tool
        elif tool_name == "search_web":
            query = parameters.get("query")
            max_results = int(parameters.get("max_results", 5))
            results = await SearchService.search_web(query, max_results)
            return {"success": True, "data": {"results": results[:3]}}

        # Calculator tool
        elif tool_name == "calculate":
            expression = parameters.get("expression")
            result = CalculatorService.calculate(expression)
            return {"success": True, "data": {"result": result}}
        
        # Currency conversion tool
        elif tool_name == "convert_currency":
            amount = parameters.get("amount")
            from_currency = parameters.get("from_currency")
            to_currency = parameters.get("to_currency")
            result = await CalculatorService.convert_currency(amount, from_currency, to_currency)
            return {"success": True, "data": result}

        # Timer tools
        elif tool_name == "set_timer":
            duration_seconds = int(parameters.get("duration_seconds"))
            label = parameters.get("label")
            timer = await TimerService.create_timer(db, duration_seconds, user_id, label)
            return {"success": True, "data": {"id": timer.id, "duration_seconds": timer.duration_seconds, "trigger_time": str(timer.trigger_time)}}
        
        elif tool_name == "set_alarm":
            trigger_time = datetime.fromisoformat(parameters.get("trigger_time"))
            label = parameters.get("label")
            timer = await TimerService.create_alarm(db, trigger_time, user_id, label)
            return {"success": True, "data": {"id": timer.id, "trigger_time": str(timer.trigger_time)}}
        
        elif tool_name == "list_timers":
            timers = await TimerService.get_timers(db, user_id)
            return {"success": True, "data": {"timers": [{"id": t.id, "type": t.type.value, "trigger_time": str(t.trigger_time), "status": t.status.value} for t in timers]}}
        
        elif tool_name == "cancel_timer":
            timer_id = parameters.get("timer_id")
            timer = await TimerService.cancel_timer(db, timer_id, user_id)
            if not timer:
                return {"success": False, "error": "Timer not found"}
            return {"success": True, "data": {"message": "Timer cancelled"}}

        else:
            return {"success": False, "error": f"Unknown tool: {tool_name}"}
