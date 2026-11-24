import os
import json
import re
from pathlib import Path
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import Student, StudentProfile, Event
from app.auth import get_current_student
from app.students import parse_dna_profile

# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

router = APIRouter()

# Gemini configuration
API_KEY = os.getenv("GEMINI_API_KEY")
CONFIGURED_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
def detect_message_language(text: str, fallback: str = "en") -> str:
    """Detect language and script of incoming query for natural multilingual matching."""
    # Check for Devanagari script (Hindi, Marathi, Sanskrit)
    if re.search(r'[\u0900-\u097F]', text):
        return "hi"
    # Check for Bengali script
    if re.search(r'[\u0980-\u09FF]', text):
        return "bn"
    # Check for Hinglish heuristics (Latin script with common Hindi words)
    hinglish_markers = {
        "kya", "kaise", "kare", "karna", "hai", "mujhe", "mera", "meri", "hum",
        "batao", "bataiye", "sikho", "sikhna", "chahiye", "accha", "kuch",
        "samajh", "bhi", "toh", "aur", "pe", "se", "mein", "kaunsa", "konsa"
    }
    words = set(re.findall(r'[a-zA-Z]+', text.lower()))
    if len(words.intersection(hinglish_markers)) >= 2:
        return "hinglish"
    return fallback


# ==========================================
# CONTRACT SCHEMAS
# ==========================================

class PulseRequest(BaseModel):
    student_id: int | str = 1
    question: str = Field(min_length=2, max_length=2000)
    signal_id: str | None = None
    persona_id: str | None = None
    language: str | None = "en"


class ActionProposal(BaseModel):
    kind: str  # "learn" | "build" | "apply"
    title: str
    description: str
    opportunity_id: str | None = None


class PulseResponse(BaseModel):
    assistant: str = "PULSE"
    student_id: int | str
    question: str
    content: str
    why_this: str
    action_proposals: list[ActionProposal]
    opportunity_ids: list[str]
    is_live_ai: bool
    model_used: str | None = None
    provider: str
    notice: str | None = None


# ==========================================
# DETERMINISTIC FALLBACK GUIDANCE ENGINE
# ==========================================

