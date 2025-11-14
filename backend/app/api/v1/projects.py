from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ...core.dependencies import get_db
from ...core.security import get_current_user
from ...schemas.project import ProjectCreate, ProjectUpdate, ProjectPublic, ProjectDetail
from ...db.models import Project, User

router = APIRouter()


@router.post("/", response_model=ProjectPublic, status_code=status.HTTP_201_CREATED, summary="Create a project")
def create_project(payload: ProjectCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # current_user expected to be dict with username -> map to DB user if exists
    user = db.execute("SELECT * FROM users WHERE username = :u", {"u": current_user.get("username")}).mappings().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    project = Project(
        name=payload.name,
        description=payload.description,
        owner_id=user["id"],
        status=payload.status,
        start_date=payload.start_date,
        end_date=payload.end_date,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/", response_model=List[ProjectPublic], summary="List projects")
def list_projects(db: Session = Depends(get_db), current_user: dict | None = Depends(get_current_user)):
    # Show all non-archived projects; authenticated user will effectively see all but membership filtering is simplified
    stmt = db.query(Project).filter(Project.is_archived == False)
    projects = stmt.limit(100).all()
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
    user = db.execute("SELECT * FROM users WHERE username = :u", {"u": username}).mappings().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    if project.owner_id != user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to update this project")
    # apply updates
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete (archive) project")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    username = current_user.get("username")
    user = db.execute("SELECT * FROM users WHERE username = :u", {"u": username}).mappings().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    if project.owner_id != user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this project")
    # Soft-archive
    project.is_archived = True
    db.add(project)
    db.commit()
    return None

