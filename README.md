# Smart Assistant

AI-powered personal assistant with natural language processing, task automation, and intelligent conversation capabilities.

## Features

- **Task Management**: Create, list, complete, and delete tasks
- **Calendar**: Schedule and manage events
- **Notes**: Create, search, and organize notes with tags
- **Email**: Send emails via Resend API
- **Web Search**: Search the internet using DuckDuckGo
- **Calculator**: Perform math calculations and currency conversions
- **Natural Language**: Interact using conversational language

## Tech Stack

- **Backend**: Python 3.13, FastAPI
- **Database**: PostgreSQL 15
- **LLM**: Groq (llama-3.3-70b-versatile)
- **ORM**: SQLAlchemy (async)
- **Package Manager**: uv

## Setup

### Prerequisites

- Python 3.13+
- PostgreSQL 15+
- uv package manager

### Installation

1. Clone the repository:
```bash
cd smart-assistant/backend
```

2. Install dependencies:
```bash
make install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Start PostgreSQL:
```bash
make db-up
```

5. Run migrations:
```bash
make migrate-up
```

6. Start the server:
```bash
make dev
```

API will be available at `http://localhost:8000`

## API Keys Required

- `GROQ_API_KEY`: Get from [Groq Console](https://console.groq.com)
- `EXCHANGERATE_API_KEY`: Get from [ExchangeRate-API](https://www.exchangerate-api.com)
- `RESEND_API_KEY`: Get from [Resend](https://resend.com)

## Usage

### Chat Endpoint

Send natural language requests to `/chat`:

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Add buy groceries to my todo list"}'
```

## Available Tools

The AI has access to 16 tools:

1. `create_task` - Create todo items
2. `list_tasks` - View all tasks
3. `complete_task` - Mark task as done
4. `delete_task` - Remove task
5. `create_event` - Schedule calendar event
6. `list_events` - View calendar
7. `delete_event` - Remove event
8. `create_note` - Save note
9. `list_notes` - View notes
10. `search_notes` - Find notes
11. `delete_note` - Remove note
12. `send_email` - Send email
13. `search_web` - Search internet
14. `calculate` - Math operations
15. `convert_currency` - Live exchange rates

### Project Structure

```
backend/
├── app/
│   ├── core/           # Config, database
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   ├── routes/         # API endpoints
│   ├── utils/          # Utilities, prompts, tools
│   └── middleware/     # Logging, CORS
├── migrations/         # Database migrations
├── logs/              # Application logs
└── main.py            # FastAPI app

```

## API Documentation

Interactive API docs available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## License

MIT
