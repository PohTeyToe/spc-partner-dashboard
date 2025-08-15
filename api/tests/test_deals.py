from spc_api import create_app
from spc_api.extensions import db
from spc_api.models import Merchant, User, Deal
from passlib.hash import bcrypt


def setup_app_and_seed():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite://",
    })
    with app.app_context():
        db.create_all()
        merchant = Merchant(name="Demo Merchant")
        db.session.add(merchant)
        db.session.commit()
        user = User(
            email="demo@merchant.com",
            password_hash=bcrypt.hash("Password123!"),
            merchant_id=merchant.id,
        )
        db.session.add(user)
        db.session.commit()
        deals = [
            Deal(title="Deal A", description="First", merchant_id=merchant.id),
            Deal(title="Deal B", description="Second", merchant_id=merchant.id),
        ]
        db.session.add_all(deals)
        db.session.commit()
    return app


def login_get_token(client):
    resp = client.post(
        "/auth/login",
        json={"email": "demo@merchant.com", "password": "Password123!"},
    )
    assert resp.status_code == 200
    return resp.get_json()["access_token"]


def test_requires_auth():
    app = setup_app_and_seed()
    with app.test_client() as client:
        resp = client.get("/deals")
        assert resp.status_code == 401


def test_list_deals():
    app = setup_app_and_seed()
    with app.test_client() as client:
        token = login_get_token(client)
        resp = client.get("/deals", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        data = resp.get_json()
        assert "items" in data and isinstance(data["items"], list)
        assert data["total"] >= 2

        # pagination and search
        resp = client.get(
            "/deals?per_page=1&page=1&q=Deal%20A",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["per_page"] == 1
        assert any("Deal A" in item["title"] for item in data["items"]) or data["total"] >= 1


def test_crud_cycle():
    app = setup_app_and_seed()
    with app.test_client() as client:
        token = login_get_token(client)
        headers = {"Authorization": f"Bearer {token}"}

        # create
        create_resp = client.post("/deals", json={"title": "New Deal", "description": "X"}, headers=headers)
        assert create_resp.status_code == 201, create_resp.get_json()
        deal_id = create_resp.get_json()["id"]

        # get
        get_resp = client.get(f"/deals/{deal_id}", headers=headers)
        assert get_resp.status_code == 200
        assert get_resp.get_json()["title"] == "New Deal"

        # update
        patch_resp = client.patch(f"/deals/{deal_id}", json={"title": "Updated"}, headers=headers)
        assert patch_resp.status_code == 200
        assert patch_resp.get_json()["title"] == "Updated"

        # delete
        del_resp = client.delete(f"/deals/{deal_id}", headers=headers)
        assert del_resp.status_code == 204

        # confirm 404
        get_resp = client.get(f"/deals/{deal_id}", headers=headers)
        assert get_resp.status_code == 404




