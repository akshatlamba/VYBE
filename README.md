# VYBE — Student Opportunity & Growth Platform

> **Your World. Your Guide. Your Growth.**
>
> Built for **PRASUNEX Innovathon 2026** by **Team CODE STORM**.

VYBE is a student opportunity discovery and growth platform designed to connect what is happening in the world with what an individual student can learn, build, and pursue.

Instead of functioning only as an opportunity listing website, VYBE brings together student profiles, relevant signals, personalized guidance, action planning, event tracking, and a Growth Passport in one connected experience.

## The VYBE Journey

```text
        WORLD PULSE
             |
             v
       PERSONAL RELEVANCE
             |
             v
          PULSE AI
       Guidance & Ideas
             |
             v
        TAKE ACTION
    Projects / Events / Goals
             |
             v
       GROWTH PASSPORT
    Progress / Milestones / Evidence
             |
             +--------> Better-informed next steps
```

**The idea:** Help students move from discovering an opportunity to taking meaningful action and recording their progress.

## Core Features

### 1. World Pulse
A discovery experience for exploring trends, signals, and areas of interest that may matter to students.

### 2. PULSE AI
An AI-assisted student guidance experience that uses student context to provide relevant explanations and suggested actions. The backend supports Google Gemini, with deterministic fallback guidance when live AI is unavailable.

### 3. Personalized Recommendations
A recommendation engine that compares student interests, goals, skills, and skill level with available trend and opportunity data. It produces match scores and explanations for recommendations.

### 4. World-to-Action
A workflow intended to help students turn relevant discoveries into practical next steps.

### 5. Growth Passport
A place to organize student projects, milestones, progress, and supporting evidence.

### 6. Events and Calendar
Backend functionality for event records, student watchlists, calendar entries, and reminder scheduling.

### 7. Community and Notifications
Dedicated backend modules for community-related functionality and student notifications.

### 8. World Graph and Interactive Experience
An interactive visual experience designed to help students explore connections between signals, interests, and opportunities. See the live application for the currently available experience.

> **Prototype data notice:** Some trend and opportunity examples are curated sample data used for demonstration and development. They should not be interpreted as continuously updated live listings.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend framework | Next.js 14 |
| UI library | React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Interactive 3D | Three.js |
| Animation | Motion |
| Frontend validation | Zod |
| Icons | Lucide React |
| Frontend API integration | Next.js API routes and centralized API client |
| Backend framework | Python, FastAPI |
| Backend validation | Pydantic |
| ORM | SQLAlchemy |
| Database support | SQLite and PostgreSQL |
| PostgreSQL driver | Psycopg 3 |
| AI integration | Google GenAI SDK (Gemini) |
| Testing | Vitest and Playwright |
| Authentication integration | Supabase-related frontend/backend integration |

## System Architecture

VYBE uses a separate frontend and Python backend.

```text
                 STUDENT
                    |
                    v
       NEXT.JS FRONTEND (React)
                    |
                    v
          NEXT.JS API ROUTES
                    |
                    v
         CENTRAL API CLIENT
                    |
                    v
           FASTAPI BACKEND
             /          \
            v            v
      SQLAlchemy      AI SERVICE
            |            |
            v            v
       DATABASE       GEMINI
            |
            v
     STUDENT DATA,
     PROJECTS, EVENTS,
     MILESTONES AND MORE
```

### Frontend

The Next.js application handles the user interface, navigation, interactive components, and communication with backend services.

Important frontend directories include:

- `app/` — application pages and route handlers.
- `components/` — reusable UI components.
- `lib/api/` — centralized API communication.
- `lib/` — shared frontend utilities and application logic.
- `public/` — static assets.

### Backend

The Python backend uses FastAPI to expose application APIs and SQLAlchemy to interact with database models.

Important backend modules include:

- `backend/app/main.py` — FastAPI application and route registration.
- `backend/app/database/` — database connection and ORM models.
- `backend/app/students.py` — student-related functionality.
- `backend/app/pulse.py` — PULSE guidance endpoint and AI/fallback logic.
- `backend/app/recommendations.py` — deterministic recommendation logic.
- `backend/app/events.py` — event functionality.
- `backend/app/calendar.py` — calendar functionality.
- `backend/app/community.py` — community functionality.
- `backend/app/notifications.py` — notification functionality.
- `backend/app/growth_passport.py` — Growth Passport functionality.
- `backend/app/world_action.py` — World-to-Action functionality.

## Backend API Groups

The FastAPI application registers the following route groups:

| API group | Responsibility |
|---|---|
| `/students` | Student profile functionality |
| `/pulse` | PULSE guidance |
| `/world-to-action` | Discovery-to-action workflows |
| `/growth-passport` | Projects, milestones, and evidence |
| `/events` | Events and watchlists |
| `/calendar` | Calendar functionality |
| `/community` | Community functionality |
| `/notifications` | Notification functionality |

