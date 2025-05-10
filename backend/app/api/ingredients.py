from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required
from app.models import Ingredient
from app import db
from app.enums import CategoryEnum

ingredients_bp = Blueprint('ingredients', __name__)

@ingredients_bp.route('/<string:name>', methods=['GET'])
@jwt_required()
def get_ingredient(name: str):      
    """
    Retrieve ingredients that match the name given (case-insensitive).

    Parameters:
        - name (str): The name of the ingredient to retrieve.

    Returns:
        - 200 with a list of matching ingredients if matches found.
        - 404 if no matches are found.
    """  
    # case insensitive search
    ings = Ingredient.query.filter(Ingredient.name.ilike(name)).all()

    if len(ings) == 0:
        return jsonify({"error": "Ingredient not found"}), 404
    
    return jsonify([
        {"id": ing.id, "name": ing.name, "category": ing.category.name }
        for ing in ings
    ]), 200

@ingredients_bp.route('/', methods=['POST'])
@jwt_required()
def add_ingredient():
    """
    Add a new ingredient to the database.

    Returns:
        - 201 with ingredient ID if created successfully.
        - 200 if ingredient already exists.
        - 400 if the name or category are missing or invalid.
    """
    data = request.get_json()
    name = data.get('name')
    category = data.get('category')

    if not name:
        return jsonify({"error": "Name is required"}), 400
    if not category:
        return jsonify({"error": "Category is required"}), 400
    if category not in CategoryEnum.__members__:
        return jsonify({"error": "Invalid category"}), 400
    
    existing = Ingredient.query.filter(Ingredient.name.ilike(name), Ingredient.category == category).first()
    if existing:
        return jsonify({"id": existing.id, "message": "Ingredient already exists"}), 200
    
    ing = Ingredient(name=name, category=category)
    db.session.add(ing)
    db.session.commit()

    return jsonify({"id": ing.id, "message": "Ingredient successfully created"}), 201