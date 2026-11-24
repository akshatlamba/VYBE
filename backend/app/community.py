from datetime import datetime, timedelta
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.connection import get_db
from app.database.models import (
    Student,
    CommunityPost,
    CommunityComment,
    CommunityVote,
    CommunityReport,
)

router = APIRouter()


# ==========================================
# REQUEST SCHEMAS
# ==========================================

class PostCreate(BaseModel):
    student_id: int = Field(gt=0)
    signal_id: str | None = Field(default=None, max_length=100)
    post_type: str = "discussion"
    content: str = Field(min_length=5, max_length=3000)
    source_url: str | None = Field(default=None, max_length=1000)

    @field_validator("content")
    @classmethod
    def clean_content(cls, value):
        value = value.strip()
        if len(value) < 5:
            raise ValueError("Please write at least 5 characters.")
        return value

    @field_validator("post_type")
    @classmethod
    def validate_post_type(cls, value):
        if value not in {"discussion", "note", "question"}:
            raise ValueError("Invalid post type.")
        return value

    @field_validator("source_url")
    @classmethod
    def validate_source_url(cls, value):
        if value:
            value = value.strip()
            parsed = urlparse(value)
            if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                raise ValueError("Source URL must be a valid HTTP or HTTPS link.")
        return value


class CommentCreate(BaseModel):
    student_id: int = Field(gt=0)
    content: str = Field(min_length=2, max_length=1500)
    parent_comment_id: int | None = Field(default=None, gt=0)

    @field_validator("content")
    @classmethod
    def clean_content(cls, value):
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Comment is too short.")
        return value


class VoteCreate(BaseModel):
    student_id: int = Field(gt=0)


class ReportCreate(BaseModel):
    reporter_student_id: int = Field(gt=0)
    target_type: str
    target_id: int = Field(gt=0)
    reason: str
    details: str | None = Field(default=None, max_length=1000)

    @field_validator("target_type")
    @classmethod
    def validate_target_type(cls, value):
        if value not in {"post", "comment"}:
            raise ValueError("Target must be a post or comment.")
        return value

    @field_validator("reason")
    @classmethod
    def validate_reason(cls, value):
        allowed = {
            "spam",
            "harassment",
            "misinformation",
            "inappropriate",
            "impersonation",
            "other",
        }
        if value not in allowed:
            raise ValueError("Please select a valid report reason.")
        return value


# ==========================================
# HELPERS
# ==========================================

def require_student(db: Session, student_id: int):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    return student


def check_rate_limit(db, model, student_field, student_id, seconds):
    cutoff = datetime.utcnow() - timedelta(seconds=seconds)
    recent = (
        db.query(model)
        .filter(
            getattr(model, student_field) == student_id,
            model.created_at >= cutoff,
        )
        .first()
    )
    if recent:
        raise HTTPException(
            status_code=429,
            detail=f"Please wait {seconds} seconds before posting again.",
        )


def post_to_dict(post, db):
    author = db.query(Student).filter(Student.id == post.student_id).first()
    helpful_count = (
        db.query(CommunityVote)
        .filter(CommunityVote.post_id == post.id)
        .count()
    )
    comment_count = (
        db.query(CommunityComment)
        .filter(
            CommunityComment.post_id == post.id,
            CommunityComment.status == "visible",
        )
        .count()
    )

    return {
        "id": post.id,
        "student_id": post.student_id,
        "author_name": author.name if author else "Student",
        "signal_id": post.signal_id,
        "post_type": post.post_type,
        "content": post.content,
        "source_url": post.source_url,
        "status": post.status,
        "helpful_count": helpful_count,
        "comment_count": comment_count,
        "created_at": post.created_at.isoformat() if post.created_at else None,
    }


def comment_to_dict(comment, db):
    author = db.query(Student).filter(Student.id == comment.student_id).first()
    return {
        "id": comment.id,
        "post_id": comment.post_id,
        "student_id": comment.student_id,
        "author_name": author.name if author else "Student",
        "parent_comment_id": comment.parent_comment_id,
        "content": comment.content,
        "created_at": comment.created_at.isoformat() if comment.created_at else None,
    }


# ==========================================
# CREATE A COMMUNITY POST
# ==========================================

@router.post("/posts")
def create_post(payload: PostCreate, db: Session = Depends(get_db)):
    require_student(db, payload.student_id)

    check_rate_limit(
        db, CommunityPost, "student_id", payload.student_id, 30
    )

    duplicate = (
        db.query(CommunityPost)
        .filter(
            CommunityPost.student_id == payload.student_id,
            CommunityPost.content == payload.content,
            CommunityPost.created_at >= datetime.utcnow() - timedelta(hours=24),
        )
        .first()
    )
    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="You have already posted this content recently.",
        )

    post = CommunityPost(
        student_id=payload.student_id,
        signal_id=payload.signal_id,
        post_type=payload.post_type,
        content=payload.content,
        source_url=payload.source_url,
        status="visible",
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "success": True,
        "message": "Community post created.",
        "data": post_to_dict(post, db),
    }


# ==========================================
# GET COMMUNITY POSTS
# ==========================================

