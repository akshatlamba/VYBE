"""
Seed database with initial students, events, notifications, and calendar items.
"""
from datetime import datetime, timezone, timedelta
from app.database.connection import engine, SessionLocal
from app.database.models import (
    Base,
    Student,
    StudentProfile,
    Event,
    Notification,
    CalendarEntry,
    Project
)

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Students
        if not db.query(Student).filter(Student.id == 1).first():
            student1 = Student(
                id=1,
                name="Aarav Patel",
                email="aarav.patel@srmuniversity.ac.in",
                interest="Artificial Intelligence",
                skill_level="Intermediate",
                goal="Secure top AI/ML internship and publish research"
            )
            db.add(student1)
            db.commit()

            profile1 = StudentProfile(
                student_id=1,
                skills="Python, PyTorch, FastAPIs, Docker, TypeScript",
                experience='{"academic_year": "2nd Year", "department": "Computer Science", "location": "India", "availability": "Part-time (10-15 hrs/wk)", "budget_max": 2000, "preferred_format": "hybrid", "interests": ["AI Agents", "SLMs", "System Design"]}',
                career_goal="AI Research Engineer",
                learning_preference="Hands-on building & paper reproduction"
            )
            db.add(profile1)

        if not db.query(Student).filter(Student.id == 2).first():
            student2 = Student(
                id=2,
                name="Riya Sen",
                email="riya.sen@srm.edu.in",
                interest="Product Discovery & Business",
                skill_level="Beginner",
                goal="Launch vertical AI SaaS startup"
            )
            db.add(student2)
            db.commit()

            profile2 = StudentProfile(
                student_id=2,
                skills="Product Management, UI/UX, SaaS Economics, Pitching",
                experience='{"academic_year": "3rd Year", "department": "Business & Technology", "location": "India", "availability": "Flexible", "budget_max": 5000, "preferred_format": "any", "interests": ["Startups", "FinTech", "Product"]}',
                career_goal="Venture Founder",
                learning_preference="Customer discovery & case studies"
            )
            db.add(profile2)

        # 2. Seed Events / Opportunities
        if db.query(Event).count() == 0:
            now = datetime.now(timezone.utc)
            events = [
                Event(
                    id=1,
                    title="Smart India Hackathon 2026",
                    description="Nationwide technology hackathon tackling government and industrial problem statements.",
                    organizer="Ministry of Education & AICTE",
                    category="Hackathon",
                    venue="Hybrid / New Delhi",
                    registration_url="https://sih.gov.in",
                    source_url="https://sih.gov.in",
                    start_at=now + timedelta(days=20),
                    registration_deadline=now + timedelta(days=5)
                ),
                Event(
                    id=2,
                    title="Google Summer of Code 2026",
                    description="Global program bringing student developers into open source software development.",
                    organizer="Google Open Source",
                    category="Open Source Fellowship",
                    venue="Remote",
                    registration_url="https://summerofcode.withgoogle.com",
                    source_url="https://summerofcode.withgoogle.com",
                    start_at=now + timedelta(days=45),
                    registration_deadline=now + timedelta(days=12)
                ),
                Event(
                    id=3,
                    title="IISc Summer Research Internship (SRIP)",
                    description="Research fellowship for undergraduate students at the Indian Institute of Science.",
                    organizer="Indian Institute of Science (IISc Bangalore)",
                    category="Research",
                    venue="Onsite Bangalore",
                    registration_url="https://iisc.ac.in/srip",
                    source_url="https://iisc.ac.in/srip",
                    start_at=now + timedelta(days=60),
                    registration_deadline=now + timedelta(days=7)
                )
            ]
            for ev in events:
                db.add(ev)

        # 3. Seed Calendar Entries
        if db.query(CalendarEntry).filter(CalendarEntry.student_id == 1).count() == 0:
            now = datetime.now(timezone.utc)
            cal_entries = [
                CalendarEntry(
                    student_id=1,
                    title="SIH Team Architecture Review",
                    description="Review team system design & architecture diagram.",
                    category="Study",
                    start_at=now + timedelta(hours=3),
                    end_at=now + timedelta(hours=5),
                    all_day=False,
                    reminder_enabled=True,
                    reminder_minutes_before=30
                ),
                CalendarEntry(
                    student_id=1,
                    title="Supabase RLS & API Security Lab",
                    description="Complete hands-on database permissions tutorial.",
                    category="Assignment",
                    start_at=now + timedelta(days=1, hours=2),
                    end_at=now + timedelta(days=1, hours=4),
                    all_day=False,
                    reminder_enabled=False,
                    reminder_minutes_before=15
                )
            ]
            for c in cal_entries:
                db.add(c)

        db.commit()
        print("Database seeded successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
