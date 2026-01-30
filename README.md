# MoneyPotAgent

**AI Financial Health Coach** - Your personal financial coach that helps you achieve long-term goals through intelligent pot-based salary allocation, real-time expense tracking, and AI-powered negotiation.

## Overview

MoneyPotAgent is not just another budgeting app. It's a **Financial Health Coach**, **Negotiator**, **Goal Guardian**, and **Behavioral Change Agent** that:

- Creates personalized financial roadmaps toward your goals
- Actively monitors your progress with milestones
- Negotiates and nudges you toward better spending decisions
- Shows the real impact of daily purchases on long-term goals
- Adapts plans dynamically based on your actual behavior

## Features

### Core Capabilities

- **Financial Profile Management** - Track monthly salary, expenses, and allocations
- **Pot-Based Salary Allocation** - Automatically distribute income into categorized pots (necessities, wants, savings, investments, emergency)
- **Goal Setting & Milestones** - Set financial goals with target amounts, deadlines, and trackable milestones
- **Expense Tracking** - Log and categorize expenses with deductions from appropriate pots
- **AI Coaching Chat** - Conversational AI coach with streaming responses for personalized financial guidance
- **Purchase Impact Analysis** - See exactly how a purchase delays or affects your financial goals
- **Dashboard & Analytics** - Visual insights into spending patterns and goal progress

### AI Coach Differentiators

- **Trade-Off Suggestions** - The AI suggests alternatives when you want to make purchases
- **Negotiation Flow** - Collaborative coaching that rewards good behavior rather than punishing spending
- **Quick Actions** - Fast access to common financial tasks and queries

## Tech Stack

| Layer | Technologies |
| ----- | ------------ |
| **Frontend** | React 19, TypeScript, Vite (Rolldown), Tailwind CSS 4, shadcn/ui, React Router 7, TanStack Query, Zustand |
| **Backend** | FastAPI, SQLAlchemy 2.0 (async), PostgreSQL, Pydantic 2, Alembic |
| **AI** | OpenAI GPT-4o with SSE streaming, Opik for observability |
| **Package Managers** | pnpm (frontend), uv (backend) |

## Implementation Progress

| Feature | Status | Progress |
| ------- | ------ | -------- |
| User Financial Profile | ✅ Complete | 100% |
| Pot-Based Allocation | ✅ Complete | 100% |
| Financial Goals & Milestones | ✅ Complete | 100% |
| Expense Tracking | ✅ Complete | 100% |
| AI Coaching Chat | ✅ Complete | 100% |
| Purchase Impact Analysis | ✅ Complete | 100% |
| Dashboard & Analytics | ✅ Complete | 100% |
| Quick Actions | ✅ Complete | 100% |
| Trade-Off Suggestions | ✅ Complete | 100% |
| Reminders & Notifications | ⚠️ Partial | 40% |
| Dynamic Roadmap Updates | ⚠️ Partial | 30% |
| AI Negotiation Flow | ⚠️ Partial | 50% |

## TODO (Unimplemented Features)

- [ ] Tax Implications Tracking
- [ ] Risk Appetite Assessment (low/medium/high profiles)
- [ ] Full Negotiation Feature with reward system
- [ ] Recommendation Engine for spending optimization
- [ ] Third-Party Bank Integrations
- [ ] Budget Enforcement & Overspending Alerts
- [ ] Multi-Currency Support
- [ ] Push Notifications & SMS Reminders
- [ ] Email Transaction Import (card expense parsing)
- [ ] Voice Input for Expenses
- [ ] Calendar Event Integration for milestones
- [ ] Goal completion celebrations & rewards

## Quick Start

### Using Docker (Recommended)

```bash
# Start all services (frontend:3000, backend:8000, postgres:5432)
docker compose up --build

# Stop all services
docker compose down
```

### Manual Setup

**Frontend** (from `/frontend`):

```bash
pnpm install        # Install dependencies
pnpm dev            # Dev server at localhost:5173
pnpm build          # Production build
pnpm lint           # Run ESLint
```

**Backend** (from `/backend`):

```bash
uv sync                                              # Install dependencies
uv run alembic upgrade head                          # Run migrations
uv run uvicorn app.main:app --reload --port 8000     # Dev server
```

### Environment Variables

Create a `.env` file in `/backend` (copy from `.env.example`):

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/moneypot
OPENAI_API_KEY=sk-...
OPIK_API_KEY=...          # Optional - for AI observability
DEBUG=true
CORS_ORIGINS=["http://localhost:5173"]
```

## API Documentation

When running in debug mode, access the OpenAPI docs at `http://localhost:8000/docs`

Key endpoints:

- `POST /api/v1/chat/sessions/{id}/messages` - Send message, receive SSE stream
- `POST /api/v1/impact` - Analyze purchase impact on goals
- `/api/v1/users`, `/pots`, `/goals`, `/expenses` - Standard CRUD
- `/api/v1/analytics` - Dashboard insights

## Architecture

```sh
User → Pots (salary allocation buckets by percentage)
       └→ Goals (financial targets with deadlines)
          └→ Milestones (sub-goals within goals)
       └→ Expenses (transactions deducted from pots)

User → ChatSessions → ChatMessages (AI coach conversations)
```

## License

MIT
