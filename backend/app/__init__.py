from flask import Flask
from .extensions import db, migrate, login_manager
from flask_jwt_extended import JWTManager
from .api.auth import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    jwt = JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app