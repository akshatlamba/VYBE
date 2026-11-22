
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from google import genai

from app.database.connection import get_db
from app.database.models import Student, StudentProfile


# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

router = APIRouter()


# Gemini configuration
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = "gemini-3.8-flash"


# Request format
class PulseRequest(BaseModel):
    student_id: int
    question: str = Field(min_length=3, max_length=2000)


@router.post("/ask")
def ask_pulse(
    request: PulseRequest,
    db: Session = Depends(get_db)
):

    # Check API key
    if not API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is not configured."
        )

    # Find student
    student = db.query(Student).filter(
        Student.id == request.student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found."
        )

    # Find Student DNA
    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == request.student_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Student DNA profile not found."
        )

    # Prepare student context
    student_context = f"""
    Student Name: {student.name}
    Interest: {student.interest}
    Current Skill Level: {student.skill_level}
    Basic Goal: {student.goal}

    Skills: {profile.skills or "Not provided"}
    Experience: {profile.experience or "Not provided"}
    Career Goal: {profile.career_goal or "Not provided"}
    Learning Preference: {profile.learning_preference or "Not provided"}
    """

    # Create personalized prompt
    prompt = f"""
    You are PULSE, the AI student guide inside VYBE.

    Your job is to help students understand opportunities,
    develop skills, plan projects, and make learning decisions.

    PERSONALIZATION RULES:
    1. Adapt explanations to the student's current skill level.
    2. Use their interests, skills and career goals.
    3. Give practical and achievable next steps.
    4. Explain technical concepts in beginner-friendly language
       when the student is a beginner.
    5. Never invent opportunities, deadlines or statistics.
    6. Be honest when information is uncertain.
    7. Do not claim that a student has completed something
       unless their profile provides that information.

    STUDENT PROFILE:
    {student_context}

    STUDENT QUESTION:
    {request.question}

    Give a useful, structured and personalized answer.
    """

    # Send request to Gemini
    try:
        client = genai.Client(api_key=API_KEY)

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        answer = response.text

        if not answer:
            raise HTTPException(
                status_code=502,
                detail="PULSE received an empty AI response."
            )

        return {
            "assistant": "PULSE",
            "student_id": student.id,
            "question": request.question,
            "answer": answer
        }

    except HTTPException:
        raise

    except Exception as error:
        print(f"PULSE Gemini error: {type(error).__name__}")

        raise HTTPException(
            status_code=502,
            detail="PULSE is temporarily unable to generate a response. Please try again."
        )