
# VYBE Backend

**Your World. Your Guide. Your Growth.**

VYBE is a student growth ecosystem designed to connect global trends with personalized learning, relevant opportunities and measurable student progress.

The backend powers VYBE's student profiles, AI guidance, personalized recommendations, event discovery, watchlists, calendar exports and notification workflows.

---

## 1. Technology Stack

| Component | Technology |
|---|---|
| Backend framework | Python, FastAPI |
| Database | PostgreSQL |
| Database hosting | Supabase |
| ORM | SQLAlchemy |
| AI integration | Google Gemini API |
| Validation | Pydantic |
| Email reminders | Resend |
| API documentation | Swagger UI |
| Database driver | Psycopg 3 |

---

## 2. Backend Architecture

```text
VYBE Backend
│
├── Student Management
│   ├── Student Registration
│   └── Student DNA Profiles
│
├── AI Guidance
│   ├── PULSE
│   ├── World Pulse
│   ├── Recommendations
│   └── Personalized Roadmaps
│
├── World-to-Action
│   ├── Trend Relevance
│   ├── Action Recommendations
│   └── Learning Roadmaps
│
├── Growth Passport
│   ├── Projects
│   ├── Milestones
│   └── Project Evidence
│
├── Opportunity & Event Management
│   ├── Event Discovery
│   ├── Student Watchlists
│   └── Calendar Export
│
└── Notification System
    ├── In-App Notifications
    ├── Email Reminders
    └── Scheduled Reminder Worker
```

---

## 3. Project Structure

```text
backend/
│
├── app/
│   ├── main.py
│   ├── students.py
│   ├── pulse.py
│   ├── sample_data.py
│   ├── recommendations.py
│   ├── roadmap.py
│   ├── world_action.py
│   ├── growth_passport.py
│   ├── events.py
│   ├── reminder_service.py
│   ├── notifications.py
│   ├── email_service.py
│   ├── worker.py
│   │
│   └── database/
│       ├── __init__.py
│       ├── connection.py
│       ├── models.py
│       ├── init_db.py
│       └── test_connection.py
│
├── requirements.txt
├── .env
├── .env.example
├── .gitignore
└── BACKEND_README.md
```

---

## 4. Installation and Setup

### Prerequisites

- Python 3.10 or later
- Git
- Supabase account
- Gemini API key
- Resend account for email delivery

### Clone the repository

```bash
git clone https://github.com/akshatlamba/VYBE.git
cd VYBE/backend
```

### Create a virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### Install dependencies

```powershell
pip install -r requirements.txt
```

### Configure environment variables

Create a `.env` file using `.env.example`.

Configure the following variables:

```env
DATABASE_URL=your_supabase_postgresql_connection_string
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=VYBE <onboarding@resend.dev>
```

Use your own credentials. Never commit `.env` or expose API keys in frontend code.

---

## 5. Database Configuration

VYBE uses PostgreSQL hosted through Supabase.

SQLAlchemy manages database operations.

Main database models include:

- Student
- StudentProfile
- Project
- Milestone
- ProjectEvidence
- Event
- EventWatchlist
- Reminder
- Notification

Initialize missing database tables:

```powershell
python -m app.database.init_db
```

Test the database connection:

```powershell
python -m app.database.test_connection
```

Note: SQLAlchemy `create_all()` creates missing tables but does not automatically migrate existing table structures.

---

## 6. Starting the Backend

From the backend directory:

```powershell
uvicorn app.main:app --reload
```

Backend address:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

Health check:

http://127.0.0.1:8000/health

---

## 7. API Endpoints

### General

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Backend welcome |
| GET | `/health` | Health check |

### Student Management

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/students/` | List students |
| POST | `/students/` | Register student |
| POST | `/students/{id}/profile` | Create Student DNA |
| GET | `/students/{id}/profile` | Retrieve Student DNA |

### PULSE

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/pulse/ask` | Ask the PULSE AI assistant |

### World-to-Action

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/world-to-action/{id}` | Generate personalized action workflow |

### Events and Watchlists

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/events/` | Create an event |
| GET | `/events/` | Discover events |
| GET | `/events/{event_id}` | Retrieve an event |
| POST | `/events/watchlist` | Save an event |
| GET | `/events/watchlist/{student_id}` | View saved events |
| PATCH | `/events/watchlist/{student_id}/{event_id}` | Update reminder and calendar preferences |
| DELETE | `/events/watchlist/{student_id}/{event_id}` | Remove a saved event |
| GET | `/events/calendar/{student_id}` | Retrieve calendar events |
| GET | `/events/calendar/{student_id}/export.ics` | Export saved events as an iCalendar file |

