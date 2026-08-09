import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import JobRequirement
from app.schemas.analysis import AnalysisResult
from app.schemas.resume import ResumeData

DEFAULT_REQUIREMENT: Dict[str, Any] = {
    "role": "Software Developer",
    "required_skills": ["Python", "C++", "C", "Java"],
    "preferred_skills": ["Docker", "LLM Integration"],
    "min_experience_years": 1
}

def get_active_job_requirement(db: Session = None) -> Dict[str, Any]:
    """Retrieve the active job requirement from the SQL database, with a robust fallback."""
    if db:
        try:
            req = db.query(JobRequirement).order_by(JobRequirement.id.desc()).first()
            if req:
                req_skills = json.loads(req.required_skills) if isinstance(req.required_skills, str) else req.required_skills
                pref_skills = json.loads(req.preferred_skills) if isinstance(req.preferred_skills, str) else req.preferred_skills
                return {
                    "role": req.role_title,
                    "required_skills": req_skills,
                    "preferred_skills": pref_skills,
                    "min_experience_years": req.min_experience_years,
                }
        except Exception:
            pass  # Fail gracefully to default requirement
    
    return DEFAULT_REQUIREMENT

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
    """Apply the scoring algorithm against the job requirement criteria."""
    req_skills = job.get("required_skills", [])
    pref_skills = job.get("preferred_skills", [])

    required_matched = _match_skills(req_skills, resume.skills)
    preferred_matched = _match_skills(pref_skills, resume.skills)

    required_total = len(req_skills) if req_skills else 1
    preferred_total = len(pref_skills) if pref_skills else 1

    skill_score = (len(required_matched) / required_total) * 100
    pref_score = (len(preferred_matched) / preferred_total) * 100

    goodfit = 0
    min_exp = job.get("min_experience_years", job.get("minimum_experience", 0))
    if resume.experience >= min_exp:
        goodfit += 20

    goodfit += (skill_score / 100) * 50
    goodfit += (pref_score / 100) * 30

    missing_skills = [
        skill for skill in req_skills if skill not in required_matched
    ]

    return AnalysisResult(
        job_title=job.get("role", job.get("title", "Software Developer")),
        candidate=resume,
        required_skills_matched=required_matched,
        preferred_skills_matched=preferred_matched,
        missing_skills=missing_skills,
        experience=resume.experience,
        good_fit_score=round(goodfit, 1),
    )

def analyze_resume(resume: ResumeData, requirement_file: Any = None, db: Session = None) -> AnalysisResult:
    """Score the parsed resume against the active database or fallback job requirements."""
    job = get_active_job_requirement(db)
    return calculate_good_fit_score(resume, job)
