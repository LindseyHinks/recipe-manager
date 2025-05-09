from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Ingredient, UserIngredient
from app import db

cupboard_bp = Blueprint('cupboard', __name__)

@cupboard_bp.route('/', methods=['GET'])
@jwt_required()
def get_cupboard():
    user_id = int(get_jwt_identity())
    user_ingredients = (
        db.session.query(Ingredient)
        .join(UserIngredient, Ingredient.id == UserIngredient.ingredient_id)
        .filter(UserIngredient.user_id == user_id)
        .all()
    )
    
    return jsonify([
        { "id": ing.id, "name": ing.name, "category": ing.category.name }
        for ing in user_ingredients
    ]), 200

@cupboard_bp.route('/', methods=['POST'])
@jwt_required()
def add_to_cupboard():
    data = request.get_json()
    ing_id = data.get('id')

    if not ing_id:
        return jsonify({"error": "Ingredient ID is required"}), 400
    
    user_id = int(get_jwt_identity())

    existing = UserIngredient.query.filter_by(user_id=user_id, ingredient_id=ing_id).first()
    if existing:
        return jsonify({"message": "Ingredient already in cupboard"}), 200
    
    user_ing = UserIngredient(user_id=user_id, ingredient_id=ing_id)
    db.session.add(user_ing)
    db.session.commit()

    return jsonify({"message": "Ingredient added to cupboard"}), 201

@cupboard_bp.route('/<int:ingredient_id>', methods=['DELETE'])
@jwt_required()
def delete_from_cupboard(ingredient_id):
    user_id = int(get_jwt_identity())
    user_ing = UserIngredient.query.filter_by(user_id=user_id, ingredient_id=ingredient_id).first()

    if not user_ing:
        return jsonify({"error" :"Ingredient not found in cupboard"}), 404
    
    db.session.delete(user_ing)
    db.session.commit()

    return jsonify({"message": "Ingredient deleted from cupboard"}), 200