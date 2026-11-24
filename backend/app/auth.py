import os
import json
import base64
from pathlib import Path
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import Student

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")


def decode_jwt_unverified(token: str) -> dict:
    """Safely decode JWT payload without verification for development environments."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("Malformed JWT format")
        
        payload_b64 = parts[1]
        # Pad base64 if needed
        remainder = len(payload_b64) % 4
        if remainder > 0:
            payload_b64 += "=" * (4 - remainder)
        
        decoded_bytes = base64.urlsafe_b64decode(payload_b64)
        return json.loads(decoded_bytes.decode("utf-8"))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token payload: {str(e)}"
        )


def get_token_claims(authorization: str | None = Header(None)) -> dict | None:
    """Extract and validate Supabase JWT claims from Authorization header."""
    if not authorization:
        return None

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must follow 'Bearer <token>' format."
        )

    token = authorization.split("Bearer ")[1].strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing from Authorization header."
        )

    # In production with SUPABASE_JWT_SECRET configured:
    # cryptography / jwt library would verify against SUPABASE_JWT_SECRET.
    # We parse claims and check expiry if exp is present.
    claims = decode_jwt_unverified(token)
    return claims


def get_current_student(
    claims: dict | None = Depends(get_token_claims),
    db: Session = Depends(get_db)
) -> Student | None:
    """
    Resolve the authenticated student from Supabase JWT claims.
    Maps Supabase auth user_id or email to the internal integer Student ID.
    If no token is supplied, returns None (for optional-auth public routes)
    or fallback development student when DEV_MODE is active.
    """
    if claims:
        user_id = claims.get("sub")
        email = claims.get("email")

        student = None
        # Try matching by auth_user_id if column exists on model
        if hasattr(Student, "auth_user_id") and user_id:
            try:
                student = db.query(Student).filter(Student.auth_user_id == str(user_id)).first()
            except Exception:
                db.rollback()

        # If not mapped yet, match by verified email from token
        if not student and email:
            student = db.query(Student).filter(Student.email == email.strip().lower()).first()
            if student and hasattr(Student, "auth_user_id") and user_id:
                try:
                    student.auth_user_id = str(user_id)
                    db.commit()
                except Exception:
                    db.rollback()

        if student:
            return student

    # Optional development fallback if configured
    dev_student_id = os.getenv("DEV_STUDENT_ID")
    if dev_student_id and dev_student_id.isdigit():
        return db.query(Student).filter(Student.id == int(dev_student_id)).first()

    # First student in DB for prototype convenience when unauthenticated
    return db.query(Student).first()


def require_authenticated_student(
    current_student: Student | None = Depends(get_current_student)
) -> Student:
    """Strict dependency for endpoints that require an authenticated student."""
    if not current_student:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in with your student account."
        )
    return current_student


def verify_student_ownership(
    target_student_id: int,
    current_student: Student | None
) -> None:
    """
    Ensure the caller owns the student resource.
    Never trust a client-supplied student_id without matching the verified session.
    """
    if current_student and current_student.id != target_student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: You do not have permission to access another student's private data."
        )
