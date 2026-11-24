import re
import json
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database.connection import get_db
from app.database.models import Student, StudentProfile
from app.auth import get_current_student, verify_student_ownership

router = APIRouter()


# ==========================================
# SCHEMAS
# ==========================================

class StudentCreate(BaseModel):
    name: str
    email: str
    interest: str
    skill_level: str
    goal: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip().lower()
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", value):
            raise ValueError("Please provide a valid email address.")
        return value


class StudentUpdate(BaseModel):
    name: str | None = None
    interest: str | None = None
    skill_level: str | None = None
    goal: str | None = None


class StudentProfileCreate(BaseModel):
    skills: str | list[str] | None = None
    experience: str | None = None
    career_goal: str | None = None
    learning_preference: str | None = None
    academic_year: str | None = None
    department: str | None = None
    location: str | None = None
    availability: str | None = None
    budget_max: int | None = None
    preferred_format: str | None = None
    interests: str | list[str] | None = None


class StudentProfileUpdate(BaseModel):
    skills: str | list[str] | None = None
    experience: str | None = None
    career_goal: str | None = None
    learning_preference: str | None = None
    academic_year: str | None = None
    department: str | None = None
    location: str | None = None
    availability: str | None = None
    budget_max: int | None = None
    preferred_format: str | None = None
    interests: str | list[str] | None = None


# ==========================================
# HELPERS
# ==========================================

def parse_dna_profile(student: Student, profile: StudentProfile | None) -> dict:
    """Format full structured Student DNA from Student and StudentProfile models."""
    if not profile:
        return {
            "id": None,
            "student_id": student.id,
            "name": student.name,
            "email": student.email,
            "interest": student.interest,
            "skill_level": student.skill_level,
            "goal": student.goal,
            "skills": [],
            "experience": None,
            "career_goal": None,
            "learning_preference": None,
            "academic_year": "2nd Year",
            "department": "Computer Science",
            "location": "India",
            "availability": "Part-time (5-10 hrs/wk)",
            "budget_max": 1000,
            "preferred_format": "any",
            "interests": [student.interest] if student.interest else []
        }

    # Format skills as list if stored as string
    skills_val = profile.skills
    if isinstance(skills_val, str):
        if skills_val.startswith("["):
            try:
                skills_val = json.loads(skills_val)
            except Exception:
                skills_val = [s.strip() for s in skills_val.split(",") if s.strip()]
        else:
            skills_val = [s.strip() for s in skills_val.split(",") if s.strip()]
    elif not skills_val:
        skills_val = []

    # Parse metadata from experience field if stored as JSON
    exp_text = profile.experience or ""
    metadata = {}
    if exp_text.startswith("{") and exp_text.endswith("}"):
        try:
            metadata = json.loads(exp_text)
            exp_text = metadata.get("experience_notes", "")
        except Exception:
            metadata = {}

    academic_year = (
        getattr(profile, "academic_year", None)
        if hasattr(profile.__class__, "academic_year")
        else None
    ) or metadata.get("academic_year", "2nd Year")

    department = (
        getattr(profile, "department", None)
        if hasattr(profile.__class__, "department")
        else None
    ) or metadata.get("department", "Computer Science")

    location = (
        getattr(profile, "location", None)
        if hasattr(profile.__class__, "location")
        else None
    ) or metadata.get("location", "India")

    availability = (
        getattr(profile, "availability", None)
        if hasattr(profile.__class__, "availability")
        else None
    ) or metadata.get("availability", "Part-time (5-10 hrs/wk)")

    budget_max = (
        getattr(profile, "budget_max", None)
        if hasattr(profile.__class__, "budget_max")
        else None
    ) or metadata.get("budget_max", 1000)

    preferred_format = (
        getattr(profile, "preferred_format", None)
        if hasattr(profile.__class__, "preferred_format")
        else None
    ) or metadata.get("preferred_format", "any")

    interests_val = (
        getattr(profile, "interests", None)
        if hasattr(profile.__class__, "interests")
        else None
    ) or metadata.get("interests", [student.interest] if student.interest else [])

    if isinstance(interests_val, str):
        interests_val = [i.strip() for i in interests_val.split(",") if i.strip()]

    return {
        "id": profile.id,
        "student_id": student.id,
        "name": student.name,
        "email": student.email,
        "interest": student.interest,
        "skill_level": student.skill_level,
        "goal": student.goal,
        "skills": skills_val,
        "experience": exp_text,
        "career_goal": profile.career_goal,
        "learning_preference": profile.learning_preference,
        "academic_year": academic_year,
        "department": department,
        "location": location,
        "availability": availability,
        "budget_max": budget_max,
        "preferred_format": preferred_format,
        "interests": interests_val
    }


