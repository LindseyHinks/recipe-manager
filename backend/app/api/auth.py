from flask_jwt_extended import create_access_token
from flask import request, jsonify, Blueprint
from app.models import User
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username:
        return jsonify({"error": "Username is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username:
        return jsonify({"error": "Username is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"error": "User not found"}), 400
    
    if not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 400
    
    # generate JWT token and send to client
    # need to use str for identity, otherwise causes 422 error
    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token), 200