"""
Core database models for Project Manager platform.
Includes: User, Project, Task, Channel, Message with relationships and constraints.
"""
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import (
    String, Text, Integer, Boolean, DateTime, ForeignKey,
    Enum as SQLEnum, CheckConstraint, UniqueConstraint, Index
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from .base import Base


class TimestampMixin:
    """Mixin for created_at and updated_at timestamps."""
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)


class TaskStatus(enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"
    ARCHIVED = "archived"


class TaskPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class ProjectStatus(enum.Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="user", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    # Relationships
    owned_projects: Mapped[list["Project"]] = relationship("Project", back_populates="owner", foreign_keys="Project.owner_id")
    assigned_tasks: Mapped[list["Task"]] = relationship("Task", back_populates="assignee", foreign_keys="Task.assignee_id")
    created_tasks: Mapped[list["Task"]] = relationship("Task", back_populates="creator", foreign_keys="Task.creator_id")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="author")

    def __repr__(self) -> str:
        return f"<User(id={self.id}, username={self.username}, role={self.role})>"


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status: Mapped[ProjectStatus] = mapped_column(SQLEnum(ProjectStatus), default=ProjectStatus.PLANNING, nullable=False, index=True)
    start_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)

    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="owned_projects", foreign_keys=[owner_id])
    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    channels: Mapped[list["Channel"]] = relationship("Channel", back_populates="project", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_projects_owner_status", "owner_id", "status"),
        CheckConstraint("end_date IS NULL OR start_date IS NULL OR end_date >= start_date", name="check_project_dates"),
    )

    def __repr__(self) -> str:
        return f"<Project(id={self.id}, name={self.name}, status={self.status.value})>"


class Task(Base, TimestampMixin):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    assignee_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    creator_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status: Mapped[TaskStatus] = mapped_column(SQLEnum(TaskStatus), default=TaskStatus.TODO, nullable=False, index=True)
    priority: Mapped[TaskPriority] = mapped_column(SQLEnum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False, index=True)
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    estimated_hours: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="tasks")
    assignee: Mapped[Optional["User"]] = relationship("User", back_populates="assigned_tasks", foreign_keys=[assignee_id])
    creator: Mapped["User"] = relationship("User", back_populates="created_tasks", foreign_keys=[creator_id])

    __table_args__ = (
        Index("ix_tasks_project_status", "project_id", "status"),
        Index("ix_tasks_assignee_status", "assignee_id", "status"),
        CheckConstraint("estimated_hours IS NULL OR estimated_hours > 0", name="check_positive_hours"),
    )

    def __repr__(self) -> str:
        return f"<Task(id={self.id}, title={self.title}, status={self.status.value}, priority={self.priority.value})>"


class Channel(Base, TimestampMixin):
    __tablename__ = "channels"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    is_private: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="channels")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="channel", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("project_id", "name", name="uq_channel_name_per_project"),
    )

    def __repr__(self) -> str:
        return f"<Channel(id={self.id}, name={self.name}, project_id={self.project_id})>"


class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    channel_id: Mapped[int] = mapped_column(Integer, ForeignKey("channels.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("messages.id", ondelete="SET NULL"), nullable=True)
    is_edited: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    channel: Mapped["Channel"] = relationship("Channel", back_populates="messages")
    author: Mapped["User"] = relationship("User", back_populates="messages")
    parent: Mapped[Optional["Message"]] = relationship("Message", remote_side=[id], backref="replies")

    __table_args__ = (
        Index("ix_messages_channel_created", "channel_id", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Message(id={self.id}, channel_id={self.channel_id}, author_id={self.author_id})>"

