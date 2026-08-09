import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Get target database URL (PostgreSQL in Production, SQLite in Local Dev)
SQLALCHEMY_DATABASE_URL = settings.database_url

# Configure connection parameters based on DB type
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# Connect to database
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args
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
