
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.students import router as student_router
from app.pulse import router as pulse_router
from app.world_action import router as world_action_router
from app.growth_passport import router as growth_passport_router
from app.events import router as events_router
from app.calendar import router as calendar_router
from app.notifications import router as notifications_router
from app.community import router as community_router
from app.database.connection import engine
from app.database.models import Base
from app.database.seed_data import seed

# Auto-initialize database tables and seed sample records
try:
    Base.metadata.create_all(bind=engine)
    seed()
except Exception as e:
    print(f"Notice: Database init check: {e}")


app = FastAPI(
    title="VYBE API",
    description="Backend for the VYBE Student Growth Ecosystem",
    version="1.0.0"
)

# Enable CORS for local Next.js frontend and student clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to VYBE!",
        "status": "Backend is running successfully"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "project": "VYBE"
    }


app.include_router(
    student_router,
    prefix="/students",
    tags=["Students"]
)

app.include_router(
    notifications_router,
    prefix="/notifications",
    tags=["Notifications"]
)

app.include_router(
    pulse_router,
    prefix="/pulse",
    tags=["PULSE AI"]
)

app.include_router(
    world_action_router,
    prefix="/world-to-action",
    tags=["World-to-Action"]
)

app.include_router(
    growth_passport_router,
    prefix="/growth-passport",
    tags=["Growth Passport"]
)

app.include_router(
    events_router,
    prefix="/events",
    tags=["Events & Watchlist"]
)


app.include_router(
    calendar_router,
    prefix="/calendar",
    tags=["Student Calendar"]
)

app.include_router(community_router, prefix="/community", tags=["Community"])