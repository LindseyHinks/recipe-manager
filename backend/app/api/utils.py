from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError
from app import db

def safe_commit():
    """
    Attempt to commit to the current DB session, rollback on failure.

    Returns:
        - (response, status code) tuple on failure, otherwise (None, None)
    """
    try:
        db.session.commit()
        return None, None
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database commit failed", "details": str(e)}), 500