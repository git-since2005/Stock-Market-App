from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from database import get_db
from models import User
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(username: str):
    return jwt.encode({"username": username}, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    db_user = User(username=user.username, hashed_password=hash_password(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created successfully"}

@router.post("/login", response_model=Token)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user.username)
    return {"access_token": token, "token_type": "bearer"}
