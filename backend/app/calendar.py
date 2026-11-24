from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import CalendarEntry, Student


router = APIRouter()


class CalendarEntryCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)
    category: str = Field(default="Personal", max_length=40)

    start_at: datetime
    end_at: Optional[datetime] = None
    all_day: bool = False

    reminder_enabled: bool = False
    reminder_minutes_before: int = Field(default=30, ge=0, le=10080)

    @field_validator("start_at", "end_at")
    @classmethod
    def require_timezone(cls, value):
        if value is not None and value.tzinfo is None:
            raise ValueError("Please provide a timezone-aware date and time.")
        return value

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_at and self.end_at <= self.start_at:
            raise ValueError("End time must be after start time.")
        return self


class CalendarEntryUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=2, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)
    category: Optional[str] = Field(default=None, max_length=40)
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    all_day: Optional[bool] = None
    reminder_enabled: Optional[bool] = None
    reminder_minutes_before: Optional[int] = Field(default=None, ge=0, le=10080)

    @field_validator("start_at", "end_at")
    @classmethod
    def require_timezone(cls, value):
        if value is not None and value.tzinfo is None:
            raise ValueError("Please provide a timezone-aware date and time.")
        return value


class CalendarEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    title: str
    description: Optional[str]
    category: str
    start_at: datetime
    end_at: Optional[datetime]
    all_day: bool
    reminder_enabled: bool
    reminder_minutes_before: int
    created_at: datetime
    updated_at: datetime


def get_student_or_404(db: Session, student_id: int):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    return student


@router.get("/{student_id}", response_model=list[CalendarEntryOut])
def get_calendar_entries(
    student_id: int,
    start: Optional[datetime] = Query(default=None),
    end: Optional[datetime] = Query(default=None),
    db: Session = Depends(get_db)
):
    get_student_or_404(db, student_id)

    query = db.query(CalendarEntry).filter(
        CalendarEntry.student_id == student_id
    )

    if start:
        query = query.filter(
            (CalendarEntry.end_at.is_(None) & (CalendarEntry.start_at >= start))
            | (CalendarEntry.end_at >= start)
        )

    if end:
        query = query.filter(CalendarEntry.start_at <= end)

    return query.order_by(CalendarEntry.start_at.asc()).all()


@router.post(
    "/{student_id}",
    response_model=CalendarEntryOut,
    status_code=status.HTTP_201_CREATED
)
def create_calendar_entry(
    student_id: int,
    payload: CalendarEntryCreate,
    db: Session = Depends(get_db)
):
    get_student_or_404(db, student_id)

    entry = CalendarEntry(
        student_id=student_id,
        **payload.model_dump()
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.patch("/{student_id}/{entry_id}", response_model=CalendarEntryOut)
def update_calendar_entry(
    student_id: int,
    entry_id: int,
    payload: CalendarEntryUpdate,
    db: Session = Depends(get_db)
):
    entry = db.query(CalendarEntry).filter(
        CalendarEntry.id == entry_id,
        CalendarEntry.student_id == student_id
    ).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Calendar entry not found.")

    updates = payload.model_dump(exclude_unset=True)

    new_start = updates.get("start_at", entry.start_at)
    new_end = updates.get("end_at", entry.end_at)

    if new_end is not None and new_end <= new_start:
        raise HTTPException(
            status_code=422,
            detail="End time must be after start time."
        )

    for field, value in updates.items():
        setattr(entry, field, value)

    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{student_id}/{entry_id}")
def delete_calendar_entry(
    student_id: int,
    entry_id: int,
    db: Session = Depends(get_db)
):
    entry = db.query(CalendarEntry).filter(
        CalendarEntry.id == entry_id,
        CalendarEntry.student_id == student_id
    ).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Calendar entry not found.")

    db.delete(entry)
    db.commit()
    return {"success": True, "message": "Calendar entry deleted."}
