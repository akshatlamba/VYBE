
# VYBE Backend

VYBE is a student growth ecosystem that connects trends,
personalized guidance, learning roadmaps and opportunities.

## Technology Stack

- Python
- FastAPI
- PostgreSQL
- Supabase
- SQLAlchemy
- Gemini API

## Project Structure

backend/
├── app/
│   ├── main.py
│   ├── students.py
│   ├── pulse.py
│   ├── sample_data.py
│   ├── recommendations.py
│   ├── roadmap.py
│   ├── world_action.py
│   └── database/
│       ├── connection.py
│       ├── models.py
│       ├── init_db.py
│       └── test_connection.py
├── requirements.txt
├── .env.example
└── .gitignore

## Setup

1. Install Python.
2. Create and activate a virtual environment.
3. Install dependencies:

   pip install -r requirements.txt

4. Create a .env file using .env.example.
5. Add your own Supabase and Gemini credentials.

## Start Backend

uvicorn app.main:app --reload

## API Documentation

http://127.0.0.1:8000/docs

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | / | Backend welcome |
| GET | /health | Health check |
| GET | /students/ | List students |
| POST | /students/ | Register student |
| POST | /students/{id}/profile | Create Student DNA |
| GET | /students/{id}/profile | Retrieve Student DNA |
| POST | /pulse/ask | Ask PULSE |
| GET | /world-to-action/{id} | Personalized workflow |

## World-to-Action Workflow

Student DNA
→ World Pulse sample trends
→ Recommendation engine
→ Personalized action plan
→ Project roadmap
→ Opportunity Radar

## Development Notes

World Pulse and Opportunity Radar currently use
clearly labelled sample data.

Recommendation scores are prototype relevance scores,
not verified eligibility or success probabilities.
