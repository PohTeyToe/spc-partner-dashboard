from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from passlib.hash import bcrypt
from ..extensions import db
from ..models import User

bp = Blueprint("auth", __name__)


@bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"message": "email and password required"}), 400

    if db.session.scalar(db.select(User).filter_by(email=email)):
        return jsonify({"message": "email already registered"}), 409

    user = User(email=email, password_hash=bcrypt.hash(password))
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "registered"}), 201


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"message": "email and password required"}), 400

    user = db.session.scalar(db.select(User).filter_by(email=email))
    if not user or not bcrypt.verify(password, user.password_hash):
        return jsonify({"message": "invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token})
