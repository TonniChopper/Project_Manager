from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from ...core.dependencies import get_db
from ...core.security import get_current_user
from ...schemas.task import TaskCreate, TaskUpdate, TaskPublic, TaskDetail
from ...db.models import Task, Project
from ...services.webhooks import send_webhook_sync, WebhookEventType

router = APIRouter()


def _send_task_webhook(
    db: Session,
    event_type: str,
    task: Task,
    user_id: int,
    user_data: dict,
    metadata: dict = None
):
    """Helper to send task webhook event."""
    try:
        send_webhook_sync(
            db=db,
            event_type=event_type,
            entity_type="task",
            entity_id=task.id,
            entity_data={
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "project_id": task.project_id,
                "assignee_id": task.assignee_id,
                "creator_id": task.creator_id,
                "status": task.status.value if hasattr(task.status, 'value') else str(task.status),
                "priority": task.priority.value if hasattr(task.priority, 'value') else str(task.priority),
                "due_date": task.due_date.isoformat() if task.due_date else None,
                "completed_at": task.completed_at.isoformat() if task.completed_at else None,
            },
            user_id=user_id,
            user_data=user_data,
            metadata=metadata or {}
        )
    except Exception as e:
        from ...core.logging import logger
        logger.error(f"Failed to send webhook for {event_type}: {e}")


@router.post("/", response_model=TaskPublic, status_code=status.HTTP_201_CREATED, summary="Create a task")
def create_task(
    payload: TaskCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = db.get(Project, payload.project_id)
    if not project or project.is_archived:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project")
    # check membership simplified: allow any authenticated user
    username = current_user.get("username")
    user_row = db.execute("SELECT * FROM users WHERE username = :u", {"u": username}).mappings().first()
    if not user_row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    task = Task(
        title=payload.title,
        description=payload.description,
        project_id=payload.project_id,
        assignee_id=payload.assignee_id,
        creator_id=user_row["id"],
        status=payload.status,
        priority=payload.priority,
        due_date=payload.due_date,
        estimated_hours=payload.estimated_hours,
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    # Send webhook notification
    background_tasks.add_task(
        _send_task_webhook,
        db=db,
        event_type=WebhookEventType.TASK_CREATED,
        task=task,
        user_id=user_row["id"],
        user_data={"username": user_row["username"], "email": user_row.get("email")},
        metadata={"project_name": project.name}
    )

    return task


@router.get("/", response_model=List[TaskPublic], summary="List tasks")
def list_tasks(project_id: int | None = Query(None), assignee_id: int | None = Query(None), db: Session = Depends(get_db), current_user: dict | None = Depends(get_current_user)):
    q = db.query(Task)
    if project_id is not None:
        q = q.filter(Task.project_id == project_id)
    if assignee_id is not None:
        q = q.filter(Task.assignee_id == assignee_id)
    return q.limit(100).all()


@router.get("/{task_id}", response_model=TaskDetail, summary="Get task details")
def get_task(task_id: int, db: Session = Depends(get_db), current_user: dict | None = Depends(get_current_user)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskDetail, summary="Update a task")
def update_task(
    task_id: int,
    payload: TaskUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    username = current_user.get("username")
    user_row = db.execute("SELECT * FROM users WHERE username = :u", {"u": username}).mappings().first()
    if not user_row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    # permissions: creator, assignee, project owner, or admin
    project = db.get(Project, task.project_id)
    allowed = user_row["id"] == task.creator_id or user_row["id"] == task.assignee_id or user_row["id"] == project.owner_id or current_user.get("role") == "admin"
    if not allowed:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to update this task")

    # Track changes for appropriate webhook events
    old_assignee = task.assignee_id
    old_status = task.status

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.add(task)
    db.commit()
    db.refresh(task)

    # Determine event type based on changes
    event_type = WebhookEventType.TASK_UPDATED
    metadata = {"project_name": project.name}

    # Check if assignee changed
    if payload.assignee_id is not None and old_assignee != task.assignee_id:
        event_type = WebhookEventType.TASK_ASSIGNED
        metadata["previous_assignee_id"] = old_assignee if old_assignee else None
        metadata["new_assignee_id"] = task.assignee_id if task.assignee_id else None

    # Check if status changed to completed
    if payload.status and str(task.status) == "done" and str(old_status) != "done":
        event_type = WebhookEventType.TASK_COMPLETED
        metadata["previous_status"] = str(old_status) if old_status else None

    # Send webhook
    background_tasks.add_task(
        _send_task_webhook,
        db=db,
        event_type=event_type,
        task=task,
        user_id=user_row["id"],
        user_data={"username": user_row["username"], "email": user_row.get("email")},
        metadata=metadata
    )

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a task")
def delete_task(
    task_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    username = current_user.get("username")
    user_row = db.execute("SELECT * FROM users WHERE username = :u", {"u": username}).mappings().first()
    if not user_row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    project = db.get(Project, task.project_id)
    if user_row["id"] != project.owner_id and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this task")

    # Send webhook before deletion
    background_tasks.add_task(
        _send_task_webhook,
        db=db,
        event_type=WebhookEventType.TASK_DELETED,
        task=task,
        user_id=user_row["id"],
        user_data={"username": user_row["username"], "email": user_row.get("email")},
        metadata={"project_name": project.name}
    )

    db.delete(task)
    db.commit()
    return None

