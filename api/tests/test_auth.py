from spc_api import create_app
from spc_api.extensions import db
from passlib.hash import bcrypt
from spc_api.models import Merchant, User


def setup_app_and_seed():
    app = create_app(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite://",
            "WTF_CSRF_ENABLED": False,
        }
    )
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
    return app


def test_login_ok():
    app = setup_app_and_seed()
    with app.test_client() as client:
        resp = client.post(
            "/auth/login",
            json={"email": "demo@merchant.com", "password": "Password123!"},
        )
        assert resp.status_code == 200, resp.get_json()
        data = resp.get_json()
        assert "access_token" in data
