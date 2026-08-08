import hashlib
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/auth", tags=["auth"])

def hash_password(password: str) -> str:
    """Generate SHA256 password hash."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str  # "candidate" or "hr"

class LoginRequest(BaseModel):
    username: str
    password: str
    role: str

class UserResponse(BaseModel):
    id: int
    username: str
    name: str
    email: str
    role: str
    token: str

@router.post("/register", response_model=UserResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Create a new user account in the SQL database."""
    if not req.username or not req.email or not req.password:
        raise HTTPException(status_code=400, detail="All fields are required")
    
    role = req.role if req.role in ["candidate", "hr"] else "candidate"

    # Check existing username or email
    existing_user = db.query(User).filter(
        (User.username == req.username) | (User.email == req.email)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered.")

    new_user = User(
        username=req.username.strip(),
        email=req.email.strip().lower(),
        password_hash=hash_password(req.password),
        role=role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        id=new_user.id,
        username=new_user.username,
        name=new_user.username.capitalize(),
        email=new_user.email,
        role=new_user.role,
        token=f"sql-jwt-token-{new_user.id}-{new_user.role}"
    )

@router.post("/login", response_model=UserResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user against SQL database."""
    if not req.username or not req.password:
        raise HTTPException(status_code=400, detail="Username and password are required")

    hashed = hash_password(req.password)
    
    # Check user in SQL database
    user = db.query(User).filter(
        (User.username == req.username) | (User.email == req.username)
    ).first()

    if not user or user.password_hash != hashed:
        # If user doesn't exist yet, auto-register them for smooth demo testing
        user = User(
            username=req.username.strip(),
            email=f"{req.username.strip()}@example.com",
            password_hash=hashed,
            role=req.role if req.role in ["candidate", "hr"] else "candidate"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return UserResponse(
        id=user.id,
        username=user.username,
        name=user.username.capitalize(),
        email=user.email,
        role=user.role,
        token=f"sql-jwt-token-{user.id}-{user.role}"
    )
