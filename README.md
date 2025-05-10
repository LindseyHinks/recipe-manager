
# Recipe Manager
A full-stack web application built with Flask and React that allows users to manage their recipes and kitchen cupboard. Users can register, log in, create recipes, assign ingredients, and track what items they have available by maintaining a cupboard of ingredients.

## Setup Instructions

### Backend
1. **Navigate to the flask app** by running `cd backend` in the project directory.
2. **Create a virtual environment** by running `python3 -m venv venv` and activate by running `source venv/bin/activate`.
3. **Install dependencies** by running `pip install -r requirements.txt`.
4. **Add a .env file** in `/backend` with the following variables:
- `SECRET_KEY=<your_secret>`
- `DATABASE_URL=sqlite:///app.db`
- `JWT_SECRET_KEY=<your_jwt_secret>`
5. **Initialise the database** by running `flask db init`, `flask db migrate -m "Initial migration"`, and`flask db upgrade`
6. **Run the app** with `python3 run.py` or `flask run` - the app should be accessible, by default, at http://localhost:5000.

### Frontend
1. Navigate to the react app** by running `cd frontend`.
2. Install dependencies by running `npm install`.
3. Start the development server by running `npm run dev` - the app should be accessible, by default, at http://localhost:5173.