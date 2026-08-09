import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

# Add project root directory to sys.path so resume_reader can be found
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from app.database import SessionLocal, Base, engine
from app.models import JobRequirement
from app.schemas.resume import ResumeData
from app.services.scoring import analyze_resume

def run_e2e_test():
    print("--- STARTING E2E SCORING TEST ---")
    
    # 1. Initialize clean test DB session
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Mock candidate resume data
    mock_resume = ResumeData(
        name="John Doe",
        email="john@example.com",
        phone="1234567890",
        skills=["Python", "C++", "Docker"],
        experience=3,
        education="B.S. Computer Science",
        summary="Experienced backend developer"
    )
    
    # TEST CASE 1: Empty JobRequirement Table (Fallback to DEFAULT_REQUIREMENT)
    db.query(JobRequirement).delete()
    db.commit()
    
    result_default = analyze_resume(mock_resume, db=db)
    print("\n[TEST CASE 1] Empty JobRequirement Table -> DEFAULT_REQUIREMENT Fallback:")
    print(f"  Job Title: {result_default.job_title}")
    print(f"  Good Fit Score: {result_default.good_fit_score}/100")
    print(f"  Matched Required Skills: {result_default.required_skills_matched}")
    print(f"  Matched Preferred Skills: {result_default.preferred_skills_matched}")
    print(f"  Missing Skills: {result_default.missing_skills}")
    
    assert result_default.job_title == "Software Developer"
    assert result_default.good_fit_score > 0
    print("  -> TEST CASE 1 PASSED!")
    
    # TEST CASE 2: Active JobRequirement Record in DB
    custom_req = JobRequirement(
        role_title="Senior Python Architect",
        required_skills='["Python", "Docker"]',
        preferred_skills='["AWS", "Kubernetes"]',
        min_experience_years=2
    )
    db.add(custom_req)
    db.commit()
    
    result_custom = analyze_resume(mock_resume, db=db)
    print("\n[TEST CASE 2] DB-backed Custom JobRequirement Record:")
    print(f"  Job Title: {result_custom.job_title}")
    print(f"  Good Fit Score: {result_custom.good_fit_score}/100")
    print(f"  Matched Required Skills: {result_custom.required_skills_matched}")
    print(f"  Matched Preferred Skills: {result_custom.preferred_skills_matched}")
    print(f"  Missing Skills: {result_custom.missing_skills}")
    
    assert result_custom.job_title == "Senior Python Architect"
    assert result_custom.good_fit_score > 0
    print("  -> TEST CASE 2 PASSED!")
    
    # Cleanup test record
    db.query(JobRequirement).delete()
    db.commit()
    db.close()
    
    print("\n--- ALL E2E TESTS COMPLETED SUCCESSFULLY! ---")

if __name__ == "__main__":
    run_e2e_test()
