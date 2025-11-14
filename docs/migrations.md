[← Back to Index](./INDEX.md)

# Database Migrations (Alembic)

Alembic manages PostgreSQL schema changes with version control.

## Common Commands

### Create Migration
```powershell
# Auto-generate from model changes
alembic revision --autogenerate -m "add user avatar field"

# Manual migration (empty template)
alembic revision -m "custom migration"
```

### Apply Migrations
```powershell
# Apply all pending migrations
alembic upgrade head

# Apply specific migration
alembic upgrade <revision_id>

# Move forward N steps
alembic upgrade +2
```

### Rollback
```powershell
# Roll back one migration
alembic downgrade -1

# Roll back to specific revision
alembic downgrade <revision_id>

# Roll back all migrations
alembic downgrade base
```

### Inspect
```powershell
# Show current version
alembic current

# Show migration history
alembic history

# Show detailed history
alembic history --verbose
```

## Migration Files

Location: `backend/alembic/versions/`

Each migration has:
- `upgrade()` - Apply changes
- `downgrade()` - Revert changes

## Workflow

1. **Modify models** in `backend/app/db/models.py`
2. **Generate migration:** `alembic revision --autogenerate -m "description"`
3. **Review** generated file in `versions/`
4. **Apply:** `alembic upgrade head`
5. **Commit** migration file to git

## Best Practices

- Review auto-generated migrations before applying
- Always implement `downgrade()` for reversibility
- Test migrations on staging before production
- Backup database before applying in production
- Use descriptive migration messages

## Troubleshooting

**"Target database is not up to date"**
```powershell
alembic upgrade head
```

**Multiple heads (branching)**
```powershell
alembic merge heads -m "merge migrations"
```

**Manual sync**
```powershell
# Mark current state without running migrations
alembic stamp head
```

## Related Files
- `alembic.ini` - Configuration
- `backend/alembic/env.py` - Runtime environment
- `backend/alembic/README.md` - Detailed guide

