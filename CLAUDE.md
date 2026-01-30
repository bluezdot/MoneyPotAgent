# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoneyPotAgent is an AI Financial Health Coach - a full-stack application that helps users achieve financial goals through AI-powered coaching, real-time expense tracking, and pot-based salary allocation. The AI coach negotiates with users about spending decisions and shows purchase impacts on long-term goals.

## Commands

### Full Stack (Docker)

```bash
docker compose up --build      # Start all services (frontend:3000, backend:8000, postgres:5432)
docker compose down            # Stop all services
```

### Frontend (from /frontend)

```bash
pnpm install                   # Install dependencies
pnpm dev                       # Dev server at localhost:5173
pnpm build                     # Type-check + production build
pnpm lint                      # ESLint
```

### Backend (from /backend)

```bash
uv sync                        # Install dependencies
uv run uvicorn app.main:app --reload --port 8000   # Dev server
uv run alembic upgrade head    # Run migrations
uv run alembic revision --autogenerate -m "description"  # Create migration
```

## Architecture

### Tech Stack

- **Frontend:** React 19, TypeScript, Vite (rolldown), Tailwind CSS 4, shadcn/ui, React Router 7, TanStack Query, Zustand
- **Backend:** FastAPI, SQLAlchemy 2.0 (async), PostgreSQL, Pydantic 2, Alembic
- **AI:** OpenAI GPT-4o with SSE streaming, Opik for observability
- **Package Managers:** pnpm (frontend), uv (backend)

### Service Communication

- Frontend calls backend at `/api/v1/*`
- MVP auth uses `X-User-ID` header (UUID) - not JWT
- AI chat uses Server-Sent Events for streaming responses

### Key Data Flow

```sh
User → Pots (salary allocation buckets by percentage)
       └→ Goals (financial targets with deadlines)
          └→ Milestones (sub-goals within goals)
       └→ Expenses (transactions deducted from pots)

User → ChatSessions → ChatMessages (AI coach conversations)
```

### Pot Categories

`necessities`, `wants`, `savings`, `investments`, `emergency` - percentages must sum to 100

### Frontend State Management

- **Server state:** TanStack Query (`useQuery`, `useMutation`)
- **Client state:** Zustand stores in `src/stores/` with Immer middleware and localStorage persistence
- **Path alias:** `@/` maps to `src/`

### Backend Service Layer

Services in `app/services/` contain business logic, injected via FastAPI's `Depends()`. Routes in `app/api/v1/` are thin wrappers.

### AI Coach Architecture

- `app/ai/client.py` - AsyncOpenAI + Opik setup
- `app/ai/coach.py` - AICoach class with streaming generation
- `app/ai/prompts/` - System prompts and context builders
- Coach receives full user context (pots, goals, expenses) for personalized responses

## Environment Variables

Backend requires `.env` file (copy from `.env.example`):

```sh
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/moneypot
OPENAI_API_KEY=sk-...
OPIK_API_KEY=...          # Optional
DEBUG=true
CORS_ORIGINS=["http://localhost:5173"]
```

## API Endpoints

| Endpoint | Purpose |
| -------- | ------- |
| `POST /api/v1/chat/sessions/{id}/messages` | Send message, receive SSE stream |
| `POST /api/v1/impact` | Analyze purchase impact on goals |
| `/api/v1/users`, `/pots`, `/goals`, `/expenses` | Standard CRUD |
| `/api/v1/analytics` | Dashboard insights |
| `GET /docs` | OpenAPI docs (debug mode only) |
