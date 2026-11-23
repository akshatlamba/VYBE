
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
    Boolean,
    UniqueConstraint
)

from sqlalchemy.orm import declarative_base, relationship


Base = declarative_base()


# ==========================================
# STUDENT
# ==========================================

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    interest = Column(String(100), nullable=False)
    skill_level = Column(String(50), nullable=False)
    goal = Column(Text, nullable=False)

    profile = relationship(
        "StudentProfile",
        back_populates="student",
        uselist=False,
        cascade="all, delete-orphan"
    )

    projects = relationship(
        "Project",
        back_populates="student",
        cascade="all, delete-orphan"
    )

    watchlist_entries = relationship(
        "EventWatchlist",
        back_populates="student",
        cascade="all, delete-orphan"
    )


# ==========================================
# STUDENT DNA PROFILE
# ==========================================

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        unique=True,
        nullable=False
    )

    skills = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    career_goal = Column(String(150), nullable=True)
    learning_preference = Column(String(100), nullable=True)

    student = relationship(
        "Student",
        back_populates="profile"
    )


# ==========================================
# GROWTH PASSPORT: PROJECT
# ==========================================

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False,
        index=True
    )

    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)

    status = Column(
        String(30),
        nullable=False,
        default="not_started"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    student = relationship(
        "Student",
        back_populates="projects"
    )

    milestones = relationship(
        "Milestone",
        back_populates="project",
        cascade="all, delete-orphan"
    )

    evidence = relationship(
        "ProjectEvidence",
        back_populates="project",
        cascade="all, delete-orphan"
    )


# ==========================================
# GROWTH PASSPORT: MILESTONES
# ==========================================

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False,
        index=True
    )

    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)

    status = Column(
        String(30),
        nullable=False,
        default="not_started"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    completed_at = Column(DateTime, nullable=True)

    project = relationship(
        "Project",
        back_populates="milestones"
    )


# ==========================================
# GROWTH PASSPORT: EVIDENCE
# ==========================================

class ProjectEvidence(Base):
    __tablename__ = "project_evidence"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False,
        index=True
    )

    title = Column(String(150), nullable=False)
    url = Column(String(1000), nullable=False)

    evidence_type = Column(
        String(50),
        nullable=False,
        default="project_link"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    project = relationship(
        "Project",
        back_populates="evidence"
    )


# ==========================================
# EVENTS
# ==========================================

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    organizer = Column(String(150), nullable=True)
    category = Column(String(100), nullable=True)

    start_at = Column(
        DateTime(timezone=True),
        nullable=False
    )

    end_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    registration_deadline = Column(
        DateTime(timezone=True),
        nullable=True
    )

    venue = Column(String(250), nullable=True)
    registration_url = Column(String(1000), nullable=True)
    source_url = Column(String(1000), nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    watchlist_entries = relationship(
        "EventWatchlist",
        back_populates="event",
        cascade="all, delete-orphan"
    )


# ==========================================
# EVENT WATCHLIST
# ==========================================

class EventWatchlist(Base):
    __tablename__ = "event_watchlist"

    __table_args__ = (
        UniqueConstraint(
            "student_id",
            "event_id",
            name="unique_student_event_watchlist"
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False,
        index=True
    )

    event_id = Column(
        Integer,
        ForeignKey("events.id"),
        nullable=False,
        index=True
    )

    reminder_enabled = Column(
        Boolean,
        nullable=False,
        default=True
    )

    # Default: 1440 minutes = 24 hours before event
    reminder_minutes_before = Column(
        Integer,
        nullable=False,
        default=1440
    )

    notify_email = Column(
        Boolean,
        nullable=False,
        default=True
    )

    notify_in_app = Column(
        Boolean,
        nullable=False,
        default=True
    )

    sync_to_google_calendar = Column(
        Boolean,
        nullable=False,
        default=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    student = relationship(
        "Student",
        back_populates="watchlist_entries"
    )

    event = relationship(
        "Event",
        back_populates="watchlist_entries"
    )
