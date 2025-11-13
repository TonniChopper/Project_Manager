def test_health_ok(client):
    r = client.get("/api/v1/health/")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert "service" in data