The application also exposes root and health-check routes.

For the exact endpoint paths, request formats, and response models, refer to the backend route modules and the FastAPI API documentation when the server is running.

## AI and Recommendation Approach

### PULSE AI

PULSE is designed to provide student-oriented guidance using contextual information such as interests, goals, academic background, and skill level.

The backend supports:

- Google Gemini integration through the Google GenAI SDK.
- Configurable model selection using `GEMINI_MODEL`.
- A default model configuration of `gemini-2.5-flash`.
- Deterministic fallback guidance when Gemini is unavailable or not configured.
- Structured responses containing guidance, explanations, and suggested actions.

AI-generated guidance and deterministic fallback responses are distinct execution paths. The application should not represent fallback output as a live Gemini response.

### Recommendation Engine

The backend recommendation logic uses deterministic matching rather than relying on an AI model to decide recommendation scores.

The inspected implementation considers:

- Student interests.
- Student goals and career goals.
- Existing skills.
- Student skill level.
- Opportunity or trend category.
- Related or required skills.
- Beginner-level suitability.

The matching function produces a score capped at 100 and includes reasons explaining the match.

The current sample recommendation data is maintained in the backend sample-data module. Recommendation results should therefore be understood in the context of the data available to the application.

## Database

The Python backend uses SQLAlchemy ORM models.

The inspected database models include:

- `Student`
- `StudentProfile`
- `Project`
- `Milestone`
- `ProjectEvidence`
- `Event`
- `EventWatchlist`
- `Reminder`

### Database configuration

The backend supports:

- Local SQLite for development when `DATABASE_URL` is not provided.
- PostgreSQL through Psycopg 3 when a PostgreSQL connection string is configured.

The repository also contains a Supabase SQL migration with PostgreSQL schema and Row Level Security-related definitions. The migration files and the active backend database connection are separate configuration concerns; deployment configuration determines which database is actually used.

## Local Development Setup

### Prerequisites

- Node.js and npm.
- Python.
- Git.

### 1. Clone the repository

```bash
git clone https://github.com/akshatlamba/VYBE.git
cd VYBE
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the backend

Create a Python virtual environment:

**Windows PowerShell**

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**macOS / Linux**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `backend/.env` file for backend configuration when needed.

Relevant backend configuration variables include:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Optional database connection string; SQLite is used by default |
| `GEMINI_API_KEY` | API key for Google Gemini integration |
| `GEMINI_MODEL` | Optional Gemini model selection |
| `SUPABASE_JWT_SECRET` | Supabase-related authentication configuration |
| `DEV_STUDENT_ID` | Optional development student fallback |

Never commit `.env` files, API keys, database credentials, or other secrets to GitHub.

The exact configuration required depends on which services are being used. The application has a deterministic PULSE fallback when Gemini is not configured.

### 5. Start the backend

From the repository root, with the backend virtual environment activated:

```powershell
uvicorn app.main:app --reload --app-dir backend
```

The backend should be available at:

```text
http://127.0.0.1:8000
```

FastAPI interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Start the frontend

Open a second terminal at the repository root:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If port 3000 is occupied, Next.js may use another available port. Use the URL printed in the terminal.

## Testing

The repository includes frontend and backend testing tools.

### Frontend unit tests

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### End-to-end tests

```bash
npm run test:e2e
```

This uses Playwright.

### Production build

```bash
npm run build
```

These are the available test commands. Test results should be reported from the latest run rather than assumed from the existence of test configuration files.

## Prototype Scope and Current Limitations

VYBE is a working prototype under development. The following distinctions are important:

- Some trend and opportunity content is sample or curated demonstration data.
- Recommendation quality depends on the completeness and accuracy of the available student profile and opportunity data.
- PULSE can use deterministic fallback guidance when live Gemini integration is unavailable.
- Reminder scheduling and notification delivery are separate capabilities; creating a pending reminder does not by itself mean a notification has been delivered.
- Supabase-related authentication code is present, but the current backend JWT handling requires stronger signature verification before it can be considered production-grade authentication.
- Production deployment requires environment-specific database, security, authentication, and service configuration.

## Future Development

Planned areas for continued development include:

- More reliable and regularly refreshed opportunity and signal sources.
- Stronger authentication and authorization.
- More complete integration between student actions, calendar events, and reminders.
- Improved recommendation quality using richer and verified opportunity data.
- More robust evidence verification in the Growth Passport.
- Better deployment monitoring, testing, and performance.
- Further development of the interactive World Graph experience.

## Team Code Storm

Built for PRASUNEX Innovathon 2026.

| Team member | Contribution |
|---|---|
| Ashutosh Singh | UI/UX Design and Architecture |
| Piyush | Backend Development and Database|
| Aashi | Frontend Development |
| Akshat | Frontend Development |
| Anugrah | Database Development |

---

**VYBE — Discover what matters. Understand what fits. Take action. Track your growth.**
