import json
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import JobRequirement
from app.services.scoring import DEFAULT_REQUIREMENT, get_active_job_requirement

router = APIRouter(prefix="/hr", tags=["hr"])

class RequirementSchema(BaseModel):
    role: str
    required_skills: List[str]
    preferred_skills: List[str]
    min_experience_years: int

@router.get("/requirements", response_model=RequirementSchema)
def get_job_requirements(db: Session = Depends(get_db)):
    """Retrieve current job criteria configured by HR from SQL DB or return default fallback."""
    return get_active_job_requirement(db)

@router.post("/requirements", response_model=RequirementSchema)
def update_job_requirements(req: RequirementSchema, db: Session = Depends(get_db)):
    """Update job requirement criteria in the SQL database."""
    try:
        req_record = db.query(JobRequirement).order_by(JobRequirement.id.desc()).first()
        if not req_record:
            req_record = JobRequirement(
                role_title=req.role,
                required_skills=json.dumps(req.required_skills),
                preferred_skills=json.dumps(req.preferred_skills),
                min_experience_years=req.min_experience_years
            )
            db.add(req_record)
        else:
            req_record.role_title = req.role
            req_record.required_skills = json.dumps(req.required_skills)
            req_record.preferred_skills = json.dumps(req.preferred_skills)
            req_record.min_experience_years = req.min_experience_years
        
        db.commit()
        db.refresh(req_record)
        return get_active_job_requirement(db)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save requirements: {str(e)}")
