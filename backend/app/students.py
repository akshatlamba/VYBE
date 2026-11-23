
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database.connection import get_db
from app.database.models import Student, StudentProfile

router = APIRouter()


# ==========================================
# BASIC STUDENT REGISTRATION
# ==========================================

class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    interest: str
    skill_level: str
    goal: str


# ==========================================
# STUDENT DNA PROFILE INPUT
# ==========================================

class StudentProfileCreate(BaseModel):
    skills: str | None = None
    experience: str | None = None
    career_goal: str | None = None
    learning_preference: str | None = None


# ==========================================
# GET ALL STUDENTS
# ==========================================

@router.get("/")
def get_students(db: Session = Depends(get_db)):

    students = db.query(Student).all()

    return {
        "total_students": len(students),
        "students": [
            {
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "interest": student.interest,
                "skill_level": student.skill_level,
                "goal": student.goal
            }
            for student in students
        ]
    }


# ==========================================
# REGISTER A NEW STUDENT
# ==========================================

@router.post("/")
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):

    normalized_email = str(student.email).strip().lower()

    existing_student = db.query(Student).filter(
        Student.email == normalized_email
    ).first()

    if existing_student:
        raise HTTPException(
            status_code=409,
            detail="This email is already registered."
        )

    new_student = Student(
        name=student.name.strip(),
        email=normalized_email,
        interest=student.interest,
        skill_level=student.skill_level,
        goal=student.goal
    )

    try:
        db.add(new_student)
        db.commit()
        db.refresh(new_student)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="This email is already registered."
        )

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Student registration failed."
        )

    return {
        "message": "Student registered successfully!",
        "student_id": new_student.id,
        "name": new_student.name,
        "email": new_student.email
    }


# ==========================================
# CREATE STUDENT DNA PROFILE
# ==========================================

@router.post("/{student_id}/profile")
def create_student_profile(
    student_id: int,
    profile: StudentProfileCreate,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    existing_profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student_id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=409,
            detail="Student profile already exists"
        )

    new_profile = StudentProfile(
        student_id=student_id,
        skills=profile.skills,
        experience=profile.experience,
        career_goal=profile.career_goal,
        learning_preference=profile.learning_preference
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return {
        "message": "Student DNA profile created successfully!",
        "profile": {
            "id": new_profile.id,
            "student_id": new_profile.student_id,
            "skills": new_profile.skills,
            "experience": new_profile.experience,
            "career_goal": new_profile.career_goal,
            "learning_preference": new_profile.learning_preference
        }
    }


# ==========================================
# GET STUDENT DNA PROFILE
# ==========================================

@router.get("/{student_id}/profile")
def get_student_profile(
    student_id: int,
    db: Session = Depends(get_db)
):

    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found"
        )

    return {
        "profile": {
            "id": profile.id,
            "student_id": profile.student_id,
            "skills": profile.skills,
            "experience": profile.experience,
            "career_goal": profile.career_goal,
            "learning_preference": profile.learning_preference
        }
    }
