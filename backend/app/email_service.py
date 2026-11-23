
import os
from pathlib import Path
from html import escape

import resend
from dotenv import load_dotenv


# Load backend environment variables
BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")


def send_event_reminder(
    to_email: str,
    student_name: str,
    event_title: str,
    event_start,
    venue: str | None = None,
    registration_url: str | None = None
):
    """
    Send an event reminder email using Resend.
    """

    api_key = os.getenv("RESEND_API_KEY")
    email_from = os.getenv(
        "EMAIL_FROM",
        "VYBE <onboarding@resend.dev>"
    )

    if not api_key:
        raise RuntimeError("RESEND_API_KEY is missing from .env")

    if not to_email:
        raise ValueError("Student email address is missing.")

    resend.api_key = api_key

    formatted_date = event_start.strftime(
        "%d %B %Y, %I:%M %p %Z"
    )

    safe_name = escape(student_name or "Student")
    safe_title = escape(event_title)
    safe_date = escape(formatted_date)
    safe_venue = escape(venue or "Venue not specified")

    registration_section = ""

    if registration_url:
        safe_url = escape(registration_url, quote=True)
        registration_section = (
            f'<p><a href="{safe_url}">'
            "View registration details</a></p>"
        )

    html_content = f"""
    <html>
      <body>
        <h2>Upcoming Event Reminder</h2>

        <p>Hello {safe_name},</p>

        <p>This is a reminder about your saved VYBE event.</p>

        <h3>{safe_title}</h3>

        <p><strong>Date:</strong> {safe_date}</p>

        <p><strong>Venue:</strong> {safe_venue}</p>

        {registration_section}

        <p>Stay prepared and keep growing with VYBE!</p>
      </body>
    </html>
    """

    text_content = (
        f"Hello {student_name},\n\n"
        f"Reminder: {event_title}\n"
        f"Date: {formatted_date}\n"
        f"Venue: {venue or 'Venue not specified'}\n"
        "Stay prepared and keep growing with VYBE!"
    )

    response = resend.Emails.send({
        "from": email_from,
        "to": [to_email],
        "subject": f"VYBE Event Reminder: {event_title}",
        "html": html_content,
        "text": text_content
    })

    return response
