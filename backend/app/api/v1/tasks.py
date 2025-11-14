from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from ...core.dependencies import get_db
from ...core.security import get_current_user
from ...schemas.task import TaskCreate, TaskUpdate, TaskPublic, TaskDetail
from ...db.models import Task, Project, User

router = APIRouter()


@router.post("/", response_model=TaskPublic, status_code=status.HTTP_201_CREATED, summary="Create a task")
def create_task(payload: TaskCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
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
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
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
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a task")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
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
    db.delete(task)
    db.commit()
    return None

