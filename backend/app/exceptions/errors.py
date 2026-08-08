class MissingApiKeyError(Exception):
    """Raised when GROQ_API_KEY is not set in the environment."""


class ResumeParseError(Exception):
    """Raised when the LLM response cannot be parsed into valid resume data."""


class UnsupportedFileError(Exception):
    """Raised when an uploaded file type is not supported."""
