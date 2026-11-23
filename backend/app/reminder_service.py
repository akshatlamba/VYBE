
from datetime import datetime, timezone, timedelta

from sqlalchemy.orm import Session

from app.database.models import Reminder, EventWatchlist


def schedule_watchlist_reminder(
    db: Session,
    watchlist_entry: EventWatchlist
):
    """
    Create or update a reminder for a saved event.

    The reminder is scheduled relative to the event's start time.
    This function does not send notifications.
    """

    # Check whether reminders are enabled for this saved event.
    if not watchlist_entry.reminder_enabled:
        existing_reminder = (
            db.query(Reminder)
            .filter(Reminder.watchlist_id == watchlist_entry.id)
            .first()
        )

        if existing_reminder:
            existing_reminder.status = "cancelled"
            existing_reminder.locked_until = None

        return None

    event = watchlist_entry.event

    if event is None or event.start_at is None:
        raise ValueError("The saved event does not have a valid start time.")

    # Use timezone-aware datetimes.
    event_start = event.start_at

    if event_start.tzinfo is None:
        raise ValueError(
            "Event start time must include a timezone."
        )

    now = datetime.now(timezone.utc)

    reminder_minutes = watchlist_entry.reminder_minutes_before

    scheduled_for = event_start - timedelta(
        minutes=reminder_minutes
    )

    # Find an existing reminder for this watchlist entry.
    reminder = (
        db.query(Reminder)
        .filter(Reminder.watchlist_id == watchlist_entry.id)
        .first()
    )

    # If the reminder time has already passed, do not send
    # an unexpected late reminder.
    if scheduled_for <= now:
        if reminder:
            reminder.status = "cancelled"
            reminder.locked_until = None

        return None

    if reminder:
        # Update the existing reminder instead of creating duplicates.
        reminder.scheduled_for = scheduled_for
        reminder.reminder_minutes_before = reminder_minutes
        reminder.status = "pending"
        reminder.attempts = 0
        reminder.locked_until = None
        reminder.sent_at = None
        reminder.last_error = None

    else:
        reminder = Reminder(
            watchlist_id=watchlist_entry.id,
            scheduled_for=scheduled_for,
            reminder_minutes_before=reminder_minutes,
            status="pending",
            attempts=0,
            max_attempts=5
        )

        db.add(reminder)

    db.flush()

    return reminder


def cancel_watchlist_reminder(
    db: Session,
    watchlist_id: int
):
    """
    Cancel a pending reminder for a watchlist entry.
    """

    reminder = (
        db.query(Reminder)
        .filter(Reminder.watchlist_id == watchlist_id)
        .first()
    )

    if reminder:
        reminder.status = "cancelled"
        reminder.locked_until = None

    db.flush()

    return reminder
