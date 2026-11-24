
from datetime import datetime
from urllib.parse import urlparse
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import (
    Student,
    Project,
    Milestone,
    ProjectEvidence
)


router = APIRouter()


# -----------------------------------
# REQUEST MODELS
# -----------------------------------

class ProjectCreate(BaseModel):
    student_id: int
    title: str = Field(min_length=2, max_length=150)
    description: str | None = None
    category: str | None = None


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=150)
    description: str | None = None
    category: str | None = None
    status: Literal["not_started", "in_progress", "completed"] | None = None


class MilestoneCreate(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    description: str | None = None


class MilestoneUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=150)
    description: str | None = None
    status: Literal["not_started", "in_progress", "completed"] | None = None


class EvidenceCreate(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    url: str = Field(min_length=8, max_length=1000)
    evidence_type: Literal[
        "github",
        "demo",
        "documentation",
        "project_link"
    ] = "project_link"

    @field_validator("url")
    @classmethod
    def validate_url(cls, value):
        parsed = urlparse(value)

        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            raise ValueError("Please provide a valid HTTP or HTTPS URL.")

        if parsed.username or parsed.password:
            raise ValueError("URLs containing credentials are not allowed.")

        return value


# -----------------------------------
# RESPONSE HELPERS
# -----------------------------------

def serialize_milestone(milestone):
    return {
        "id": milestone.id,
        "project_id": milestone.project_id,
        "title": milestone.title,
        "description": milestone.description,
        "status": milestone.status,
        "created_at": (
            milestone.created_at.isoformat()
            if milestone.created_at else None
        ),
        "completed_at": (
            milestone.completed_at.isoformat()
            if milestone.completed_at else None
        )
    }


def serialize_evidence(evidence):
    return {
        "id": evidence.id,
        "project_id": evidence.project_id,
        "title": evidence.title,
        "url": evidence.url,
        "evidence_type": evidence.evidence_type,
        "created_at": (
            evidence.created_at.isoformat()
            if evidence.created_at else None
        )
    }


def serialize_project(project):
    completed = sum(
        1 for milestone in project.milestones
        if milestone.status == "completed"
    )

    total = len(project.milestones)
    has_links = any(bool(e.url and e.url.startswith("http")) for e in project.evidence)
    explicit_status = getattr(project, "verification_status", None)
    verification = explicit_status if explicit_status else ("link_supported" if has_links else "self_reported")

    return {
        "id": project.id,
        "student_id": project.student_id,
        "title": project.title,
        "description": project.description,
        "category": project.category,
        "status": project.status,
        "verification": verification,
        "progress": {
            "total_milestones": total,
            "completed_milestones": completed,
            "percentage": round(completed / total * 100) if total else 0
        },
        "milestones": [
            serialize_milestone(m)
            for m in project.milestones
        ],
        "evidence": [
            serialize_evidence(e)
            for e in project.evidence
        ],
        "created_at": (
            project.created_at.isoformat()
            if project.created_at else None
        ),
        "updated_at": (
            project.updated_at.isoformat()
            if project.updated_at else None
        )
    }


def get_project_or_404(project_id, db):
    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found."
        )

    return project


# -----------------------------------
# CREATE PROJECT
# POST /growth-passport/projects
# -----------------------------------

