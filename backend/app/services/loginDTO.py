from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import jwt

app = FastAPI()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Hardcoded users (use a DB in production!)
USERS = {
    "admin": {
        "username": "marcolam",
        "hashed_password": pwd_context.hash("marcolam"),
        "role": "admin"
    },
}

# Utility Functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_user(username: str):
    return USERS.get(username)

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user or not verify_password(password, user["hashed_password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_optional_token(request: Request) -> Optional[str]:
    auth: str = request.headers.get("Authorization")
    if auth and auth.lower().startswith("bearer "):
        return auth[7:]
    return None

def try_get_user_info(token: Optional[str]) -> Optional[dict]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        role = payload.get("role")
        if username and role:
            return {"username": username, "role": role}
    except jwt.PyJWTError:
        pass
    return None

# Simulated route logic functions
def list_event_login_logic():
    return {"message": "Admin event list"}

def list_event_logic():
    return {"message": "Public event list"}

# Add this function to validate the admin token
async def validate_admin_token(token: str = Depends(oauth2_scheme)):
    user_info = try_get_user_info(token)
    if not user_info or user_info["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized as admin"
        )
    return user_info