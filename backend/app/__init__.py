from flask import Flask
from .extensions import db, migrate, login_manager
from flask_jwt_extended import JWTManager
from .api.auth import auth_bp
from .api.cupboard import cupboard_bp
from .api.ingredients import ingredients_bp
from .api.recipes import recipes_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    # allow requests from react app
    CORS(app, origins=["http://localhost:5173"])

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    jwt = JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(cupboard_bp, url_prefix='/cupboard')
    app.register_blueprint(ingredients_bp, url_prefix='/ingredients')
    app.register_blueprint(recipes_bp, url_prefix='/recipes')

    return app