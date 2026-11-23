
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import Student, StudentProfile

from app.recommendations import (
    recommend_trends,
    recommend_opportunities
)

from app.roadmap import generate_project_roadmap


router = APIRouter()


def create_action_plan(trend):
    """Generate practical learning actions from a trend."""

    category = trend["category"]

    if category == "AI":
        return [
            "Learn Python fundamentals.",
            "Understand basic artificial intelligence concepts.",
            "Build a small AI-powered project.",
            "Document your project and learning."
        ]

    elif category == "Web Development":
        return [
            "Learn HTML page structure.",
            "Practise CSS styling and layouts.",
            "Learn basic JavaScript.",
            "Build and publish a personal portfolio website."
        ]

    elif category == "Data Science":
        return [
            "Practise Python fundamentals.",
            "Learn basic statistics.",
            "Explore data using Python libraries.",
            "Create a small data analysis project."
        ]

    return [
        "Explore the topic and understand its fundamentals.",
        "Choose a beginner-friendly learning resource.",
        "Build a small practical project.",
        "Document your progress."
    ]


@router.get("/{student_id}")
def get_world_to_action(
    student_id: int,
    db: Session = Depends(get_db)
):

    # 1. Find student
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found."
        )

    # 2. Find Student DNA profile
    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Student DNA profile not found."
        )

    # 3. Generate recommendations
    trends = recommend_trends(student, profile)

    opportunities = recommend_opportunities(
        student, profile
    )

    if not trends:
        raise HTTPException(
            status_code=404,
            detail="No matching trends found."
        )

    # 4. Select top recommendation
    top_trend = trends[0]

    # 5. Generate learning actions
    action_plan = create_action_plan(top_trend)

    # 6. Generate project roadmap
    project_roadmap = generate_project_roadmap(
        top_trend["category"],
        student.skill_level
    )

    # 7. Return complete World-to-Action response
    return {
        "student": {
            "id": student.id,
            "name": student.name,
            "interest": student.interest,
            "skill_level": student.skill_level,
            "goal": student.goal
        },

        "world_pulse": {
            "notice": (
                "These are sample trends for prototype testing, "
                "not live news."
            ),
            "recommended_trends": trends
        },

        "personalized_recommendation": {
            "top_trend": top_trend["title"],
            "reason": top_trend["match_reasons"],
            "match_score": top_trend["match_score"]
        },

        "action_plan": action_plan,

        "project_roadmap": project_roadmap,

        "opportunity_radar": {
            "notice": (
                "These are demo opportunities, "
                "not verified real openings."
            ),
            "recommended_opportunities": opportunities
        }
    }
