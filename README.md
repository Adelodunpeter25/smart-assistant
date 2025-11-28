# Smart Assistant

AI-powered personal assistant with natural language processing, task automation, and intelligent conversation capabilities.

## Features

Multi-User Auth • Tasks • Calendar • Notes • Email • Web Search • Calculator • Currency Conversion • Timers/Alarms • Real-time Notifications

## Tech Stack

**Backend:** Python 3.13 • FastAPI • PostgreSQL 15 • Redis • Workers AI • Celery • WebSockets • SQLAlchemy • JWT • uv

**Frontend:** React 18 • TypeScript • Vite • TailwindCSS v3 • shadcn/ui • Zustand • React Query • React Router

## Quick Start

### Backend
```bash
cd backend
make install          # Install dependencies
cp .env.example .env  # Add API keys
make db-up            # Start PostgreSQL + Redis
make migrate          # Run migrations
make run              # Start server + Celery (http://localhost:8000)
```

### Frontend
```bash
cd frontend
npm install           # Install dependencies
npm run dev           # Start dev server (http://localhost:5173)
```

## API Keys Required

- **CLOUDFLARE_ACCOUNT_ID** & **CLOUDFLARE_API_TOKEN**: [dash.cloudflare.com](https://dash.cloudflare.com) (recommended LLM)
- **GROQ_API_KEY**: [console.groq.com](https://console.groq.com) (alternative LLM)
- **EXCHANGERATE_API_KEY**: [exchangerate-api.com](https://www.exchangerate-api.com) (currency conversion)
- **RESEND_API_KEY**: [resend.com](https://resend.com) (email sending)
- **JWT_SECRET_KEY**: Generate with `openssl rand -hex 32`

## Available Tools (20)

**Tasks:** create, list, complete, delete (4)  
**Calendar:** create_event, list_events, delete_event (3)  
**Notes:** create, list, search, delete (4)  
**Timers:** set_timer, set_alarm, list_timers, cancel_timer (4)  
**Utilities:** send_email, search_web, calculate, convert_currency (4)  
**Reminder:** add_reminder (1)

## Architecture

### Backend
- **FastAPI** - Async REST API with WebSocket support
- **PostgreSQL** - Primary database for users, tasks, notes, timers, notifications
- **Redis** - Celery broker for background jobs
- **Celery Beat** - Periodic task scheduler (checks timers every 10s)
- **Celery Worker** - Background job processor
- **WebSockets** - Real-time notifications to connected clients
- **JWT** - Stateless authentication (access + refresh tokens)
- **Workers AI** - LLM with function calling (llama-3.3-70b)

### Frontend
- **React 18** - UI library with hooks and functional components
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **TailwindCSS v3** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **React Router** - Client-side routing
- **IndexedDB** - Client-side chat history storage

## Docs

- Swagger: [localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [localhost:8000/redoc](http://localhost:8000/redoc)

## License

MIT
