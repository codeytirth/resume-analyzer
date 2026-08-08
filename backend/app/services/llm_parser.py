from groq import Groq
from pydantic import ValidationError

from app.config import settings
from app.exceptions.errors import MissingApiKeyError, ResumeParseError
from app.schemas.resume import ResumeData

SYSTEM_MESSAGE = {
    "role": "system",
    "content": (
        "You are a resume parser. Extract the following fields: name, email, phone, "
        "education, experience, skills. Return ONLY a valid JSON object. Do not use "
        "markdown. Do not write ```json. Do not explain anything. If a field is "
        "missing, return an empty string or empty list."
    ),
}


def _build_prompt(resume_text: str) -> str:
    """Build the same LLM prompt used in the original CLI application."""
    return f"""
You are a resume parser.

Extract the following fields:

- name
- email
- phone
- education
- experience
- skills

Return ONLY this JSON:

{{
    "name": "",
    "email": "",
    "phone": "",
    "education": [],
    "experience": 0,
    "skills": []
}}

Rules:
1. Return ONLY a valid JSON object.
2. Do not use markdown.
3. Do not write ```json.
4. Do not explain anything.
5. If a field is missing, return an empty string or empty list.
6. Give experience in number of years (integer), and if not mentioned, return 0.

Resume:

{resume_text}
"""


def parse_resume_with_llm(resume_text: str) -> ResumeData:
    """Send resume text to Groq and validate the structured response."""
    try:
        api_key = settings.get_groq_api_key()
    except MissingApiKeyError:
        raise

    client = Groq(api_key=api_key)

    messages = [
        SYSTEM_MESSAGE,
        {"role": "system", "content": _build_prompt(resume_text)},
    ]

    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=messages,
    )

    raw_content = response.choices[0].message.content

    try:
        return ResumeData.model_validate_json(raw_content)
    except ValidationError as exc:
        raise ResumeParseError("LLM response did not match the expected resume format.") from exc
