import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.database import Base

class User(Base):
    """SQL Table for registered users (Candidates and HR Recruiters)."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="candidate")  # 'candidate' or 'hr'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class JobRequirement(Base):
    """SQL Table for HR configured job requirement criteria."""
    __tablename__ = "job_requirements"

    id = Column(Integer, primary_key=True, index=True)
    role_title = Column(String, nullable=False)
    required_skills = Column(Text, nullable=False)  # JSON string of skills
    preferred_skills = Column(Text, nullable=False) # JSON string of skills
    min_experience_years = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class ResumeEvaluation(Base):
    """SQL Table storing historical resume evaluations."""
    __tablename__ = "resume_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    candidate_name = Column(String, nullable=True)
    candidate_email = Column(String, nullable=True)
    filename = Column(String, nullable=False)
    good_fit_score = Column(Integer, nullable=False)
    analysis_data = Column(Text, nullable=False)  # JSON string of full evaluation
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
