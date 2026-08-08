import json
from pathlib import Path

from app.schemas.analysis import AnalysisResult
from app.schemas.resume import ResumeData


def _match_skills(required_skills: list[str], candidate_skills: list[str]) -> list[str]:
    normalized_candidate_skills = [skill.lower() for skill in candidate_skills]
    matched = []

    for skill in required_skills:
        if skill.lower() in normalized_candidate_skills:
            matched.append(skill)

    return matched


def calculate_good_fit_score(
    resume: ResumeData,
    job: dict,
) -> AnalysisResult:
    """Apply the same scoring algorithm used in the original CLI application."""
    required_matched = _match_skills(job["required_skills"], resume.skills)
    preferred_matched = _match_skills(job["preferred_skills"], resume.skills)

    required_total = len(job["required_skills"])
    preferred_total = len(job["preferred_skills"])

    skill_score = (len(required_matched) / required_total) * 100
    pref_score = (len(preferred_matched) / preferred_total) * 100

    goodfit = 0
    min_exp = job.get("min_experience_years", job.get("minimum_experience", 0))
    if resume.experience >= min_exp:
        goodfit += 20

    goodfit += (skill_score / 100) * 50
    goodfit += (pref_score / 100) * 30

    missing_skills = [
        skill for skill in job["required_skills"] if skill not in required_matched
    ]

    return AnalysisResult(
        job_title=job.get("role", job.get("title", "Job Description")),
        candidate=resume,
        required_skills_matched=required_matched,
        preferred_skills_matched=preferred_matched,
        missing_skills=missing_skills,
        experience=resume.experience,
        good_fit_score=round(goodfit, 1),
    )


def analyze_resume(resume: ResumeData, requirement_file: Path) -> AnalysisResult:
    """Load job requirements and score the parsed resume."""
    with open(requirement_file, "r", encoding="utf-8") as file:
        job = json.load(file)

    return calculate_good_fit_score(resume, job)
