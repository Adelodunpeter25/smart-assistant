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
                    "title": {"type": "string", "description": "Short task title (2-10 words)"},
                    "description": {"type": "string", "description": "Optional detailed description"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high"], "description": "Task priority (default: medium)"},
                    "due_date": {"type": "string", "description": "Due date in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)"},
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
            "description": "Mark a task as completed. Requires task ID - if user provides task name, use list_tasks first to get the ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer", "description": "Task ID (must be integer)"},
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
            "description": "Search the web for information. Keep queries simple and focused. Extract key search terms from user's question.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string", 
                        "description": "Simple search query with 2-5 keywords. Examples: 'Python tutorials', 'FastAPI authentication', 'asyncio vs threading'. Avoid full sentences or questions."
                    },
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
            "description": "Perform mathematical calculation. Use standard Python math operators: +, -, *, /, **, %, abs(), round(), min(), max()",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string", 
                        "description": "Math expression as string. Examples: '25 * 48 + 100', '0.15 * 2500', 'round(123.456, 2)'. Convert percentages to decimals."
                    },
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
            "description": "Convert currency using live exchange rates. Use 3-letter ISO currency codes.",
            "parameters": {
                "type": "object",
                "properties": {
                    "amount": {"type": "number", "description": "Amount to convert (must be number)"},
                    "from_currency": {
                        "type": "string", 
                        "description": "Source currency code (3 letters, uppercase). Common: USD, EUR, GBP, NGN, JPY, CAD, AUD"
                    },
                    "to_currency": {
                        "type": "string", 
                        "description": "Target currency code (3 letters, uppercase). Common: USD, EUR, GBP, NGN, JPY, CAD, AUD"
                    },
                },
                "required": ["amount", "from_currency", "to_currency"],
            },
        },
    },
]
