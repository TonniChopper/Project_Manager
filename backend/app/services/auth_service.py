from fastapi import HTTPException, status
from ..core.security import (
    register_fake_user,
    verify_password,
    create_access_token,
    create_refresh_token,
    _fake_users,
)
from ..schemas.user import UserCreate, UserPublic, AuthRequest, AuthResponse


def register(data: UserCreate) -> UserPublic:
    if data.username in _fake_users:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username taken")
    user = register_fake_user(data.username, data.password, role=data.role)
    return UserPublic(username=user["username"], email=data.email, role=user["role"])


def authenticate(data: AuthRequest) -> AuthResponse:
    user = _fake_users.get(data.username)
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access = create_access_token(data.username)
    refresh = create_refresh_token(data.username)
    public = UserPublic(username=user["username"], email=None, role=user["role"])  # email optional
    return AuthResponse(access_token=access, refresh_token=refresh, user=public)

