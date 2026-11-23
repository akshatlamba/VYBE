
from app.sample_data import SAMPLE_TRENDS, SAMPLE_OPPORTUNITIES


def normalize(value):
    """Convert text into a consistent lowercase format."""
    return (value or "").lower().replace(",", " ").replace("/", " ")


def get_student_information(student, profile):
    """Combine the student's available information."""

    return {
        "interest": normalize(student.interest),
        "goal": normalize(student.goal),
        "skills": normalize(profile.skills),
        "career_goal": normalize(profile.career_goal),
        "level": normalize(student.skill_level)
    }


def calculate_match(student, profile, item, item_type):
    """Calculate an explainable recommendation score."""

    info = get_student_information(student, profile)

    if item_type == "trend":
        related_skills = item["related_skills"]
    else:
        related_skills = item["required_skills"]

    score = 0
    reasons = []
    matched_skills = []

    category = normalize(item["category"])

    # 1. Match student's interest
    if category and category in info["interest"]:
        score += 35
        reasons.append("Matches your interest")

    # 2. Match career goal
    career_text = info["goal"] + " " + info["career_goal"]

    if category and category in career_text:
        score += 25
        reasons.append("Supports your career goal")

    # 3. Match existing skills
    student_skills = info["skills"]

    for skill in related_skills:
        if normalize(skill) in student_skills:
            matched_skills.append(skill)

    skill_score = min(len(matched_skills) * 20, 40)
    score += skill_score

    if matched_skills:
        reasons.append(
            "Uses your existing skills: " + ", ".join(matched_skills)
        )

    # 4. Beginner-friendly adjustment
    if info["level"] == "beginner":
        if item.get("difficulty") == "beginner":
            score += 10
            reasons.append("Suitable for beginner-level exploration")

    return {
        "match_score": min(score, 100),
        "match_reasons": reasons or [
            "Potential area to explore based on your profile"
        ]
    }


def recommend_trends(student, profile, limit=3):

    recommendations = []

    for trend in SAMPLE_TRENDS:
        result = calculate_match(
            student, profile, trend, "trend"
        )

        recommendations.append({
            **trend,
            **result
        })

    recommendations.sort(
        key=lambda item: item["match_score"],
        reverse=True
    )

    return recommendations[:limit]


def recommend_opportunities(student, profile, limit=3):

    recommendations = []

    for opportunity in SAMPLE_OPPORTUNITIES:

        # This is a simple prototype skill-level filter.
        if (
            opportunity["minimum_level"] == "intermediate"
            and normalize(student.skill_level) == "beginner"
        ):
            continue

        result = calculate_match(
            student, profile, opportunity, "opportunity"
        )

        recommendations.append({
            **opportunity,
            **result
        })

    recommendations.sort(
        key=lambda item: item["match_score"],
        reverse=True
    )

    return recommendations[:limit]
