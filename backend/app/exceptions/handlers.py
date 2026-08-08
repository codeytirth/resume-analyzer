from fastapi import Request
from fastapi.responses import JSONResponse

from app.exceptions.errors import (
    MissingApiKeyError,
    ResumeParseError,
    UnsupportedFileError,
)


async def missing_api_key_handler(_request: Request, exc: MissingApiKeyError) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )


async def resume_parse_error_handler(_request: Request, exc: ResumeParseError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"detail": str(exc)},
    )


async def unsupported_file_error_handler(
    _request: Request, exc: UnsupportedFileError
) -> JSONResponse:
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )
