
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
    email = Column(String(254), nullable=True, unique=True, index=True)
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

    notifications = relationship(
        "Notification",
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
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    event_id = Column(
        Integer,
        ForeignKey("events.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    reminder_enabled = Column(
        Boolean,
        nullable=False,
        default=True
    )

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

    reminders = relationship(
        "Reminder",
        back_populates="watchlist",
        cascade="all, delete-orphan"
    )


# ==========================================
# EVENT REMINDERS
# ==========================================

class Reminder(Base):
    __tablename__ = "reminders"

    __table_args__ = (
        UniqueConstraint(
            "watchlist_id",
            "reminder_minutes_before",
            name="unique_watchlist_reminder_offset"
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    watchlist_id = Column(
        Integer,
        ForeignKey("event_watchlist.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    scheduled_for = Column(
        DateTime(timezone=True),
        nullable=False,
        index=True
    )

    reminder_minutes_before = Column(
        Integer,
        nullable=False,
        default=1440
    )

    status = Column(
        String(30),
        nullable=False,
        default="pending",
        index=True
    )

    attempts = Column(
        Integer,
        nullable=False,
        default=0
    )

    max_attempts = Column(
        Integer,
        nullable=False,
        default=5
    )

    locked_until = Column(
        DateTime(timezone=True),
        nullable=True
    )

    sent_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    last_error = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    watchlist = relationship(
        "EventWatchlist",
        back_populates="reminders"
    )

    notification = relationship(
        "Notification",
        back_populates="reminder",
        uselist=False,
        cascade="all, delete-orphan"
    )


# ==========================================
# IN-APP NOTIFICATIONS
# ==========================================

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    reminder_id = Column(
        Integer,
        ForeignKey("reminders.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    title = Column(
        String(200),
        nullable=False
    )

    message = Column(
        Text,
        nullable=False
    )

    is_read = Column(
        Boolean,
        nullable=False,
        default=False
    )

    read_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow
    )

    student = relationship(
        "Student",
        back_populates="notifications"
    )

    reminder = relationship(
        "Reminder",
        back_populates="notification"
    )

# ==========================================
# PERSONAL CALENDAR
# ==========================================

class CalendarEntry(Base):
    __tablename__ = "calendar_entries"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(40), nullable=False, default="Personal")

    start_at = Column(DateTime(timezone=True), nullable=False)
    end_at = Column(DateTime(timezone=True), nullable=True)
    all_day = Column(Boolean, nullable=False, default=False)

    reminder_enabled = Column(Boolean, nullable=False, default=False)
    reminder_minutes_before = Column(Integer, nullable=False, default=30)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now().astimezone()
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now().astimezone(),
        onupdate=lambda: datetime.now().astimezone()
    )


# ==========================================
# COMMUNITY: DISCUSSION POSTS
# ==========================================

class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    signal_id = Column(String(100), nullable=True, index=True)
    post_type = Column(String(30), nullable=False, default="discussion")
    content = Column(Text, nullable=False)
    source_url = Column(String(1000), nullable=True)

    status = Column(String(30), nullable=False, default="visible", index=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


# ==========================================
# COMMUNITY: COMMENTS AND REPLIES
# ==========================================

class CommunityComment(Base):
    __tablename__ = "community_comments"

    id = Column(Integer, primary_key=True, index=True)

    post_id = Column(
        Integer,
        ForeignKey("community_posts.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    parent_comment_id = Column(
        Integer,
        ForeignKey("community_comments.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    content = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="visible", index=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


# ==========================================
# COMMUNITY: HELPFUL VOTES
# ==========================================

class CommunityVote(Base):
    __tablename__ = "community_votes"

    __table_args__ = (
        UniqueConstraint(
            "student_id",
            "post_id",
            name="unique_student_community_post_vote"
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    post_id = Column(
        Integer,
        ForeignKey("community_posts.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


# ==========================================
# COMMUNITY: REPORTS
# ==========================================

class CommunityReport(Base):
    __tablename__ = "community_reports"

    id = Column(Integer, primary_key=True, index=True)

    reporter_student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    target_type = Column(String(20), nullable=False)
    target_id = Column(Integer, nullable=False, index=True)

    reason = Column(String(50), nullable=False)
    details = Column(Text, nullable=True)

    status = Column(String(30), nullable=False, default="pending", index=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