### Notifications

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/notifications/{student_id}` | Retrieve notifications |
| PATCH | `/notifications/{notification_id}/read` | Mark a notification as read |
| PATCH | `/notifications/{student_id}/read-all` | Mark all notifications as read |
| GET | `/notifications/{student_id}/unread-count` | Get unread notification count |

### Growth Passport

Growth Passport provides APIs for managing student projects, milestones and project evidence.

Refer to the interactive Swagger documentation for the registered Growth Passport routes and request schemas.

---

## 8. Event Reminder Workflow

The event reminder system follows this workflow:

```text
Student discovers an event
          |
          v
Student saves the event
          |
          v
Reminder preferences are stored
          |
          v
Reminder is scheduled
          |
          v
Background worker checks due reminders
          |
          v
Notification preferences are checked
          |
          v
In-app notification / Email
          |
          v
Reminder status is updated
```

### Reminder configuration

Students can configure:

- Reminder enabled or disabled
- Reminder time before an event
- Email notifications
- In-app notifications
- Calendar export preference

The reminder worker processes scheduled reminders and tracks their status and retry attempts.

### Start the reminder worker

Open a separate PowerShell terminal.

Navigate to the backend directory and activate the virtual environment.

Run:

```powershell
python -m app.worker
```

Keep the worker running separately from the FastAPI server.

---

## 9. Email Notifications

VYBE uses Resend for event reminder emails.

Email functionality includes:

- Event title
- Event date and time
- Event venue
- Registration details when available

Email delivery requires valid Resend configuration and an authorized sender identity.

The email integration should be tested using an eligible, verified sender configuration.

---

## 10. Calendar Export

VYBE supports exporting selected saved events in the `.ics` iCalendar format.

Students can:

1. Save an event to their watchlist.
2. Enable the calendar export preference.
3. Request their calendar export.
4. Import the downloaded `.ics` file into Google Calendar or another compatible calendar application.

Current implementation provides calendar-file export. Automatic Google OAuth synchronization and two-way calendar synchronization are not implemented.

---

## 11. AI and Personalization

VYBE uses Gemini API integration to support PULSE and personalized student guidance.

The World-to-Action workflow connects:

```text
Student DNA
     |
     v
World Pulse Trends
     |
     v
Personalized Relevance
     |
     v
Recommended Actions
     |
     v
Learning Roadmap
     |
     v
Relevant Opportunities
     |
     v
Growth Passport
```

World Pulse and Opportunity Radar currently use prototype sample data where applicable.

Recommendation scores are prototype relevance scores, not verified eligibility or success probabilities.

---

## 12. Testing

Use Swagger UI:

http://127.0.0.1:8000/docs

Recommended testing sequence:

1. Check backend health.
2. Register a student.
3. Create and retrieve a Student DNA profile.
4. Test PULSE.
5. Test the World-to-Action workflow.
6. Create and retrieve events.
7. Add events to a student watchlist.
8. Update reminder preferences.
9. Retrieve calendar events.
10. Export an `.ics` calendar file.
11. Test notification endpoints.
12. Run the reminder worker with suitable test data and configuration.

---

## 13. Security and Development Notes

- Keep database credentials and API keys in `.env`.
- Never commit secrets to GitHub.
- Use `.env.example` for placeholder configuration only.
- Database operations use SQLAlchemy.
- Event URLs are validated for HTTP and HTTPS schemes.
- The current prototype uses student IDs in API paths and does not yet implement complete authenticated ownership checks.
- Supabase Auth integration and secure account-to-student linking remain future work.
- Calendar export is not equivalent to automatic Google account synchronization.

---

## 14. Current Development Scope

The backend prototype includes:

- Student registration and profile management
- Gemini-powered PULSE integration
- World-to-Action workflow
- Personalized recommendations and roadmaps
- Growth Passport data models and APIs
- Event discovery and watchlists
- Configurable reminder preferences
- Background reminder processing
- In-app notification APIs
- Resend email integration
- iCalendar export

Some integrations require external credentials and end-to-end verification before production use.

---

## Team

**Team Name:** Code Storm

**Project:** VYBE

**Tagline:** Your World. Your Guide. Your Growth.
