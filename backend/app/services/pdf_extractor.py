import sys

from app.config import settings
from app.exceptions.errors import UnsupportedFileError

# Reuse the existing CLI text extractor without modifying resume_reader.py
sys.path.insert(0, str(settings.project_root))

from resume_reader import read_resume  # noqa: E402


def extract_text_from_file(file_path: str) -> str:
    """Extract plain text from a PDF or TXT resume file."""
    try:
        return read_resume(file_path)
    except ValueError as exc:
        raise UnsupportedFileError(str(exc)) from exc
