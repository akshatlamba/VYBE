
from fastapi import FastAPI

from app.students import router as student_router
from app.pulse import router as pulse_router
from app.world_action import router as world_action_router
from app.growth_passport import router as growth_passport_router


app = FastAPI(
    title="VYBE API",
    description="Backend for the VYBE Student Growth Ecosystem",
    version="1.0.0"
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
