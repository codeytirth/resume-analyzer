from pydantic import BaseModel


class ResumeData(BaseModel):
    """Structured resume fields returned by the LLM parser."""

    name: str
    email: str
    phone: str
    education: list[str]
    experience: int
    skills: list[str]
