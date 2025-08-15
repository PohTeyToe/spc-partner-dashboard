from flask import Flask
from .health import bp as health_bp
from .auth import bp as auth_bp
from .deals import bp as deals_bp


def register_routes(app: Flask):
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(deals_bp, url_prefix="/deals")


