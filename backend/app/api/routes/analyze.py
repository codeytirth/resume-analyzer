import os
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, Depends

from app.config import settings
from app.exceptions.errors import MissingApiKeyError, ResumeParseError
from app.schemas.analysis import AnalysisResult
from app.services.llm_parser import parse_resume_with_llm
from app.services.pdf_extractor import extract_text_from_file
from app.services.scoring import analyze_resume

from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(tags=["analyze"])

ALLOWED_EXTENSIONS = {".pdf", ".txt"}


@router.post("/analyze", response_model=AnalysisResult)
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
) -> AnalysisResult:
    """Upload a resume PDF/TXT and receive a full fit analysis."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file was uploaded.")

    extension = Path(file.filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT files are supported.",
        )

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
            temp_path = temp_file.name
            content = await file.read()
            temp_file.write(content)

        resume_text = extract_text_from_file(temp_path)
        resume = parse_resume_with_llm(resume_text)
        return analyze_resume(resume, db=db)

    except MissingApiKeyError:
        raise
    except ResumeParseError:
        raise
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Analysis failed: {str(exc)}",
        ) from exc
    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)
