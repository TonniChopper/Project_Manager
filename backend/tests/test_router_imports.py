"""Minimal test to verify routers work"""
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

# Simple test - can we import the routers?
print("Testing router imports...")

try:
    from backend.app.api.v1 import projects, tasks, channels, messages, users
    print("✓ All v1 routers imported")

    # Check router objects exist
    assert hasattr(projects, 'router'), "projects.router missing"
    assert hasattr(tasks, 'router'), "tasks.router missing"
    assert hasattr(channels, 'router'), "channels.router missing"
    assert hasattr(messages, 'router'), "messages.router missing"
    assert hasattr(users, 'router'), "users.router missing"
    print("✓ All routers have 'router' attribute")

    # Check they are APIRouter instances
    from fastapi import APIRouter
    assert isinstance(projects.router, APIRouter)
    assert isinstance(tasks.router, APIRouter)
    print("✓ Routers are APIRouter instances")

    print("\n✅ All router checks passed!")

except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