def generate_deterministic_guidance(
    question: str,
    dna: dict,
    signal_title: str | None = None
) -> dict:
    """
    Generate grounded, transparent, explainable student guidance
    tailored to the student's DNA profile when Gemini is offline or unconfigured.
    Never invents statistics or presents as live AI.
    """
    primary_goal = (dna.get("goal") or dna.get("career_goal") or "").lower()
    department = (dna.get("department") or "").lower()
    skill_level = (dna.get("skill_level") or "beginner").lower()
    name = dna.get("name", "Student")

    is_startup = "startup" in primary_goal or "business" in department or "entrepreneur" in primary_goal
    is_research = "research" in primary_goal or "phd" in primary_goal or "publication" in primary_goal or "4th" in dna.get("academic_year", "")

    signal_context = f' regarding the signal "{signal_title}"' if signal_title else ""

    if is_startup:
        content = (
            f"Analyzing this through a venture and student founder lens for {name}{signal_context}:\n\n"
            "1. **Map the Trend to Market Demand**: Modern automation and agentic workflows create high-margin opportunities for student-led products.\n"
            "2. **Draft a 1-Page Problem Canvas**: Define a specific operational pain point with clear user willingness-to-pay.\n"
            "3. **Founder Pitch Validation**: Prepare a concise 2-minute pitch for early-stage campus fellowships and entrepreneurship challenges."
        )
        why_this = f"Matched to your business focus, {dna.get('academic_year', 'current year')} timeline, and primary goal of launching a startup."
        proposals = [
            ActionProposal(
                kind="learn",
                title="Study Vertical Agent Economics",
                description="Review unit economics and B2B SaaS retention benchmarks for agentic software."
            ),
            ActionProposal(
                kind="build",
                title="Map Problem Canvas & 5 User Interviews",
                description="Validate user willingness-to-pay before writing production code."
            ),
            ActionProposal(
                kind="apply",
                title="Pitch to Antler India Campus Fellowship",
                description="Submit early-stage founder hypothesis and team details.",
                opportunity_id="opp-005"
            )
        ]
        opp_ids = ["opp-005", "opp-009", "opp-011"]

    elif is_research:
        content = (
            f"Analyzing this for frontier technical depth for {name}{signal_context}:\n\n"
            "1. **Reproduce Benchmark Architecture**: Explore recent open-source small language models and benchmark their inference efficiency.\n"
            "2. **Implement Optimized Kernel**: Write a PyTorch or CUDA module optimizing token throughput on local GPUs.\n"
            "3. **Target Lab Mentorship**: Prepare your research statement of purpose for leading academic summer internships."
        )
        why_this = f"Matched to your {dna.get('academic_year', '4th Year')} background, PyTorch familiarity, and research laboratory publication goal."
        proposals = [
            ActionProposal(
                kind="learn",
                title="Read Benchmark Paper on Edge Language Models",
                description="Analyze attention mechanisms and distributed synthesis evaluation."
            ),
            ActionProposal(
                kind="build",
                title="Reproduce 1B Parameter Edge SLM Benchmark",
                description="Measure latency and memory footprints under quantified 4-bit weights."
            ),
            ActionProposal(
                kind="apply",
                title="Submit Statement of Purpose to IISc SRIP",
                description="Frontier machine learning research track under department faculty.",
                opportunity_id="opp-006"
            )
        ]
        opp_ids = ["opp-006", "opp-010", "opp-012"]

    else:
        # Beginner student wanting internship / foundations
        content = (
            f"A simple, confidence-building path for a {skill_level} learner, built around your goals for {name}{signal_context}:\n\n"
            "1. **Strengthen Fundamentals**: Practice asynchronous Python and REST API consumption.\n"
            "2. **Build a Small Real Project**: Create a small autonomous Slack bot or web assistant you can demo publicly on GitHub.\n"
            "3. **Explore Beginner Hackathons**: Participate in team hackathons like Smart India Hackathon to apply your skills in a structured setting."
        )
        why_this = f"Matched to your {dna.get('academic_year', '2nd Year')} {dna.get('department', 'Computer Science')} profile and internship goal."
        proposals = [
            ActionProposal(
                kind="learn",
                title="Master Python Async & REST APIs",
                description="Learn how to call endpoints and process structured JSON payloads."
            ),
            ActionProposal(
                kind="build",
                title="Build 1 Small Agent Project with GitHub README",
                description="Create an autonomous news aggregator or Discord bot you can demo."
            ),
            ActionProposal(
                kind="apply",
                title="Join Smart India Hackathon 2026 Team",
                description="Free participation with certified college team.",
                opportunity_id="opp-001"
            )
        ]
        opp_ids = ["opp-001", "opp-003", "opp-002"]

    return {
        "content": content,
        "why_this": why_this,
        "action_proposals": proposals,
        "opportunity_ids": opp_ids
    }


# ==========================================
# PULSE ASK ENDPOINT
# ==========================================

