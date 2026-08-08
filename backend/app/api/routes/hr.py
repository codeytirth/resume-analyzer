import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.config import settings

router = APIRouter(prefix="/hr", tags=["hr"])

class RequirementSchema(BaseModel):
    role: str
    required_skills: List[str]
    preferred_skills: List[str]
    min_experience_years: int

@router.get("/requirements", response_model=RequirementSchema)
def get_job_requirements():
    """Retrieve current job criteria configured by HR."""
    req_file = settings.requirement_file
    if not req_file.exists():
        raise HTTPException(status_code=404, detail="Requirement configuration file not found")
    try:
        with open(req_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read requirements: {str(e)}")

@router.post("/requirements", response_model=RequirementSchema)
def update_job_requirements(req: RequirementSchema):
    """Update job requirement criteria for resume matching."""
    req_file = settings.requirement_file
    try:
        data = req.dict()
        with open(req_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save requirements: {str(e)}")
