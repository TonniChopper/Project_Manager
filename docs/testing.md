[← Back to Index](./INDEX.md)

# Testing

## Quick Start
```powershell
# All tests
pytest -q

# Verbose output
pytest -v

# Stop on first failure
pytest -x
```

## Test Suites

### By Module
```powershell
pytest backend/tests/test_models.py -v      # Database models
pytest backend/tests/test_auth.py -v        # Authentication
pytest backend/tests/test_ws.py -v          # WebSocket
pytest backend/tests/test_webhooks.py -v    # Webhooks
pytest backend/tests/test_health.py -v      # Health checks
```

### By Marker
```powershell
pytest -m "not slow"     # Skip slow tests
pytest -k "auth"         # Run tests matching "auth"
```

## Coverage

Generate coverage report:
```powershell
pytest --cov=backend/app --cov-report=html --cov-report=term
```

View HTML report:
```powershell
# Open backend/htmlcov/index.html in browser
```

## CI/CD

GitHub Actions workflow:
```yaml
- name: Run tests
  run: pytest --cov=backend/app --cov-report=xml
```

## Test Database

Tests use in-memory SQLite for speed. Configuration in `backend/tests/conftest.py`.

## Writing Tests

Example test structure:
```python
def test_feature(client, db):
    # Arrange
    # Act
    # Assert
    pass
```

Fixtures available:
- `client` - TestClient instance
- `db` - Database session
- `test_user` - Authenticated user

## Troubleshooting

**Import errors:** Ensure virtual environment is activated  
**Database errors:** Check DATABASE_URL in test config  
**WebSocket errors:** Ensure Redis is running or mocked

