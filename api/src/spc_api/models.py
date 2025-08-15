from datetime import datetime
from .extensions import db


class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )


class Merchant(db.Model, TimestampMixin):
    __tablename__ = "merchants"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    deals = db.relationship("Deal", backref="merchant", lazy=True)


class User(db.Model, TimestampMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    merchant_id = db.Column(db.Integer, db.ForeignKey("merchants.id"), nullable=True)
    merchant = db.relationship("Merchant", backref="users")


class Deal(db.Model, TimestampMixin):
    __tablename__ = "deals"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    merchant_id = db.Column(db.Integer, db.ForeignKey("merchants.id"), nullable=False)

