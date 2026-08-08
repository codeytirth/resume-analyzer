from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.analyze import router as analyze_router
from app.api.routes.auth import router as auth_router
from app.api.routes.hr import router as hr_router
from app.database import engine, Base
from app import models

# Create all SQL tables in SQLite database if they don't exist yet
Base.metadata.create_all(bind=engine)

from app.exceptions.errors import (
    MissingApiKeyError,
    ResumeParseError,
    UnsupportedFileError,
)
from app.exceptions.handlers import (
    missing_api_key_handler,
    resume_parse_error_handler,
    unsupported_file_error_handler,
)

app = FastAPI(
    title="Resume Analyzer API",
    description="Analyze resumes against job requirements using Groq LLM.",
    version="1.0.0",
)

# Allow the React frontend (running on a different port) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(MissingApiKeyError, missing_api_key_handler)
app.add_exception_handler(ResumeParseError, resume_parse_error_handler)
app.add_exception_handler(UnsupportedFileError, unsupported_file_error_handler)

app.include_router(analyze_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(hr_router, prefix="/api")


@app.get("/health")
def health_check():
    """Simple endpoint to verify the server is running."""
    return {"status": "ok"}