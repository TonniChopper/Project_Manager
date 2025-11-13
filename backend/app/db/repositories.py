"""
Repository pattern for User model.
Encapsulates database queries and provides clean interface for services.
"""
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..db.models import User
from ..core.security import get_password_hash


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.get(User, user_id)

    def get_by_username(self, username: str) -> Optional[User]:
        stmt = select(User).where(User.username == username)
        return self.db.execute(stmt).scalar_one_or_none()

    def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        return self.db.execute(stmt).scalar_one_or_none()

    def create(self, username: str, password: str, email: Optional[str] = None,
               role: str = "user", full_name: Optional[str] = None) -> User:
        hashed = get_password_hash(password)
        user = User(
            username=username,
            hashed_password=hashed,
            email=email,
            role=role,
            full_name=full_name,
            is_active=True
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User) -> User:
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user: User) -> None:
        self.db.delete(user)
        self.db.commit()

    def list_all(self, limit: int = 100, offset: int = 0) -> list[User]:
        stmt = select(User).limit(limit).offset(offset)
        return list(self.db.execute(stmt).scalars().all())

