# Smart Assistant

AI-powered personal assistant with natural language processing, task automation, and intelligent conversation capabilities.

## Features

Tasks • Calendar • Notes • Email • Web Search • Calculator • Currency Conversion

## Tech Stack

Python 3.13 • FastAPI • PostgreSQL 15 • Groq/Workers AI • SQLAlchemy • uv

## Quick Start

```bash
cd backend
make install          # Install dependencies
cp .env.example .env  # Add API keys
make db-up            # Start PostgreSQL
make migrate-up       # Run migrations
make dev              # Start server (http://localhost:8000)
```

## API Keys

- **CLOUDFLARE_ACCOUNT_ID** & **CLOUDFLARE_API_TOKEN**: [dash.cloudflare.com](https://dash.cloudflare.com) (recommended)
- **GROQ_API_KEY**: [console.groq.com](https://console.groq.com) (alternative)
- **EXCHANGERATE_API_KEY**: [exchangerate-api.com](https://www.exchangerate-api.com)
- **RESEND_API_KEY**: [resend.com](https://resend.com)

## Usage

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Add buy groceries to my todo"}'
```

**Examples:** "List my tasks" • "Convert 2000 USD to NGN" • "Search for Python tutorials" • "Calculate 15% of 2500" • "Schedule meeting tomorrow 3pm"

## Available Tools (16)

**Tasks:** create, list, complete, delete  
**Calendar:** create_event, list_events, delete_event  
**Notes:** create, list, search, delete  
**Utilities:** send_email, search_web, calculate, convert_currency

## Commands

`make install` • `make dev` • `make db-up` • `make db-reset` • `make migrate-up` • `make test`

## Docs

- Swagger: [localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [localhost:8000/redoc](http://localhost:8000/redoc)

## License

MIT
