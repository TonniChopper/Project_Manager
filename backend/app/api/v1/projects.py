from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone

from ...core.dependencies import get_db
from ...core.security import get_current_user
from ...schemas.project import ProjectCreate, ProjectUpdate, ProjectPublic, ProjectDetail, ProjectMetrics, ProjectWithMetrics
from ...db.models import Project, Task, User
from ...services.webhooks import send_webhook_sync, WebhookEventType

router = APIRouter()


def _send_project_webhook(db_url: str, event_type: str, project: Project, user_id: int, user_data: dict):
    """Background-safe webhook sender: open fresh session inside thread."""
    from ...db.session import SessionLocal
    db = SessionLocal()
    try:
        send_webhook_sync(
            db=db,
            event_type=event_type,
            entity_type="project",
            entity_id=project.id,
            entity_data={
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "status": project.status,
                "owner_id": project.owner_id,
                "is_archived": project.is_archived,
                "start_date": project.start_date.isoformat() if project.start_date else None,
                "end_date": project.end_date.isoformat() if project.end_date else None,
            },
            user_id=user_id,
            user_data=user_data,
            metadata={}
        )
    finally:
        db.close()


@router.post("/", response_model=ProjectPublic, status_code=status.HTTP_201_CREATED, summary="Create a project")
def create_project(payload: ProjectCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # current_user expected to be dict with username -> map to DB user if exists
    user = db.query(User).filter(User.username == current_user.get("username")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    project = Project(
        name=payload.name,
        description=payload.description,
        owner_id=user.id,
        status=payload.status,
        start_date=payload.start_date,
        end_date=payload.end_date,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/", response_model=list[ProjectPublic], summary="List projects")
def list_projects(include: str | None = Query(None), db: Session = Depends(get_db), current_user: dict | None = Depends(get_current_user)):
    stmt = db.query(Project).filter(Project.is_archived == False)
    projects = stmt.limit(100).all()
    if include == "metrics":
        # обогащаем метриками
        enriched: list[ProjectPublic] = []
        for p in projects:
            total = db.query(Task).filter(Task.project_id == p.id).count()
            completed = db.query(Task).filter(Task.project_id == p.id, Task.status == "done").count()
            overdue = db.query(Task).filter(Task.project_id == p.id, Task.due_date.isnot(None), Task.due_date < datetime.now(timezone.utc), Task.status != "done").count()
            last_week = datetime.now(timezone.utc) - timedelta(days=7)
            velocity_7d = db.query(Task).filter(Task.project_id == p.id, Task.status == "done", Task.updated_at >= last_week).count()
            progress = 0.0 if total == 0 else round((completed / total) * 100, 2)
            metrics = ProjectMetrics(total_tasks=total, completed_tasks=completed, progress_percent=progress, overdue_tasks=overdue, velocity_7d=velocity_7d)
            # Pydantic из attributes, но тут комбинируем вручную
            enriched.append(ProjectWithMetrics(**ProjectPublic.model_validate(p).model_dump(), metrics=metrics))
        return enriched  # type: ignore
    return projects


@router.get("/{project_id}", response_model=ProjectDetail, summary="Get project details")
def get_project(project_id: int, db: Session = Depends(get_db), current_user: dict | None = Depends(get_current_user)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    # If project is archived or private logic could go here; simplified: always return
    return project


@router.put("/{project_id}", response_model=ProjectDetail, summary="Update a project")
def update_project(project_id: int, payload: ProjectUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    # permission: only owner or admin
    username = current_user.get("username")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    if project.owner_id != user.id and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to update this project")
    # apply updates
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete (archive) project")
def delete_project(
    project_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    username = current_user.get("username")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    if project.owner_id != user.id and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this project")

    # Send webhook before archiving (open new session inside background task)
    background_tasks.add_task(
        _send_project_webhook,
        db_url="unused",
        event_type=WebhookEventType.PROJECT_DELETED,
        project=project,
        user_id=user.id,
        user_data={"username": user.username, "email": user.email}
    )

    # Soft-archive
    project.is_archived = True
    db.add(project)
    db.commit()
    return None


@router.get("/{project_id}/metrics", response_model=ProjectMetrics, summary="Get project metrics")
def get_project_metrics(project_id: int, db: Session = Depends(get_db), current_user: dict | None = Depends(get_current_user)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    total = db.query(Task).filter(Task.project_id == project_id).count()
    completed = db.query(Task).filter(Task.project_id == project_id, Task.status == "done").count()
    overdue = db.query(Task).filter(Task.project_id == project_id, Task.due_date.isnot(None), Task.due_date < datetime.now(timezone.utc), Task.status != "done").count()
    last_week = datetime.now(timezone.utc) - timedelta(days=7)
    velocity_7d = db.query(Task).filter(Task.project_id == project_id, Task.status == "done", Task.updated_at >= last_week).count()
    progress = 0.0 if total == 0 else round((completed / total) * 100, 2)
    return ProjectMetrics(total_tasks=total, completed_tasks=completed, progress_percent=progress, overdue_tasks=overdue, velocity_7d=velocity_7d)
