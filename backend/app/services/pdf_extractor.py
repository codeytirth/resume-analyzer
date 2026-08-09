import sys

from pathlib import Path
from app.config import settings
from app.exceptions.errors import UnsupportedFileError

# # Ensure project root directory is in sys.path so resume_reader can be imported
# project_root = str(Path(__file__).resolve().parent.parent.parent.parent)
# if project_root not in sys.path:
#     sys.path.insert(0, project_root)

from app.services.resume_reader import read_resume  # noqa: E402


def extract_text_from_file(file_path: str) -> str:
    """Extract plain text from a PDF or TXT resume file."""
    try:
        return read_resume(file_path)
    except ValueError as exc:
        raise UnsupportedFileError(str(exc)) from exc