@router.post("/ask", response_model=PulseResponse)
def ask_pulse(
    request: PulseRequest,
    db: Session = Depends(get_db)
):
    # 1. Resolve student DNA
    student = None
    target_id = request.student_id

    # Handle numeric ID or string
    if isinstance(target_id, int) or (isinstance(target_id, str) and target_id.isdigit()):
        student = db.query(Student).filter(Student.id == int(target_id)).first()

    if not student:
        # Fallback to first student in database
        student = db.query(Student).first()

    if not student:
        # If DB is empty, use default structured student DNA
        dna = {
            "name": "Student",
            "skill_level": "beginner",
            "interest": "AI Agents & Web Development",
            "goal": "internship",
            "academic_year": "2nd Year",
            "department": "Computer Science",
            "career_goal": "Software Engineering Internship",
            "learning_preference": "Hands-on projects"
        }
        student_id_val = 1
    else:
        profile = db.query(StudentProfile).filter(StudentProfile.student_id == student.id).first()
        dna = parse_dna_profile(student, profile)
        student_id_val = student.id

    # 2. Extract signal context if provided
    signal_title = None
    if request.signal_id:
        # Map common signals
        signal_map = {
            "sig-001": "Autonomous Coding Agents Enter Production Workflows",
            "sig-002": "India Semiconductor Mission Expands Student Fabrication Grants",
            "sig-003": "Open-Source Small Language Models Reach Edge Devices",
            "sig-004": "National Quantum Mission Approves 14 College Incubators",
            "sig-005": "WebAssembly Standardizes Component Model for Micro-Agents"
        }
        signal_title = signal_map.get(request.signal_id, request.signal_id)

    # 3. Check if Gemini API key is configured
    if API_KEY:
        try:
            from google import genai

            client = genai.Client(api_key=API_KEY)

            detected_lang = detect_message_language(request.question, request.language or "en")
            
            prompt = f"""
You are PULSE, the intelligent student growth and decision guide inside VYBE.
Your philosophy: "Your World. Your Guide. Your Growth."

Student DNA Profile:
- Name: {dna.get('name')}
- Academic Year: {dna.get('academic_year')}
- Department: {dna.get('department')}
- Skill Level: {dna.get('skill_level')}
- Primary Goal: {dna.get('goal') or dna.get('career_goal')}
- Skills: {dna.get('skills')}
- Interests: {dna.get('interests')}

Global Signal Context: {signal_title or "None provided"}
Student Query: {request.question}
Detected/Requested Language: {detected_lang}

MULTILINGUAL INTELLIGENCE INSTRUCTIONS (CRITICAL):
1. LANGUAGE MATCHING:
   - If the student query is in Hindi (Devanagari script), respond in fluent, professional Hindi (Devanagari).
   - If the student query is in Hinglish (Hindi written in Roman/English alphabet), respond in natural, relatable Hinglish.
   - If the student query is in Bengali (Bengali script), respond in Bengali.
   - If in English, respond in polished, concise English.
   - Match the exact tone and language of the student.
2. PRESERVE TECHNICAL TERMS: Keep programming keywords, tool names (e.g. Python, Docker, GitHub, Next.js), opportunity titles, and URLs in standard Latin script.
3. CONCRETE ACTION STEPS:
   - "learn": a foundational concept or tutorial to study
   - "build": a small practical project with tangible proof (e.g. GitHub repository)
   - "apply": a concrete opportunity, hackathon, or program to target
4. Output MUST be valid JSON with this exact schema:
{{
  "content": "Detailed, friendly, structured guidance answering the student's question in the matched language.",
  "why_this": "One clear sentence explaining personal relevance to their student profile in the matched language.",
  "action_proposals": [
    {{"kind": "learn", "title": "...", "description": "..."}},
    {{"kind": "build", "title": "...", "description": "..."}},
    {{"kind": "apply", "title": "...", "description": "..."}}
  ],
  "opportunity_ids": ["opp-001", "opp-002"]
}}
"""
            # Try configured models
            response_text = None
            successful_model = None

            for model_candidate in SUPPORTED_MODELS:
                if not model_candidate:
                    continue
                try:
                    res = client.models.generate_content(
                        model=model_candidate,
                        contents=prompt
                    )
                    if res and res.text:
                        response_text = res.text
                        successful_model = model_candidate
                        break
                except Exception as model_err:
                    print(f"PULSE model {model_candidate} failed: {model_err}")
                    continue

            if response_text and successful_model:
                # Clean JSON fences if model included them
                cleaned = response_text.strip()
                if cleaned.startswith("```json"):
                    cleaned = cleaned[7:]
                if cleaned.startswith("```"):
                    cleaned = cleaned[3:]
                if cleaned.endswith("```"):
                    cleaned = cleaned[:-3]

                parsed_json = json.loads(cleaned.strip())

                proposals = [
                    ActionProposal(
                        kind=p.get("kind", "learn"),
                        title=p.get("title", "Next step"),
                        description=p.get("description", ""),
                        opportunity_id=p.get("opportunity_id")
                    )
                    for p in parsed_json.get("action_proposals", [])
                ]

                return PulseResponse(
                    student_id=student_id_val,
                    question=request.question,
                    content=parsed_json.get("content", response_text),
                    why_this=parsed_json.get("why_this", f"Tailored to {dna.get('name')}'s learning pathway."),
                    action_proposals=proposals,
                    opportunity_ids=parsed_json.get("opportunity_ids", ["opp-001"]),
                    is_live_ai=True,
                    model_used=successful_model,
                    provider="Google Gemini Live API"
                )

        except Exception as api_err:
            print(f"PULSE live AI generation failed: {type(api_err).__name__}: {api_err}")
            # Fall through to deterministic guidance

    # 4. Fallback to deterministic contextual guidance
    fallback = generate_deterministic_guidance(request.question, dna, signal_title)

    return PulseResponse(
        student_id=student_id_val,
        question=request.question,
        content=fallback["content"],
        why_this=fallback["why_this"],
        action_proposals=fallback["action_proposals"],
        opportunity_ids=fallback["opportunity_ids"],
        is_live_ai=False,
        model_used=None,
        provider="Deterministic Student Guidance Engine",
        notice="Operating in deterministic guidance mode. Recommendations are personalized from your Student DNA without unverified AI hallucinations."
    )
