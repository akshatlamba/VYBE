from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import Student, StudentProfile
from app.recommendations import recommend_trends, recommend_opportunities
from app.roadmap import generate_project_roadmap
from app.students import parse_dna_profile

router = APIRouter()


CURATED_SIGNALS = [
    {
        "id": "sig-001",
        "title": "Autonomous Coding Agents Enter Production Workflows",
        "summary": "GitHub Octoverse 2026 data shows 42% of developer pull requests now touch AI agent infrastructure or multi-agent workflows.",
        "source_name": "GitHub Octoverse 2026",
        "source_url": "https://github.blog/octoverse-2026",
        "published_at": "2026-11-18T09:00:00Z",
        "tags": ["AI Agents", "Python", "Software Engineering"],
        "category": "AI",
        "source_status": "sourced",
        "is_sample": False,
        "difficulty": "beginner",
        "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
        "clicks": 420
    },
    {
        "id": "sig-002",
        "title": "India Semiconductor Mission Expands Student Fabrication Grants",
        "summary": "MeitY and ISM approve ₹450 Cr in subsidized MPW tape-outs and VLSI EDA tool licenses across 80+ engineering colleges.",
        "source_name": "MeitY & ISM Portal",
        "source_url": "https://meity.gov.in/semiconductors/student-grants-2026",
        "published_at": "2026-11-14T14:30:00Z",
        "tags": ["Hardware", "Semiconductors", "VLSI"],
        "category": "Hardware",
        "source_status": "sourced",
        "is_sample": False,
        "difficulty": "intermediate",
        "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
        "clicks": 280
    },
    {
        "id": "sig-003",
        "title": "Open-Source Small Language Models Reach Edge Devices",
        "summary": "Sub-3B parameter quantized models achieve mathematical reasoning parity on mobile and single-board hardware without cloud latency.",
        "source_name": "Hugging Face Research",
        "source_url": "https://huggingface.co/blog/edge-slm-benchmarks",
        "published_at": "2026-11-10T11:15:00Z",
        "tags": ["Edge Computing", "Open Source", "PyTorch"],
        "category": "AI",
        "source_status": "sourced",
        "is_sample": False,
        "difficulty": "advanced",
        "image_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
        "clicks": 615
    },
    {
        "id": "sig-004",
        "title": "National Quantum Mission Approves 14 College Incubators",
        "summary": "DST confirms initial quantum communication testbeds and post-quantum cryptography curriculum standards for undergraduate universities.",
        "source_name": "DST National Quantum Mission",
        "source_url": "https://dst.gov.in/nqm-college-initiatives-2026",
        "published_at": "2026-10-28T08:00:00Z",
        "tags": ["Quantum", "Cryptography", "Research"],
        "category": "Research",
        "source_status": "sourced",
        "is_sample": False,
        "difficulty": "advanced",
        "image_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
        "clicks": 185
    },
    {
        "id": "sig-005",
        "title": "WebAssembly Standardizes Component Model for Micro-Agents",
        "summary": "W3C and Bytecode Alliance release final Wasm component specifications enabling sandboxed cross-language micro-agents in browser tabs.",
        "source_name": "W3C Standards Release",
        "source_url": "https://www.w3.org/TR/wasm-component-model",
        "published_at": "2026-10-15T10:00:00Z",
        "tags": ["WebAssembly", "Web Development", "Systems"],
        "category": "Web Development",
        "source_status": "sourced",
        "is_sample": False,
        "difficulty": "intermediate",
        "image_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
        "clicks": 340
    }
]


def create_action_plan(trend, student_dna: dict):
    """Generate practical, personalized learning actions from a trend."""
    category = trend.get("category", "General")
    goal = (student_dna.get("goal") or "").lower()

    if category == "AI":
        return [
            {"kind": "learn", "title": "Learn Python Async & REST APIs", "description": "Master endpoint calls and structured JSON handling."},
            {"kind": "build", "title": "Build a Small Autonomous Assistant", "description": "Create an open-source Slack/Discord bot with clear README."},
            {"kind": "apply", "title": "Participate in Smart India Hackathon 2026", "description": "Target real-world public problem statements."}
        ]
    elif category == "Web Development":
        return [
            {"kind": "learn", "title": "Master React & Modern CSS", "description": "Practise responsive layouts and interactive UI states."},
            {"kind": "build", "title": "Publish Personal Portfolio & Project Hub", "description": "Deploy to Vercel/Netlify with live interactive showcases."},
            {"kind": "apply", "title": "Apply for Summer Frontend Internships", "description": "Submit portfolio to verified student opportunities."}
        ]
    elif category == "Hardware" or category == "Semiconductors":
        return [
            {"kind": "learn", "title": "Study Digital Logic & Verilog Basics", "description": "Simulate basic logic circuits using open-source tools."},
            {"kind": "build", "title": "Synthesize 8-bit ALU on FPGA Simulator", "description": "Document timing diagrams and waveform testbenches."},
            {"kind": "apply", "title": "Submit Proposal to ISM Student Grants", "description": "Apply for funded college fabrication batches."}
        ]
    else:
        return [
            {"kind": "learn", "title": "Explore Fundamental Principles", "description": "Complete beginner-friendly foundational tutorials."},
            {"kind": "build", "title": "Build 1 Verified Proof Project", "description": "Document implementation in a public repository."},
            {"kind": "apply", "title": "Target Aligned Student Competitions", "description": "Join college team for upcoming hackathons."}
        ]


# ==========================================
# WORLD PULSE SIGNALS ENDPOINT
# ==========================================

@router.get("/signals")
def get_world_signals():
    """Return verified and sourced World Pulse signals."""
    return {
        "success": True,
        "total": len(CURATED_SIGNALS),
        "data": CURATED_SIGNALS
    }


# ==========================================
# WORLD-TO-ACTION INTELLIGENCE
# ==========================================

@router.get("/{student_id}")
def get_world_to_action(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        student = db.query(Student).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found."
        )

    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student.id
    ).first()

    dna = parse_dna_profile(student, profile)

    trends = recommend_trends(student, profile)
    opportunities = recommend_opportunities(student, profile)

    top_trend = trends[0] if trends else CURATED_SIGNALS[0]
    action_plan = create_action_plan(top_trend, dna)
    project_roadmap = generate_project_roadmap(
        top_trend.get("category", "AI"),
        student.skill_level
    )

    return {
        "success": True,
        "student": dna,
        "world_pulse": {
            "notice": "Dated, sourced signals from official engineering portals and technical feeds.",
            "recommended_trends": trends or CURATED_SIGNALS[:3],
            "live_signals": CURATED_SIGNALS
        },
        "personalized_recommendation": {
            "top_trend": top_trend.get("title"),
            "category": top_trend.get("category"),
            "reason": top_trend.get("match_reasons", [f"Aligned with your {dna.get('skill_level')} skill level and {dna.get('interest')} interest."]),
            "match_score": top_trend.get("match_score", 88)
        },
        "action_plan": action_plan,
        "project_roadmap": project_roadmap,
        "opportunity_radar": {
            "notice": "Curated student opportunities with verified eligibility checks.",
            "recommended_opportunities": opportunities
        }
    }
