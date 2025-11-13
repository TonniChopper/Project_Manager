"""
Tests for database models: creation, relationships, constraints.
Uses ephemeral in-memory SQLite for isolation.
"""
import pytest
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from backend.app.db.base import Base
from backend.app.db.models import User, Project, Task, Channel, Message, TaskStatus, TaskPriority, ProjectStatus


@pytest.fixture(scope="function")
def test_db() -> Generator[Session, None, None]:
    """Create ephemeral test database."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(bind=engine)
    TestSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    db = TestSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)


def test_user_creation(test_db: Session):
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password="hashed123",
        role="admin",
        full_name="Test User"
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)

    assert user.id is not None
    assert user.username == "testuser"
    assert user.is_active is True
    assert user.created_at is not None


def test_project_with_owner(test_db: Session):
    user = User(username="owner", hashed_password="hash", email="owner@test.com")
    test_db.add(user)
    test_db.commit()

    project = Project(
        name="Test Project",
        description="A test project",
        owner_id=user.id,
        status=ProjectStatus.ACTIVE
    )
    test_db.add(project)
    test_db.commit()
    test_db.refresh(project)

    assert project.id is not None
    assert project.owner.username == "owner"
    assert project.status == ProjectStatus.ACTIVE


def test_task_relationships(test_db: Session):
    creator = User(username="creator", hashed_password="hash1")
    assignee = User(username="assignee", hashed_password="hash2")
    test_db.add_all([creator, assignee])
    test_db.commit()

    project = Project(name="Proj", owner_id=creator.id, status=ProjectStatus.PLANNING)
    test_db.add(project)
    test_db.commit()

    task = Task(
        title="Task 1",
        description="Do something",
        project_id=project.id,
        creator_id=creator.id,
        assignee_id=assignee.id,
        status=TaskStatus.TODO,
        priority=TaskPriority.HIGH
    )
    test_db.add(task)
    test_db.commit()
    test_db.refresh(task)

    assert task.project.name == "Proj"
    assert task.creator.username == "creator"
    assert task.assignee.username == "assignee"
    assert task.status == TaskStatus.TODO


def test_channel_and_messages(test_db: Session):
    user = User(username="author", hashed_password="hash")
    test_db.add(user)
    test_db.commit()

    project = Project(name="Chat Project", owner_id=user.id)
    test_db.add(project)
    test_db.commit()

    channel = Channel(name="general", project_id=project.id, is_private=False)
    test_db.add(channel)
    test_db.commit()

    msg = Message(content="Hello World", channel_id=channel.id, author_id=user.id)
    test_db.add(msg)
    test_db.commit()
    test_db.refresh(msg)

    assert msg.channel.name == "general"
    assert msg.author.username == "author"
    assert msg.is_edited is False


def test_cascade_delete_project(test_db: Session):
    user = User(username="owner", hashed_password="hash")
    test_db.add(user)
    test_db.commit()

    project = Project(name="ToDelete", owner_id=user.id)
    test_db.add(project)
    test_db.commit()

    task = Task(title="Task", project_id=project.id, creator_id=user.id, status=TaskStatus.TODO, priority=TaskPriority.LOW)
    test_db.add(task)
    test_db.commit()

    # Delete project should cascade to task
    test_db.delete(project)
    test_db.commit()

    remaining_tasks = test_db.query(Task).filter_by(project_id=project.id).all()
    assert len(remaining_tasks) == 0


def test_message_threading(test_db: Session):
    user = User(username="threader", hashed_password="hash")
    test_db.add(user)
    test_db.commit()

    project = Project(name="Thread Test", owner_id=user.id)
    test_db.add(project)
    test_db.commit()

    channel = Channel(name="thread-channel", project_id=project.id)
    test_db.add(channel)
    test_db.commit()

    parent_msg = Message(content="Parent", channel_id=channel.id, author_id=user.id)
    test_db.add(parent_msg)
    test_db.commit()
    test_db.refresh(parent_msg)

    reply = Message(content="Reply", channel_id=channel.id, author_id=user.id, parent_id=parent_msg.id)
    test_db.add(reply)
    test_db.commit()
    test_db.refresh(reply)

    assert reply.parent.content == "Parent"
    assert len(parent_msg.replies) == 1

