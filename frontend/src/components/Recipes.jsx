import React, { useEffect, useState } from 'react';
import { getRecipes } from '../services/recipes';
import { Button, Alert, Card, Badge } from 'react-bootstrap';
import AddRecipeModal from './AddRecipeModal';
import { getCupboard } from '../services/cupboard';

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState("");
    const [addRecipe, setAddRecipe] = useState(false);

    useEffect(() => {
        async function loadRecipes() {
            try {
                const recipeData = await getRecipes();
                if (recipeData.error) {
                    setError(`Error when loading recipes: ${recipeData.error}`);
                    return;
                }
                
                // need to get cupboard data to see which ingredients the user is missing
                const cupboardData = await getCupboard();
                if (cupboardData.error) {
                    setError(`Error when loading cupboard: ${cupboardData.error}`);
                    return;
                }

                // calculate which ingredients the user is missing by adding a 'missing' boolean
                // to the ingredients list of each recipe
                setRecipes(recipeData.map(recipe => {
                    const ings = [];
                    recipe.ingredients.forEach(ing => {
                        const missing = !cupboardData.find(i => i.id === ing.id);
                        ings.push({
                            ...ing,
                            "missing": missing
                        });
                    });
                    return { ...recipe, ingredients: ings};
                }));
            } catch (err) {
                setError("Unexpected error, please try again");
            }
        }

        loadRecipes();
    }, []);

    return <div className='m-3'>
        <div className={`d-flex align-items-center ${error ? 'justify-content-between' : 'justify-content-end'}`}>
            {error && <Alert variant="danger" className='w-fit-content p-2 mt-2'>{error}</Alert>}
            <Button variant="dark" className='mb-2' onClick={() => setAddRecipe(true)}>Add recipe</Button>
        </div>
        <div className='row'>
            {recipes.map(recipe => (
                <div className='col-md-4 mb-4' key={recipe.id}>
                    <Card onClick={console.log("click")}>
                        <Card.Img variant='top' src={'/recipe.png'} alt={recipe.title} className='w-50 align-self-center' />
                        <Card.Body>
                            <Card.Title>{recipe.title}</Card.Title>
                            {recipe.ingredients.some(ing => ing.missing)? (
                                <>
                                    <span className='text-danger fw-bold me-2'>Missing:</span>
                                    {recipe.ingredients.map(ing => (
                                        ing.missing && <Badge bg="danger" key={`missing-${ing.id}`}>{ing.name}</Badge>
                                    ))}
                                    <div className='d-flex justify-content-end mt-2'>
                                        <Button size="sm" variant="outline-secondary">Edit</Button>
                                        <Button size="sm" variant="outline-danger" className='ms-2'>Delete</Button>
                                    </div>
                                </>
                            ): (
                                <span className='text-success fw-bold'>You have all the ingredients!</span>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            ))}
        </div>
        {addRecipe && <AddRecipeModal onHide={() => setAddRecipe(false)} setRecipes={setRecipes} />}
    </div>;
}