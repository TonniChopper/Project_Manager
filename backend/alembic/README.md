# Alembic Database Migrations

## Purpose

Alembic is used to manage PostgreSQL schema migrations.

## Structure

```
backend/alembic/
├── versions/              # Migration files
│   └── add_webhook_events.py
├── env.py                 # Alembic configuration
├── script.py.mako         # Template for new migrations
└── alembic.ini            # Main configuration
```

---

## 🚀 Quick Start

### Initialization (already done)

```bash
# Alembic is already initialized in this repository
# If you need to reinitialize:
alembic init alembic
```

### Current DB structure

Tables include:
- `users` – Users
- `projects` – Projects
- `tasks` – Tasks
- `channels` – Channels for messages
- `messages` – Messages in channels
- `webhook_events` – Outgoing webhook audit (new)

---

## 📝 Alembic Commands

### Create a new migration

```bash
# Auto-generate migration (compare models.py to DB)
alembic revision --autogenerate -m "Describe changes"

# Manual migration (empty template)
alembic revision -m "Describe changes"
```

### Apply migrations

```bash
# Apply all migrations
alembic upgrade head

# Apply a specific revision
alembic upgrade <revision_id>

# Move forward N steps
alembic upgrade +2
```

### Rollback

```bash
# Roll back the last migration
alembic downgrade -1

# Roll back to a specific revision
alembic downgrade <revision_id>

# Roll back to base (no migrations)
alembic downgrade base
```

### Inspect history

```bash
# Current DB version
alembic current

# Migration history
alembic history

# Verbose history
alembic history --verbose
```

---

## 🔧 Configuration

### alembic.ini

```ini
[alembic]
script_location = alembic
sqlalchemy.url = postgresql+psycopg2://postgres:postgres@localhost:5432/project_manager

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic
```

### env.py

```python
from backend.app.db.base import Base
from backend.app.db.models import *  # import all models for autogenerate

target_metadata = Base.metadata

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        
        with context.begin_transaction():
            context.run_migrations()
```

---

## 📋 Existing migration

### 1) Webhook Events Table (`add_webhook_events.py`)

Creates:
- `webhook_events` table for outgoing webhook audit
- Indexes for performance
- Foreign key to `users`

Apply:
```bash
alembic upgrade head
```

Rollback:
```bash
alembic downgrade -1
```

---

## 🎯 Migration examples

### Add a new column

```python
def upgrade():
    op.add_column('projects', sa.Column('tags', sa.ARRAY(sa.String), nullable=True))

def downgrade():
    op.drop_column('projects', 'tags')
```

### Create a new table

```python
def upgrade():
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id')),
        sa.Column('message', sa.Text, nullable=False),
        sa.Column('read', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('now()'))
    )
    op.create_index('ix_notifications_user', 'notifications', ['user_id'])

def downgrade():
    op.drop_table('notifications')
```

### Change column type

```python
def upgrade():
    op.alter_column('tasks', 'estimated_hours', type_=sa.Float(), existing_type=sa.Integer())

def downgrade():
    op.alter_column('tasks', 'estimated_hours', type_=sa.Integer(), existing_type=sa.Float())
```

---

## ⚠️ Best Practices

1) Always review SQL before applying:
```bash
alembic upgrade head --sql
```

2) Use transactions in migrations:
```python
with op.get_bind().begin():
    op.add_column(...)
    op.create_index(...)
```

3) Prefer raw SQL for data migrations (avoid importing models):
```python
op.execute("INSERT INTO roles (name) VALUES ('admin'), ('user')")
```

4) Make migrations reversible (implement both upgrade/downgrade)

5) Use meaningful messages and names

---

## 🔍 Troubleshooting

### Error: "Target database is not up to date"

```bash
# Check current version
alembic current

# Apply missing migrations
alembic upgrade head
```

### Error: "Can't locate revision identified by..."

```bash
# Show all migrations
alembic history

# If migration is missing, recreate it:
alembic revision -m "name"
```

### Merge migration

```bash
# If multiple developers created migrations in parallel:
# 1. Manually merge migrations
# 2. Or create a merge migration
alembic merge <rev1> <rev2> -m "merge migrations"
```

### Database in inconsistent state

```bash
# 1. Rollback all migrations
alembic downgrade base

# 2. Reapply migrations
alembic upgrade head

# Or mark as manually applied:
alembic stamp head
```

---

## 🐳 Docker usage

Apply migrations in Docker entrypoint or command, e.g.:
```dockerfile
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app"]
```

Docker Compose example:
```yaml
services:
  app:
    command: >
      sh -c "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0"
```

---

## 🚀 Production checklist

1) Backup the database
   ```bash
   pg_dump -U postgres project_manager > backup.sql
   ```

2) Test migrations on staging
   ```bash
   DATABASE_URL=<staging_url> alembic upgrade head
   ```

3) Review generated SQL
   ```bash
   alembic upgrade head --sql > migration.sql
   # Check the contents of migration.sql
   ```

4) Apply `alembic upgrade head`

5) Verify `alembic current`

---

## 📚 References

- Alembic: https://alembic.sqlalchemy.org/
- SQLAlchemy: https://docs.sqlalchemy.org/
- PostgreSQL: https://www.postgresql.org/docs/

---

Last Updated: 2025-11-14  
Version: 1.0
