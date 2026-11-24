
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import Notification


router = APIRouter()


class NotificationOut(BaseModel):
    id: int
    student_id: int
    reminder_id: int
    title: str
    message: str
    is_read: bool
    read_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationListOut(BaseModel):
    total: int
    unread: int
    notifications: list[NotificationOut]


@router.get("/{student_id}", response_model=NotificationListOut)
def get_notifications(
    student_id: int,
    db: Session = Depends(get_db)
):
    notifications = (
        db.query(Notification)
        .filter(Notification.student_id == student_id)
        .order_by(Notification.created_at.desc())
        .all()
    )

    unread_count = sum(
        1 for notification in notifications
        if not notification.is_read
    )

    return {
        "total": len(notifications),
        "unread": unread_count,
        "notifications": notifications
    }


@router.patch("/{notification_id}/read", response_model=NotificationOut)
def mark_notification_as_read(
    notification_id: int,
    student_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Notification).filter(Notification.id == notification_id)
    if student_id is not None:
        query = query.filter(Notification.student_id == student_id)
    notification = query.first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found."
        )

    notification.is_read = True
    notification.read_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(notification)

    return notification


@router.patch("/{student_id}/read-all")
def mark_all_notifications_as_read(
    student_id: int,
    db: Session = Depends(get_db)
):
    notifications = (
        db.query(Notification)
        .filter(
            Notification.student_id == student_id,
            Notification.is_read.is_(False)
        )
        .all()
    )

    now = datetime.now(timezone.utc)

    for notification in notifications:
        notification.is_read = True
        notification.read_at = now

    db.commit()

    return {
        "message": "All notifications marked as read.",
        "updated_count": len(notifications)
    }


@router.get("/{student_id}/unread-count")
def get_unread_notification_count(
    student_id: int,
    db: Session = Depends(get_db)
):
    unread_count = (
        db.query(Notification)
        .filter(
            Notification.student_id == student_id,
            Notification.is_read.is_(False)
        )
        .count()
    )

    return {
        "student_id": student_id,
        "unread_count": unread_count
    }
