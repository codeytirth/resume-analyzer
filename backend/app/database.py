import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Path to the SQLite SQL database file in the backend directory
DB_PATH = Path(__file__).resolve().parent.parent / "resume_analyzer.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# Connect to SQLite database
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency that provides a SQL database session for API endpoints."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
