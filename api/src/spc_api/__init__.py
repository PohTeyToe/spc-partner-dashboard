from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors, ma
from .routes import register_routes


def register_cli(app: Flask):
    @app.cli.command("seed")
    def seed():
        """
        Seed the database with a demo merchant and user.

        Demo credentials:
          email: demo@merchant.com
          password: Password123!
        """
        from .models import Merchant, User
        from passlib.hash import bcrypt

        # Ensure a merchant exists
        merchant = db.session.scalar(db.select(Merchant).filter_by(name="Demo Merchant"))
        if not merchant:
            merchant = Merchant(name="Demo Merchant")
            db.session.add(merchant)
            db.session.commit()

        # Ensure demo user exists
        email = "demo@merchant.com"
        user = db.session.scalar(db.select(User).filter_by(email=email))
        if not user:
            user = User(
                email=email,
                password_hash=bcrypt.hash("Password123!"),
                merchant_id=merchant.id,
            )
            db.session.add(user)
            db.session.commit()

        # Seed demo deals if none exist for this merchant
        from .models import Deal
        existing_count = db.session.query(Deal).filter_by(merchant_id=merchant.id).count()
        if existing_count == 0:
            deals_to_create = [
                {
                    "title": "10% off at checkout",
                    "description": "Apply at checkout to receive 10% discount.",
                },
                {
                    "title": "BOGO on accessories",
                    "description": "Buy one accessory, get one free.",
                },
                {
                    "title": "Free shipping over $50",
                    "description": "Orders over $50 qualify for free shipping.",
                },
            ]
            # Our model does not have active/starts_at/ends_at; adapt by creating basic records
            for payload in deals_to_create:
                d = Deal(
                    title=payload["title"],
                    description=payload.get("description"),
                    merchant_id=merchant.id,
                )
                db.session.add(d)
            db.session.commit()

        print("Seed complete: demo@merchant.com / Password123!")


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config())

    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    cors.init_app(app)

    register_routes(app)
    register_cli(app)

    return app