@router.get("/posts")
def get_posts(
    signal_id: str | None = Query(default=None, max_length=100),
    post_type: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=50),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(CommunityPost).filter(
        CommunityPost.status == "visible"
    )

    if signal_id:
        query = query.filter(CommunityPost.signal_id == signal_id)

    if post_type:
        if post_type not in {"discussion", "note", "question"}:
            raise HTTPException(status_code=400, detail="Invalid post type.")
        query = query.filter(CommunityPost.post_type == post_type)

    total = query.count()
    posts = (
        query.order_by(desc(CommunityPost.created_at))
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "success": True,
        "total": total,
        "data": [post_to_dict(post, db) for post in posts],
    }


# ==========================================
# ADD A COMMENT OR REPLY
# ==========================================

@router.post("/posts/{post_id}/comments")
def create_comment(
    post_id: int,
    payload: CommentCreate,
    db: Session = Depends(get_db),
):
    require_student(db, payload.student_id)

    post = (
        db.query(CommunityPost)
        .filter(
            CommunityPost.id == post_id,
            CommunityPost.status == "visible",
        )
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    check_rate_limit(
        db, CommunityComment, "student_id", payload.student_id, 10
    )

    if payload.parent_comment_id:
        parent = (
            db.query(CommunityComment)
            .filter(
                CommunityComment.id == payload.parent_comment_id,
                CommunityComment.post_id == post_id,
                CommunityComment.status == "visible",
            )
            .first()
        )
        if not parent:
            raise HTTPException(
                status_code=404,
                detail="Parent comment not found in this discussion.",
            )

    duplicate = (
        db.query(CommunityComment)
        .filter(
            CommunityComment.student_id == payload.student_id,
            CommunityComment.post_id == post_id,
            CommunityComment.content == payload.content,
            CommunityComment.created_at >= datetime.utcnow() - timedelta(hours=24),
        )
        .first()
    )
    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="You have already sent this comment recently.",
        )

    comment = CommunityComment(
        post_id=post_id,
        student_id=payload.student_id,
        parent_comment_id=payload.parent_comment_id,
        content=payload.content,
        status="visible",
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return {
        "success": True,
        "message": "Comment added.",
        "data": comment_to_dict(comment, db),
    }


# ==========================================
# GET COMMENTS FOR A POST
# ==========================================

@router.get("/posts/{post_id}/comments")
def get_comments(post_id: int, db: Session = Depends(get_db)):
    post = (
        db.query(CommunityPost)
        .filter(
            CommunityPost.id == post_id,
            CommunityPost.status == "visible",
        )
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    comments = (
        db.query(CommunityComment)
        .filter(
            CommunityComment.post_id == post_id,
            CommunityComment.status == "visible",
        )
        .order_by(CommunityComment.created_at.asc())
        .all()
    )

    return {
        "success": True,
        "total": len(comments),
        "data": [comment_to_dict(item, db) for item in comments],
    }


# ==========================================
# TOGGLE HELPFUL VOTE
# ==========================================

@router.post("/posts/{post_id}/vote")
def toggle_vote(
    post_id: int,
    payload: VoteCreate,
    db: Session = Depends(get_db),
):
    require_student(db, payload.student_id)

    post = (
        db.query(CommunityPost)
        .filter(
            CommunityPost.id == post_id,
            CommunityPost.status == "visible",
        )
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    existing = (
        db.query(CommunityVote)
        .filter(
            CommunityVote.post_id == post_id,
            CommunityVote.student_id == payload.student_id,
        )
        .first()
    )

    if existing:
        db.delete(existing)
        db.commit()
        action = "removed"
    else:
        vote = CommunityVote(
            post_id=post_id,
            student_id=payload.student_id,
        )
        db.add(vote)
        db.commit()
        action = "added"

    count = (
        db.query(CommunityVote)
        .filter(CommunityVote.post_id == post_id)
        .count()
    )

    return {
        "success": True,
        "action": action,
        "helpful_count": count,
    }


# ==========================================
# REPORT A POST OR COMMENT
# ==========================================

@router.post("/reports")
def create_report(
    payload: ReportCreate,
    db: Session = Depends(get_db),
):
    require_student(db, payload.reporter_student_id)

    check_rate_limit(
        db,
        CommunityReport,
        "reporter_student_id",
        payload.reporter_student_id,
        60,
    )

    if payload.target_type == "post":
        target = (
            db.query(CommunityPost)
            .filter(CommunityPost.id == payload.target_id)
            .first()
        )
    else:
        target = (
            db.query(CommunityComment)
            .filter(CommunityComment.id == payload.target_id)
            .first()
        )

    if not target:
        raise HTTPException(status_code=404, detail="Reported content not found.")

    previous = (
        db.query(CommunityReport)
        .filter(
            CommunityReport.reporter_student_id == payload.reporter_student_id,
            CommunityReport.target_type == payload.target_type,
            CommunityReport.target_id == payload.target_id,
            CommunityReport.status == "pending",
        )
        .first()
    )
    if previous:
        raise HTTPException(
            status_code=409,
            detail="You have already reported this content.",
        )

    report = CommunityReport(
        reporter_student_id=payload.reporter_student_id,
        target_type=payload.target_type,
        target_id=payload.target_id,
        reason=payload.reason,
        details=payload.details.strip() if payload.details else None,
        status="pending",
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "success": True,
        "message": "Report submitted for review.",
        "report_id": report.id,
        "status": report.status,
    }
