from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app.enums import CategoryEnum

class RecipeIngredient(db.Model):
    """
    Association model between recipes and ingredients.

    Attributes:
        - id (int): Primary key.
        - recipe_id (int): Foreign key referencing the associated recipe.
        - ingredient_id (int): Foreign key referencing the associated ingredient.
    """
    __tablename__ = 'recipe_ingredients'
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.id'), nullable=False)

class UserIngredient(db.Model):
    """
    Association model between users and their cupboard ingredients.

    Attributes:
        - id (int): Primary key.
        - user_id (int): Foreign key referencing the associated user.
        - ingredient_id (int): Foreign key referencing the associated ingredient.
    """
    __tablename__ = 'user_ingredients'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.id'), nullable=False)

class User(UserMixin, db.Model):
    """
    User model for authentication and their cupboard and recipe data.

    Attributes:
        - id (int): Primary key.
        - username (str): Unique username of the user.
        - password_hash (str): Hashed password for authentication.
        - recipes (Relationship[Recipe]): Recipes created by the user.
        - cupboard (Relationship[UserIngredient]): Ingredients in the user's cupboard.
    """
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    recipes = db.relationship('Recipe', backref='owner', lazy=True)
    cupboard = db.relationship('UserIngredient', backref='user', lazy=True)

    def set_password(self, password: str):
        """
        Generates and sets password hash for the given password.

        Parameters:
            - password (str): The password to set.
        """
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password: str):
        """
        Checks the given password against the user's password hash.

        Parameters:
            - password (str): The password to check.
        """
        return check_password_hash(self.password_hash, password)
    
class Ingredient(db.Model):
    """"
    Ingredient model.

    Attributes:
        - id (int): Primary key.
        - name (str): Name of the ingredient.
        - category (Enum(CategoryEnum)): Category the ingredient belongs to.
    """
    __tablename__ = 'ingredients'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.Enum(CategoryEnum), nullable=False)

class Recipe(db.Model):
    """
    Recipe model.

    Parameters:
        - id (int): Primary key.
        - title (str): Title of the recipe.
        - method (Text): Step-by-step instructions for the recipe (nullable).
        - user_id (int): Foreign key referencing the user who created it.
        - ingredients (Relationship[RecipeIngredient]): List of ingredients in the recipe.
    """
    __tablename__ = 'recipes'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    method = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # cascade to delete recipe ingredients when their recipes are deleted
    ingredients = db.relationship('RecipeIngredient', backref='recipe', lazy=True, cascade="all, delete-orphan")