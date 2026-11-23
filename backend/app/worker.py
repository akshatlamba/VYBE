
import logging
import time
from datetime import datetime, timezone, timedelta

from sqlalchemy import or_

from app.database.connection import SessionLocal
from app.database.models import Reminder, Notification
from app.email_service import send_event_reminder


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger("VYBE-Reminder-Worker")

POLL_INTERVAL_SECONDS = 15
BATCH_SIZE = 50
LOCK_DURATION_MINUTES = 5


def claim_due_reminders():
    """
    Find due reminders and temporarily claim them.
    Multiple workers can safely share the workload.
    """

    db = SessionLocal()

    try:
        now = datetime.now(timezone.utc)

        reminders = (
            db.query(Reminder)
            .filter(
                or_(
                    (
                        (Reminder.status == "pending")
                        & (Reminder.scheduled_for <= now)
                    ),
                    (
                        (Reminder.status == "processing")
                        & (
                            (Reminder.locked_until.is_(None))
                            | (Reminder.locked_until <= now)
                        )
                    )
                )
            )
            .order_by(Reminder.scheduled_for.asc())
            .with_for_update(skip_locked=True)
            .limit(BATCH_SIZE)
            .all()
        )

        reminder_ids = []

        for reminder in reminders:
            reminder.status = "processing"
            reminder.locked_until = (
                now + timedelta(minutes=LOCK_DURATION_MINUTES)
            )
            reminder_ids.append(reminder.id)

        db.commit()

        return reminder_ids

    except Exception:
        db.rollback()
        logger.exception("Could not claim due reminders.")
        return []

    finally:
        db.close()


def record_failure(db, reminder_id, error, permanent=False):
    """
    Record a delivery failure and decide whether to retry.
    """

    try:
        db.rollback()

        reminder = (
            db.query(Reminder)
            .filter(Reminder.id == reminder_id)
            .first()
        )

        if not reminder:
            return

        reminder.attempts += 1
        reminder.last_error = str(error)[:1000]
        reminder.locked_until = None

        if permanent or reminder.attempts >= reminder.max_attempts:
            reminder.status = "failed"
        else:
            reminder.status = "pending"

        db.commit()

        logger.warning(
            "Reminder %s marked %s after failure.",
            reminder_id,
            reminder.status
        )

    except Exception:
        db.rollback()
        logger.exception("Could not record reminder failure.")


def process_reminder(reminder_id: int):
    """
    Deliver the requested in-app and email notifications.
    """

    db = SessionLocal()

    try:
        reminder = (
            db.query(Reminder)
            .filter(Reminder.id == reminder_id)
            .first()
        )

        if not reminder or reminder.status != "processing":
            return

        watchlist_entry = reminder.watchlist

        if not watchlist_entry:
            raise ValueError("Reminder has no watchlist entry.")

        event = watchlist_entry.event

        if not event:
            raise ValueError("Saved event was not found.")

        student = watchlist_entry.student

        if not student:
            raise ValueError("Student was not found.")

        # --------------------------------------
        # 1. CREATE IN-APP NOTIFICATION
        # --------------------------------------

        if watchlist_entry.notify_in_app:

            existing_notification = (
                db.query(Notification)
                .filter(
                    Notification.reminder_id == reminder.id
                )
                .first()
            )

            if not existing_notification:
                notification = Notification(
                    student_id=student.id,
                    reminder_id=reminder.id,
                    title=f"Upcoming event: {event.title}",
                    message=(
                        f"Your saved event '{event.title}' "
                        "is coming up. Check VYBE for its details."
                    ),
                    is_read=False
                )

                db.add(notification)
                db.commit()

                logger.info(
                    "In-app notification created for reminder %s.",
                    reminder_id
                )

        # --------------------------------------
        # 2. SEND EMAIL NOTIFICATION
        # --------------------------------------

        if watchlist_entry.notify_email:

            if not student.email:
                raise ValueError(
                    "Student email is missing. "
                    "Cannot deliver the requested email reminder."
                )

            send_event_reminder(
                to_email=student.email,
                student_name=student.name,
                event_title=event.title,
                event_start=event.start_at,
                venue=event.venue,
                registration_url=event.registration_url
            )

            logger.info(
                "Email reminder submitted for reminder %s.",
                reminder_id
            )

        # --------------------------------------
        # 3. MARK REMINDER AS SENT
        # --------------------------------------

        reminder.status = "sent"
        reminder.sent_at = datetime.now(timezone.utc)
        reminder.locked_until = None
        reminder.last_error = None

        db.commit()

        logger.info(
            "Reminder %s processed successfully.",
            reminder_id
        )

    except ValueError as error:
        logger.error(
            "Permanent reminder delivery problem for %s: %s",
            reminder_id,
            error
        )

        record_failure(
            db,
            reminder_id,
            error,
            permanent=True
        )

    except Exception as error:
        logger.exception(
            "Failed to process reminder %s.",
            reminder_id
        )

        record_failure(
            db,
            reminder_id,
            error
        )

    finally:
        db.close()


def run_worker():
    """
    Continuously check for due reminders.
    """

    logger.info("VYBE Reminder Worker started.")

    while True:
        try:
            reminder_ids = claim_due_reminders()

            for reminder_id in reminder_ids:
                process_reminder(reminder_id)

            if reminder_ids:
                logger.info(
                    "Processed batch of %s reminders.",
                    len(reminder_ids)
                )

        except Exception:
            logger.exception("Unexpected worker error.")

        time.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    run_worker()
