# auth/utils.py
from passlib.context import CryptContext
from jose import jwt
from config import SECRET_KEY, ALGORITHM

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(username: str):
    return jwt.encode({"sub": username}, SECRET_KEY, algorithm=ALGORITHM)
