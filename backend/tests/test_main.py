from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello"}

def test_about():
    response = client.get("/about")
    assert response.status_code == 200
    assert response.json() == {"message": "This is the about page."}

def test_add_msg():
    msg_name = "Test Message"
    response = client.post(f"/messages/{msg_name}/")
    assert response.status_code == 200
    assert "msg_id" in response.json()["message"]
    assert response.json()["message"]["msg_name"] == msg_name

def test_message_items():
    response = client.get("/messages")
    assert response.status_code == 200
    assert "messages:" in response.json()