def pack_profile_metadata(payload: StudentProfileCreate | StudentProfileUpdate, existing_exp: str | None = None) -> str:
    """Pack extended DNA parameters safely into JSON string stored in experience field."""
    meta = {}
    if existing_exp and existing_exp.startswith("{") and existing_exp.endswith("}"):
        try:
            meta = json.loads(existing_exp)
        except Exception:
            meta = {"experience_notes": existing_exp}

    if payload.experience is not None:
        meta["experience_notes"] = payload.experience
    if payload.academic_year is not None:
        meta["academic_year"] = payload.academic_year
    if payload.department is not None:
        meta["department"] = payload.department
    if payload.location is not None:
        meta["location"] = payload.location
    if payload.availability is not None:
        meta["availability"] = payload.availability
    if payload.budget_max is not None:
        meta["budget_max"] = payload.budget_max
    if payload.preferred_format is not None:
        meta["preferred_format"] = payload.preferred_format
    if payload.interests is not None:
        meta["interests"] = payload.interests if isinstance(payload.interests, list) else [i.strip() for i in payload.interests.split(",") if i.strip()]

    return json.dumps(meta)


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
                "id": s.id,
                "name": s.name,
                "email": s.email,
                "interest": s.interest,
                "skill_level": s.skill_level,
                "goal": s.goal
            }
            for s in students
        ]
    }


# ==========================================
# GET ONE STUDENT BY ID
# ==========================================

@router.get("/{student_id}")
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_student: Student | None = Depends(get_current_student)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    
    verify_student_ownership(student_id, current_student)
    profile = db.query(StudentProfile).filter(StudentProfile.student_id == student_id).first()
    return parse_dna_profile(student, profile)


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
# UPDATE STUDENT BASIC INFO
# ==========================================

@router.put("/{student_id}")
def update_student(
    student_id: int,
    payload: StudentUpdate,
    db: Session = Depends(get_db),
    current_student: Student | None = Depends(get_current_student)
):
    verify_student_ownership(student_id, current_student)
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    updates = payload.model_dump(exclude_unset=True)
    for field, val in updates.items():
        setattr(student, field, val)

    db.commit()
    db.refresh(student)
    profile = db.query(StudentProfile).filter(StudentProfile.student_id == student_id).first()
    return parse_dna_profile(student, profile)


# ==========================================
# GET STUDENT DNA PROFILE
# ==========================================

@router.get("/{student_id}/profile")
def get_student_profile(
    student_id: int,
    db: Session = Depends(get_db),
    current_student: Student | None = Depends(get_current_student)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    verify_student_ownership(student_id, current_student)
    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student_id
    ).first()

    return {
        "success": True,
        "profile": parse_dna_profile(student, profile)
    }


# ==========================================
# CREATE OR UPDATE STUDENT DNA PROFILE (POST / PUT)
# ==========================================

@router.post("/{student_id}/profile")
@router.put("/{student_id}/profile")
def upsert_student_profile(
    student_id: int,
    profile_data: StudentProfileCreate,
    db: Session = Depends(get_db),
    current_student: Student | None = Depends(get_current_student)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    verify_student_ownership(student_id, current_student)

    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student_id
    ).first()

    # Format skills to string if passed as list
    skills_str = profile_data.skills
    if isinstance(skills_str, list):
        skills_str = ", ".join(skills_str)

    packed_exp = pack_profile_metadata(profile_data, profile.experience if profile else None)

    if profile:
        # Update existing profile
        if profile_data.skills is not None:
            profile.skills = skills_str
        if profile_data.career_goal is not None:
            profile.career_goal = profile_data.career_goal
        if profile_data.learning_preference is not None:
            profile.learning_preference = profile_data.learning_preference
        profile.experience = packed_exp
    else:
        # Create new profile
        profile = StudentProfile(
            student_id=student_id,
            skills=skills_str,
            experience=packed_exp,
            career_goal=profile_data.career_goal,
            learning_preference=profile_data.learning_preference
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)

    return {
        "success": True,
        "message": "Student DNA profile saved successfully!",
        "profile": parse_dna_profile(student, profile)
    }


# ==========================================
# PARTIAL UPDATE STUDENT DNA PROFILE (PATCH)
# ==========================================

@router.patch("/{student_id}/profile")
def patch_student_profile(
    student_id: int,
    profile_data: StudentProfileUpdate,
    db: Session = Depends(get_db),
    current_student: Student | None = Depends(get_current_student)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    verify_student_ownership(student_id, current_student)

    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student_id
    ).first()

    if not profile:
        # If no profile exists, create it
        create_payload = StudentProfileCreate(**profile_data.model_dump(exclude_unset=True))
        return upsert_student_profile(student_id, create_payload, db, current_student)

    if profile_data.skills is not None:
        skills_val = profile_data.skills
        if isinstance(skills_val, list):
            skills_val = ", ".join(skills_val)
        profile.skills = skills_val

    if profile_data.career_goal is not None:
        profile.career_goal = profile_data.career_goal
    if profile_data.learning_preference is not None:
        profile.learning_preference = profile_data.learning_preference

    profile.experience = pack_profile_metadata(profile_data, profile.experience)

    db.commit()
    db.refresh(profile)

    return {
        "success": True,
        "message": "Student DNA profile updated successfully!",
        "profile": parse_dna_profile(student, profile)
    }
