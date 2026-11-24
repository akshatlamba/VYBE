import unittest
import sys
from pathlib import Path
from datetime import datetime, timezone
from unittest.mock import MagicMock

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.main import home, health_check
from app.students import (
    parse_dna_profile,
    pack_profile_metadata,
    StudentProfileCreate,
    StudentCreate
)
from app.pulse import generate_deterministic_guidance, PulseRequest, ask_pulse
from app.world_action import get_world_signals, create_action_plan, CURATED_SIGNALS
from app.events import create_icalendar, escape_ical_text, format_ical_datetime
from app.auth import decode_jwt_unverified, verify_student_ownership


class TestBackendCore(unittest.TestCase):

    def test_health_check(self):
        """Test backend health endpoint returns healthy status."""
        result = health_check()
        self.assertEqual(result.get("status"), "healthy")
        self.assertEqual(result.get("project"), "VYBE")

    def test_welcome_root(self):
        """Test backend root welcome message."""
        result = home()
        self.assertIn("VYBE", result.get("message", ""))
        self.assertEqual(result.get("status"), "Backend is running successfully")

    def test_world_pulse_signals_endpoint(self):
        """Test world signals are returned with source, url, date, and status."""
        result = get_world_signals()
        self.assertTrue(result.get("success"))
        signals = result.get("data", [])
        self.assertGreaterEqual(len(signals), 3)

        for sig in signals:
            self.assertIn("title", sig)
            self.assertIn("source_name", sig)
            self.assertIn("source_url", sig)
            self.assertIn("published_at", sig)
            self.assertIn("source_status", sig)
            self.assertIn(sig["source_status"], ["sourced", "unverified", "stale"])

    def test_student_dna_parsing_and_metadata_packing(self):
        """Test Student DNA metadata packing and parsing for academic year, budget, etc."""
        payload = StudentProfileCreate(
            academic_year="3rd Year",
            department="Computer Science",
            location="Delhi-NCR",
            availability="Part-time (10 hrs/wk)",
            budget_max=1500,
            preferred_format="hybrid",
            interests=["AI Agents", "Cloud Systems"]
        )

        packed = pack_profile_metadata(payload)
        self.assertIn("3rd Year", packed)
        self.assertIn("Computer Science", packed)
        self.assertIn("1500", packed)

        class DummyStudent:
            id = 1
            name = "Aarav Patel"
            email = "aarav@example.com"
            interest = "AI Agents"
            skill_level = "Beginner"
            goal = "internship"

        class DummyProfile:
            id = 10
            student_id = 1
            skills = "Python, Git, HTML"
            experience = packed
            career_goal = "Software Engineer"
            learning_preference = "Hands-on projects"

        mock_student = DummyStudent()
        mock_profile = DummyProfile()

        parsed = parse_dna_profile(mock_student, mock_profile)
        self.assertEqual(parsed["academic_year"], "3rd Year")
        self.assertEqual(parsed["department"], "Computer Science")
        self.assertEqual(parsed["budget_max"], 1500)
        self.assertEqual(parsed["preferred_format"], "hybrid")
        self.assertIn("Python", parsed["skills"])

    def test_pulse_guidance_deterministic_contract(self):
        """Test PULSE deterministic guidance generates structured learn, build, apply actions."""
        dna = {
            "name": "Aarav",
            "academic_year": "2nd Year",
            "department": "Computer Science",
            "skill_level": "beginner",
            "goal": "internship"
        }

        guidance = generate_deterministic_guidance("Where should I start with AI?", dna)
        self.assertIn("content", guidance)
        self.assertIn("why_this", guidance)
        self.assertIn("action_proposals", guidance)
        self.assertIn("opportunity_ids", guidance)

        # Verify Action Proposal categories: learn, build, apply
        kinds = [p.kind for p in guidance["action_proposals"]]
        self.assertIn("learn", kinds)
        self.assertIn("build", kinds)
        self.assertIn("apply", kinds)

    def test_icalendar_export_generation(self):
        """Test iCalendar (.ics) generation formats dates, escaping, and VEVENT structure."""
        mock_event = MagicMock()
        mock_event.id = 42
        mock_event.title = "Prasunex Innovathon, Finals"
        mock_event.description = "Round 3 technical demonstration."
        mock_event.venue = "Auditorium & Virtual"
        mock_event.organizer = "Prasunex Tech"
        mock_event.registration_url = "https://prasunex.example.com"
        mock_event.source_url = None
        mock_event.start_at = datetime(2026, 11, 25, 10, 0, tzinfo=timezone.utc)
        mock_event.end_at = datetime(2026, 11, 25, 18, 0, tzinfo=timezone.utc)

        ics_content = create_icalendar([mock_event])
        self.assertTrue(ics_content.startswith("BEGIN:VCALENDAR"))
        self.assertIn("BEGIN:VEVENT", ics_content)
        self.assertIn("SUMMARY:Prasunex Innovathon\\, Finals", ics_content)
        self.assertIn("DTSTART:20261125T100000Z", ics_content)
        self.assertIn("DTEND:20261125T180000Z", ics_content)
        self.assertTrue(ics_content.strip().endswith("END:VCALENDAR"))

    def test_auth_ownership_check(self):
        """Test verify_student_ownership prevents unauthorized access."""
        from fastapi import HTTPException
        current_student = MagicMock()
        current_student.id = 1

        # Matching student ID passes
        verify_student_ownership(1, current_student)

        # Different student ID raises 403 Forbidden
        with self.assertRaises(HTTPException) as ctx:
            verify_student_ownership(2, current_student)
        self.assertEqual(ctx.exception.status_code, 403)


if __name__ == "__main__":
    unittest.main()
