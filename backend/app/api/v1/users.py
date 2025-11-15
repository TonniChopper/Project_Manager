from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ...core.dependencies import get_db
from ...core.security import get_current_user, get_password_hash
from ...schemas.user import UserCreate, UserPublic
from ...db.repositories import UserRepository

router = APIRouter()


@router.post("/", response_model=UserPublic, status_code=status.HTTP_201_CREATED, summary="Create user (register)")
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    existing = repo.get_by_username(payload.username)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    user = repo.create(username=payload.username, password=payload.password, email=payload.email)
    return user


@router.get("/", response_model=List[UserPublic], summary="List users (admin-only)")
def list_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privilege required")
    repo = UserRepository(db)
    return repo.list_all()


@router.get("/{user_id}", response_model=UserPublic, summary="Get user profile")
def get_user(user_id: int, db: Session = Depends(get_db), current_user: dict | None = Depends(get_current_user)):
    repo = UserRepository(db)
    user = repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    # if requesting private details, enforce ownership or admin; for now return public info
    return user


@router.put("/{user_id}", response_model=UserPublic, summary="Update user")
def update_user(user_id: int, payload: UserCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    repo = UserRepository(db)
    user = repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    # allow self or admin
    username = current_user.get("username")
    if current_user.get("role") != "admin" and username != user.username:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to update this user")
    # username updates are not allowed
    if payload.email is not None:
        user.email = payload.email
    if payload.password:
        user.hashed_password = get_password_hash(payload.password)
    repo.update(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete user")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    repo = UserRepository(db)
    user = repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    username = current_user.get("username")
    if current_user.get("role") != "admin" and username != user.username:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this user")
    repo.delete(user)
    return None
