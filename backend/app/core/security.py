from datetime import datetime, timedelta, timezone
from typing import Any, Optional
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from uuid import uuid4
from ..core.settings import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


class TokenError(HTTPException):
    pass


def _build_payload(subject: str | Any, expire_minutes: int, token_type: str) -> dict[str, Any]:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
    return {
        "sub": str(subject),
        "exp": expire,
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "type": token_type,
        "iat": datetime.now(timezone.utc),
        "jti": str(uuid4()),
    }


def create_access_token(subject: str | Any, expires_minutes: Optional[int] = None) -> str:
    settings = get_settings()
    if expires_minutes is None:
        expires_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    payload = _build_payload(subject, expires_minutes, "access")
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: str | Any, expires_minutes: Optional[int] = None) -> str:
    settings = get_settings()
    if expires_minutes is None:
        expires_minutes = settings.REFRESH_TOKEN_EXPIRE_MINUTES
    payload = _build_payload(subject, expires_minutes, "refresh")
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def verify_token(token: str, token_type: str = "access") -> dict[str, Any]:
    settings = get_settings()
    try:
        decoded = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            audience=settings.JWT_AUDIENCE,
            issuer=settings.JWT_ISSUER,
        )
    except jwt.ExpiredSignatureError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired") from e
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from e

    if decoded.get("type") != token_type:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong token type")
    return decoded


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Placeholder user store (in-memory) - to replace with DB later
_fake_users: dict[str, dict[str, str]] = {}


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict[str, str]:
    payload = verify_token(token, token_type="access")
    username = payload.get("sub")
    if not username or username not in _fake_users:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return _fake_users[username]


def register_fake_user(username: str, password: str, role: str = "user") -> dict[str, str]:
    hashed = get_password_hash(password)
    user = {"username": username, "hashed_password": hashed, "role": role}
    _fake_users[username] = user
    return user