@router.post("/projects")
def create_project(
    request: ProjectCreate,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == request.student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found."
        )

    project = Project(
        student_id=request.student_id,
        title=request.title,
        description=request.description,
        category=request.category,
        status="not_started"
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return {
        "message": "Growth Passport project created successfully.",
        "project_id": project.id,
        "title": project.title
    }


# -----------------------------------
# LIST STUDENT PROJECTS
# GET /growth-passport/projects/student/{student_id}
# -----------------------------------

@router.get("/projects/student/{student_id}")
def get_student_projects(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found."
        )

    projects = db.query(Project).filter(
        Project.student_id == student_id
    ).order_by(Project.created_at.desc()).all()

    return {
        "student_id": student_id,
        "total_projects": len(projects),
        "projects": [
            serialize_project(project)
            for project in projects
        ]
    }


# -----------------------------------
# GET ONE PROJECT
# GET /growth-passport/projects/{project_id}
# -----------------------------------

@router.get("/projects/{project_id}")
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    project = get_project_or_404(project_id, db)

    return {
        "project": serialize_project(project)
    }


# -----------------------------------
# UPDATE PROJECT
# PUT /growth-passport/projects/{project_id}
# -----------------------------------

@router.put("/projects/{project_id}")
def update_project(
    project_id: int,
    request: ProjectUpdate,
    db: Session = Depends(get_db)
):
    project = get_project_or_404(project_id, db)

    updates = request.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(project, field, value)

    project.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(project)

    return {
        "message": "Project updated successfully.",
        "project": serialize_project(project)
    }


# -----------------------------------
# ADD MILESTONE
# POST /growth-passport/projects/{project_id}/milestones
# -----------------------------------

@router.post("/projects/{project_id}/milestones")
def create_milestone(
    project_id: int,
    request: MilestoneCreate,
    db: Session = Depends(get_db)
):
    project = get_project_or_404(project_id, db)

    milestone = Milestone(
        project_id=project_id,
        title=request.title,
        description=request.description,
        status="not_started"
    )

    db.add(milestone)
    db.commit()
    db.refresh(milestone)

    return {
        "message": "Milestone created successfully.",
        "milestone": serialize_milestone(milestone)
    }


# -----------------------------------
# UPDATE MILESTONE
# PUT /growth-passport/milestones/{milestone_id}
# -----------------------------------

@router.put("/milestones/{milestone_id}")
def update_milestone(
    milestone_id: int,
    request: MilestoneUpdate,
    db: Session = Depends(get_db)
):
    milestone = db.query(Milestone).filter(
        Milestone.id == milestone_id
    ).first()

    if not milestone:
        raise HTTPException(
            status_code=404,
            detail="Milestone not found."
        )

    updates = request.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(milestone, field, value)

    if milestone.status == "completed":
        if milestone.completed_at is None:
            milestone.completed_at = datetime.utcnow()
    else:
        milestone.completed_at = None

    project = db.query(Project).filter(
        Project.id == milestone.project_id
    ).first()

    if project:
        project.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(milestone)

    return {
        "message": "Milestone updated successfully.",
        "milestone": serialize_milestone(milestone)
    }


# -----------------------------------
# ADD PROJECT EVIDENCE
# POST /growth-passport/projects/{project_id}/evidence
# -----------------------------------

@router.post("/projects/{project_id}/evidence")
def add_project_evidence(
    project_id: int,
    request: EvidenceCreate,
    db: Session = Depends(get_db)
):
    project = get_project_or_404(project_id, db)

    evidence = ProjectEvidence(
        project_id=project_id,
        title=request.title,
        url=request.url,
        evidence_type=request.evidence_type
    )

    db.add(evidence)
    db.commit()
    db.refresh(evidence)

    return {
        "message": "Project evidence added successfully.",
        "evidence": serialize_evidence(evidence)
    }


# -----------------------------------
# GROWTH PASSPORT SUMMARY
# GET /growth-passport/summary/{student_id}
# -----------------------------------

@router.get("/summary/{student_id}")
def get_growth_summary(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found."
        )

    projects = db.query(Project).filter(
        Project.student_id == student_id
    ).all()

    total = len(projects)
    verified = sum(1 for p in projects if getattr(p, "verification_status", None) == "verified")
    link_supported = sum(
        1 for p in projects
        if getattr(p, "verification_status", None) == "link_supported" or any(e.url for e in p.evidence)
    )
    self_reported = max(0, total - verified - link_supported)

    skills = set()
    for p in projects:
        if p.category:
            skills.add(p.category)
        for e in p.evidence:
            if e.evidence_type:
                skills.add(e.evidence_type.replace("_", " ").title())

    return {
        "student_id": student_id,
        "total_records": total,
        "verified_count": verified,
        "link_supported_count": link_supported,
        "self_reported_count": self_reported,
        "skills_gained": list(skills)
    }

