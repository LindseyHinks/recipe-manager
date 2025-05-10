from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Recipe, RecipeIngredient, Ingredient
from app import db
from sqlalchemy.orm import joinedload

recipes_bp = Blueprint('recipes', __name__)

@recipes_bp.route('/', methods=['GET'])
@jwt_required()
def get_recipes():
    user_id = get_jwt_identity()
    recipes = db.session.query(Recipe).filter_by(user_id=user_id).all()

    # once we have the recipes we can find all the details about the recipe ingredients
    recipe_ids = [recipe.id for recipe in recipes]
    ingredients = (
        db.session.query(RecipeIngredient.recipe_id, Ingredient.id, Ingredient.name, Ingredient.category)
        .join(Ingredient, RecipeIngredient.ingredient_id == Ingredient.id)
        .filter(RecipeIngredient.recipe_id.in_(recipe_ids))
        .all()
    )

    # format the recipe ingredients
    ingredient_map = {}
    for recipe_id, ing_id, ing_name, ing_category in ingredients:
        ingredient_map.setdefault(recipe_id, []).append({
            "id": ing_id,
            "name": ing_name,
            "category": ing_category.name
        })
    
    results = [{
        "id": recipe.id,
        "title": recipe.title,
        "method": recipe.method,
        "ingredients": ingredient_map.get(recipe.id, [])
    } for recipe in recipes]
    
    return jsonify(results), 200

@recipes_bp.route('/', methods=['POST'])
@jwt_required()
def create_recipe():
    data = request.get_json()
    title = data.get('title')
    method = data.get('method')
    ingredient_ids = data.get('ingredient_ids')

    if not title:
        return jsonify({"error": "Title is required"}), 400
    if not ingredient_ids:
        return jsonify({"error": "A list of ingredient IDs are required"}), 400
    for ing_id in ingredient_ids:
        if not Ingredient.query.filter_by(id=ing_id).first():
            return jsonify({"error": f"Ingredient with id {ing_id} doesn't exist"}), 400
    
    # create recipe
    user_id = get_jwt_identity()
    recipe = Recipe(title=title, method=method, user_id=user_id)
    db.session.add(recipe)
    db.session.flush() # so we can get the recipe ID before committing

    # add each ingredient
    for ing_id in ingredient_ids:
        db.session.add(RecipeIngredient(recipe_id=recipe.id, ingredient_id=ing_id))
    db.session.commit()

    return jsonify({"id": recipe.id, "message": "Recipe created successfully"}), 201

@recipes_bp.route('/<int:recipe_id>', methods=['PUT'])
@jwt_required()
def update_recipe(recipe_id):
    user_id = get_jwt_identity()
    recipe = Recipe.query.filter_by(id=recipe_id, user_id=user_id).first()

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    
    data = request.get_json()
    recipe.title = data.get('title', recipe.title)
    recipe.method = data.get('method', recipe.method)
    
    # if new ingredients were provided, check they all exist and update
    ingredient_ids = data.get('ingredient_ids')
    if ingredient_ids:
        for ing_id in ingredient_ids:
            if not Ingredient.query.filter_by(id=ing_id).first():
                return jsonify({"error": f"Ingredient with id {ing_id} doesn't exist"}), 400
        # remove the old ingredients
        RecipeIngredient.query.filter_by(recipe_id=recipe.id).delete()
        # add the new ingredients
        for ing_id in ingredient_ids:
            db.session.add(RecipeIngredient(recipe_id=recipe.id, ingredient_id=ing_id))
    
    db.session.commit()

    return jsonify({"message": "Recipe updated"}), 200

@recipes_bp.route('/<int:recipe_id>', methods=['DELETE'])
@jwt_required()
def delete_recipe(recipe_id):
    user_id = get_jwt_identity()
    recipe = Recipe.query.filter_by(id=recipe_id, user_id=user_id).first()

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    db.session.delete(recipe)
    db.session.commit()
    
    return jsonify({"message": "Recipe deleted"}), 200