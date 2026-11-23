
def generate_project_roadmap(category, skill_level):

    category = (category or "").lower()
    skill_level = (skill_level or "").lower()

    if category == "ai":
        project = "AI Study Assistant"
        skills = ["Python basics", "AI fundamentals", "API integration"]

    elif category == "web development":
        project = "Personal Portfolio Website"
        skills = ["HTML", "CSS", "JavaScript"]

    elif category == "data science":
        project = "Student Performance Data Explorer"
        skills = ["Python", "Basic statistics", "Data visualization"]

    else:
        project = "Beginner Learning Project"
        skills = ["Research", "Problem solving", "Basic programming"]

    return {
        "project_title": project,
        "level": skill_level or "beginner",
        "skills_to_learn": skills,
        "milestones": [
            {
                "step": 1,
                "title": "Learn the fundamentals",
                "status": "not_started"
            },
            {
                "step": 2,
                "title": "Plan your project",
                "status": "not_started"
            },
            {
                "step": 3,
                "title": "Build the first version",
                "status": "not_started"
            },
            {
                "step": 4,
                "title": "Test and improve",
                "status": "not_started"
            },
            {
                "step": 5,
                "title": "Document your project",
                "status": "not_started"
            }
        ]
    }
