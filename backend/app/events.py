
from datetime import datetime, timezone
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
    model_validator
)
from sqlalchemy.orm import Session, joinedload

from app.database.connection import get_db
from app.database.models import Event, EventWatchlist, Student
from app.reminder_service import schedule_watchlist_reminder


router = APIRouter()


# ==========================================
# COMMON VALIDATION
# ==========================================

def validate_web_url(value):
    if value is None:
        return value

    parsed = urlparse(value)

    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValueError("URL must start with http:// or https://")

    return value


# ==========================================
# ICALENDAR HELPERS
# ==========================================

def escape_ical_text(value):
    """Escape text according to the iCalendar format."""
    if value is None:
        return ""

    value = str(value)
    value = value.replace("\\", "\\\\")
    value = value.replace("\r\n", "\n")
    value = value.replace("\r", "\n")
    value = value.replace("\n", "\\n")
    value = value.replace(",", "\\,")
    value = value.replace(";", "\\;")

    return value


def format_ical_datetime(value):
    """Convert a timezone-aware datetime to UTC iCalendar format."""
    if value.tzinfo is None:
        raise ValueError("Calendar event datetime must include a timezone.")

    return value.astimezone(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def fold_ical_line(line):
    """Fold long iCalendar lines without splitting UTF-8 characters."""
    encoded = line.encode("utf-8")
    parts = []

    while len(encoded) > 75:
        split_at = 75

        while split_at > 0:
            try:
                part = encoded[:split_at].decode("utf-8")
                break
            except UnicodeDecodeError:
                split_at -= 1

        parts.append(part)
        encoded = encoded[split_at:]

    if encoded:
        parts.append(encoded.decode("utf-8"))

    return "\r\n ".join(parts)


def create_icalendar(events):
    """Build an iCalendar file from a list of VYBE events."""
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//VYBE//Student Event Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH"
    ]

    generated_at = datetime.now(timezone.utc)
    timestamp = format_ical_datetime(generated_at)

    for event in events:
        lines.extend([
            "BEGIN:VEVENT",
            f"UID:vybe-event-{event.id}@vybe",
            f"DTSTAMP:{timestamp}",
            f"DTSTART:{format_ical_datetime(event.start_at)}",
            f"SUMMARY:{escape_ical_text(event.title)}"
        ])

        if event.end_at:
            lines.append(
                f"DTEND:{format_ical_datetime(event.end_at)}"
            )

        if event.description:
            lines.append(
                f"DESCRIPTION:{escape_ical_text(event.description)}"
            )

        if event.venue:
            lines.append(
                f"LOCATION:{escape_ical_text(event.venue)}"
            )

        if event.organizer:
            lines.append(
                f"ORGANIZER;CN={escape_ical_text(event.organizer)}:MAILTO:vybe@example.com"
            )

        if event.registration_url:
            lines.append(
                f"URL:{event.registration_url}"
            )
        elif event.source_url:
            lines.append(
                f"URL:{event.source_url}"
            )

        lines.append("END:VEVENT")

    lines.append("END:VCALENDAR")

    return "\r\n".join(
        fold_ical_line(line) for line in lines
    ) + "\r\n"


# ==========================================
# EVENT SCHEMAS
# ==========================================

class EventCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str | None = None
    organizer: str | None = Field(default=None, max_length=150)
    category: str | None = Field(default=None, max_length=100)

    start_at: datetime
    end_at: datetime | None = None
    registration_deadline: datetime | None = None

    venue: str | None = Field(default=None, max_length=250)
    registration_url: str | None = Field(default=None, max_length=1000)
    source_url: str | None = Field(default=None, max_length=1000)

    @field_validator("start_at", "end_at", "registration_deadline")
    @classmethod
    def require_timezone(cls, value):
        if value is not None and value.tzinfo is None:
            raise ValueError("Please provide a timezone-aware datetime.")
        return value

    @field_validator("registration_url", "source_url")
    @classmethod
    def check_urls(cls, value):
        return validate_web_url(value)

    @model_validator(mode="after")
    def check_event_dates(self):
        if self.end_at and self.end_at <= self.start_at:
            raise ValueError("Event end time must be after start time.")
        return self


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    organizer: str | None
    category: str | None
    start_at: datetime
    end_at: datetime | None
    registration_deadline: datetime | None
    venue: str | None
    registration_url: str | None
    source_url: str | None
    created_at: datetime


# ==========================================
# WATCHLIST SCHEMAS
# ==========================================

class WatchlistCreate(BaseModel):
    student_id: int = Field(gt=0)
    event_id: int = Field(gt=0)

    reminder_enabled: bool = True
    reminder_minutes_before: int = Field(default=1440, ge=0, le=10080)

    notify_email: bool = True
    notify_in_app: bool = True
    sync_to_google_calendar: bool = False


class WatchlistUpdate(BaseModel):
    reminder_enabled: bool | None = None
    reminder_minutes_before: int | None = Field(default=None, ge=0, le=10080)
    notify_email: bool | None = None
    notify_in_app: bool | None = None
    sync_to_google_calendar: bool | None = None


class WatchlistOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    event_id: int
    reminder_enabled: bool
    reminder_minutes_before: int
    notify_email: bool
    notify_in_app: bool
    sync_to_google_calendar: bool
    created_at: datetime
    event: EventOut


# ==========================================
# CREATE EVENT
# ==========================================

@router.post(
    "/",
    response_model=EventOut,
    status_code=status.HTTP_201_CREATED
)
def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db)
):
    new_event = Event(**event_data.model_dump())

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


# ==========================================
# LIST ALL EVENTS
# ==========================================

@router.get("/", response_model=list[EventOut])
def get_events(
    category: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Event)

    if category:
        query = query.filter(Event.category.ilike(f"%{category}%"))

    return query.order_by(Event.start_at.asc()).all()


# ==========================================
# GET ONE EVENT
# ==========================================

@router.get("/{event_id}", response_model=EventOut)
def get_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    return event


# ==========================================
# ADD EVENT TO WATCHLIST
# ==========================================

@router.post(
    "/watchlist",
    response_model=WatchlistOut,
    status_code=status.HTTP_201_CREATED
)
def add_to_watchlist(
    watchlist_data: WatchlistCreate,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == watchlist_data.student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    event = db.query(Event).filter(
        Event.id == watchlist_data.event_id
    ).first()

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    existing_entry = db.query(EventWatchlist).filter(
        EventWatchlist.student_id == watchlist_data.student_id,
        EventWatchlist.event_id == watchlist_data.event_id
    ).first()

    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This event is already in the student's watchlist"
        )

    new_entry = EventWatchlist(**watchlist_data.model_dump())
    new_entry.event = event

    try:
        db.add(new_entry)
        db.flush()

        schedule_watchlist_reminder(db, new_entry)

        db.commit()

    except Exception:
        db.rollback()
        raise

    saved_entry = (
        db.query(EventWatchlist)
        .options(joinedload(EventWatchlist.event))
        .filter(EventWatchlist.id == new_entry.id)
        .first()
    )

    return saved_entry


# ==========================================
# VIEW STUDENT WATCHLIST
# ==========================================

@router.get(
    "/watchlist/{student_id}",
    response_model=list[WatchlistOut]
)
def get_student_watchlist(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    entries = (
        db.query(EventWatchlist)
        .options(joinedload(EventWatchlist.event))
        .filter(EventWatchlist.student_id == student_id)
        .join(Event)
        .order_by(Event.start_at.asc())
        .all()
    )

    return entries


# ==========================================
# UPDATE REMINDER PREFERENCES
# ==========================================

@router.patch(
    "/watchlist/{student_id}/{event_id}",
    response_model=WatchlistOut
)
def update_watchlist_preferences(
    student_id: int,
    event_id: int,
    preferences: WatchlistUpdate,
    db: Session = Depends(get_db)
):
    entry = (
        db.query(EventWatchlist)
        .options(joinedload(EventWatchlist.event))
        .filter(
            EventWatchlist.student_id == student_id,
            EventWatchlist.event_id == event_id
        )
        .first()
    )

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watchlist entry not found"
        )

    updates = preferences.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide at least one preference to update"
        )

    for field, value in updates.items():
        setattr(entry, field, value)

    try:
        schedule_watchlist_reminder(db, entry)
        db.commit()
        db.refresh(entry)

    except Exception:
        db.rollback()
        raise

    return entry


# ==========================================
# REMOVE EVENT FROM WATCHLIST
# ==========================================

@router.delete(
    "/watchlist/{student_id}/{event_id}"
)
def remove_from_watchlist(
    student_id: int,
    event_id: int,
    db: Session = Depends(get_db)
):
    entry = db.query(EventWatchlist).filter(
        EventWatchlist.student_id == student_id,
        EventWatchlist.event_id == event_id
    ).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watchlist entry not found"
        )

    db.delete(entry)
    db.commit()

    return {
        "message": "Event removed from watchlist successfully",
        "student_id": student_id,
        "event_id": event_id
    }


# ==========================================
# STUDENT EVENT CALENDAR
# ==========================================

@router.get(
    "/calendar/{student_id}",
    response_model=list[EventOut]
)
def get_student_calendar(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    events = (
        db.query(Event)
        .join(EventWatchlist)
        .filter(EventWatchlist.student_id == student_id)
        .order_by(Event.start_at.asc())
        .all()
    )

    return events


# ==========================================
# EXPORT GOOGLE CALENDAR FILE
# ==========================================

@router.get("/calendar/{student_id}/export.ics")
def export_student_calendar(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    entries = (
        db.query(EventWatchlist)
        .options(joinedload(EventWatchlist.event))
        .filter(
            EventWatchlist.student_id == student_id,
            EventWatchlist.sync_to_google_calendar.is_(True)
        )
        .join(Event)
        .order_by(Event.start_at.asc())
        .all()
    )

    events = [entry.event for entry in entries]

    try:
        calendar_content = create_icalendar(events)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )

    return Response(
        content=calendar_content,
        media_type="text/calendar",
        headers={
            "Content-Disposition": (
                f'attachment; filename="vybe_student_{student_id}_calendar.ics"'
            )
        }
    )
