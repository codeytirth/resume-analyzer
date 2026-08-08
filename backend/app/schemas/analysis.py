from pydantic import BaseModel

from app.schemas.resume import ResumeData


class AnalysisResult(BaseModel):
    """Full analysis response sent to the frontend."""

    job_title: str
    candidate: ResumeData
    required_skills_matched: list[str]
    preferred_skills_matched: list[str]
    missing_skills: list[str]
    experience: int
    good_fit_score: float
