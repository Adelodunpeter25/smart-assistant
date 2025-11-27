"""Tool definitions for LLM function calling."""

TOOLS = [
    # Task tools
    {
        "type": "function",
        "function": {
            "name": "create_task",
            "description": "Create a new task or todo item",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "Task title"},
                    "description": {"type": "string", "description": "Task description"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high"]},
                    "due_date": {"type": "string", "description": "Due date in ISO format"},
                },
                "required": ["title"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "List all tasks or filter by status",
            "parameters": {
                "type": "object",
                "properties": {
                    "status": {"type": "string", "enum": ["pending", "in_progress", "completed"]},
                },
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "complete_task",
            "description": "Mark a task as completed by ID or title",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer", "description": "Task ID"},
                },
                "required": ["task_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Delete a task by ID",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer", "description": "Task ID"},
                },
                "required": ["task_id"],
            },
        },
    },
    # Calendar tools
    {
        "type": "function",
        "function": {
            "name": "create_event",
            "description": "Create a calendar event",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "Event title"},
                    "start_time": {"type": "string", "description": "Start time in ISO format"},
                    "end_time": {"type": "string", "description": "End time in ISO format"},
                    "description": {"type": "string", "description": "Event description"},
                },
                "required": ["title", "start_time", "end_time"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_events",
            "description": "List calendar events",
            "parameters": {
                "type": "object",
                "properties": {
                    "start_date": {"type": "string", "description": "Filter from date (ISO format)"},
                    "end_date": {"type": "string", "description": "Filter to date (ISO format)"},
                },
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "delete_event",
            "description": "Delete a calendar event by ID",
            "parameters": {
                "type": "object",
                "properties": {
                    "event_id": {"type": "integer", "description": "Event ID"},
                },
                "required": ["event_id"],
            },
        },
    },
    # Note tools
    {
        "type": "function",
        "function": {
            "name": "create_note",
            "description": "Create a note",
            "parameters": {
                "type": "object",
                "properties": {
                    "content": {"type": "string", "description": "Note content"},
                    "tags": {"type": "string", "description": "Comma-separated tags"},
                },
                "required": ["content"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_notes",
            "description": "List all notes",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_notes",
            "description": "Search notes by content or tags",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"},
                    "tags": {"type": "string", "description": "Filter by tags"},
                },
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "delete_note",
            "description": "Delete a note by ID",
            "parameters": {
                "type": "object",
                "properties": {
                    "note_id": {"type": "integer", "description": "Note ID"},
                },
                "required": ["note_id"],
            },
        },
    },
    # Email tool
    {
        "type": "function",
        "function": {
            "name": "send_email",
            "description": "Send an email",
            "parameters": {
                "type": "object",
                "properties": {
                    "recipient": {"type": "string", "description": "Email recipient"},
                    "subject": {"type": "string", "description": "Email subject"},
                    "body": {"type": "string", "description": "Email body"},
                },
                "required": ["recipient", "subject", "body"],
            },
        },
    },
    # Search tool
    {
        "type": "function",
        "function": {
            "name": "search_web",
            "description": "Search the web",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"},
                    "max_results": {"type": "integer", "description": "Max results (default 5)", "default": 5},
                },
                "required": ["query"],
            },
        },
    },
    # Calculator tool
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Perform mathematical calculation",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "Math expression"},
                },
                "required": ["expression"],
            },
        },
    },
    # Currency conversion tool
    {
        "type": "function",
        "function": {
            "name": "convert_currency",
            "description": "Convert currency using live exchange rates",
            "parameters": {
                "type": "object",
                "properties": {
                    "amount": {"type": "number", "description": "Amount to convert"},
                    "from_currency": {"type": "string", "description": "Source currency code (e.g., USD, NGN, GBP)"},
                    "to_currency": {"type": "string", "description": "Target currency code (e.g., USD, NGN, GBP)"},
                },
                "required": ["amount", "from_currency", "to_currency"],
            },
        },
    },
]
