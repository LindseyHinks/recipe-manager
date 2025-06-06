import { useEffect, useState } from 'react';
import { deleteRecipe, getRecipes } from '../services/recipes';
import { Button, Alert, Card, Badge, Form, Row, Col } from 'react-bootstrap';
import AddRecipeModal from './AddRecipeModal';
import { getCupboard } from '../services/cupboard';
import RecipeModal from './RecipeModal';

/**
 * Allows the user to view their recipes, click on recipes for all details, edit, delete
 * and add them.
 * 
 * @returns {JSX.Element} - Button to add a recipe with recipe cards below.
 */
export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [cupboard, setCupboard] = useState([]);
    const [error, setError] = useState("");
    const [addRecipe, setAddRecipe] = useState(false);
    const [recipeToEdit, setRecipeToEdit] = useState(null);
    const [recipeToShow, setRecipeToShow] = useState(null);
    const [sortBy, setSortBy] = useState("title");
    const [sortedRecipes, setSortedRecipes] = useState([]);

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
                setCupboard(cupboardData);
            } catch (err) {
                setError("Unexpected error, please try again");
            }
        }

        loadRecipes();
    }, []);

    useEffect(() => {
        // sort alphabetically by title or the number of missing ingredients in the recipe
        const sorted = [...recipes].sort((a, b) => {
            if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === 'missing') {
                // get number of missing ingredients in each recipe
                const aCount = a.ingredients.reduce((acc, cur) => cur.missing ? ++acc : acc, 0);
                const bCount = b.ingredients.reduce((acc, cur) => cur.missing ? ++acc : acc, 0);
                return aCount - bCount;
            }
            return 0;
        });
        setSortedRecipes(sorted);
    }, [sortBy, recipes]);

    /**
     * Handles the deletion of the specific recipe. Calls the API
     * endpoint to delete it and updated the recipes object.
     * 
     * @param {Integer} id - The ID of the recipe to delete.
     * @returns 
     */
    async function handleDeleteRecipe(id) {
        try {
            const response = await deleteRecipe(id);
            if (response.error) {
                setError(response.error);
                return;
            }

            // remove from the recipes array
            setRecipes(prev => {
                const updated = [...prev];
                return updated.filter(recipe => recipe.id !== id);
            });
        } catch (err) {
            setError("Unexpected error, please try again later");
            return;
        }
    }

    return <div className='m-3'>
        <div className={`d-flex align-items-center ${error ? 'justify-content-between' : 'justify-content-end'}`}>
            {error && <Alert variant="danger" className='w-fit-content p-2 mt-2'>{error}</Alert>}
            <div className='d-flex mb-2'>
                <Form.Group as={Row}>
                    <Col sm="auto" className='mt-2 pe-0 fw-bold'>
                        Sort by:
                    </Col>
                    <Col sm="auto">
                        <Form.Select onChange={(e) => setSortBy(e.target.value)}>
                            <option value="title">Title</option>
                            <option value="missing">Missing Ingredients</option>
                        </Form.Select>
                    </Col>
                    <Col sm="auto">
                        <Button variant="dark" onClick={() => setAddRecipe(true)}>Add recipe</Button>                    
                    </Col>
                </Form.Group>
            </div>
        </div>
        <div className='row'>
            {sortedRecipes.map(recipe => (
                <div className='col-md-4 mb-4' key={recipe.id}>
                    <Card onClick={() => setRecipeToShow(recipe)} className='shadow-sm transition card-as-button'>
                        <Card.Img variant='top' src={'/recipe.png'} alt={recipe.title} className='w-50 align-self-center' />
                        <Card.Body>
                            <Card.Title>{recipe.title}</Card.Title>
                            {recipe.ingredients.some(ing => ing.missing)? (
                                <>
                                    <span className='text-danger fw-bold'>Missing:</span>
                                    {recipe.ingredients.map(ing => (
                                        ing.missing && <Badge bg="danger" key={`missing-${ing.id}`} className='ms-2'>{ing.name}</Badge>
                                    ))}
                                </>
                            ): (
                                <span className='text-success fw-bold'>You have all the ingredients!</span>
                            )}
                            <div className='d-flex justify-content-end mt-2'>
                                <Button size="sm" variant="outline-secondary" onClick={(e) => {e.stopPropagation(); setRecipeToEdit(recipe)}}>Edit</Button>
                                <Button size="sm" variant="outline-danger" className='ms-2' onClick={(e) => {e.stopPropagation(); handleDeleteRecipe(recipe.id)}}>Delete</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            ))}
        </div>
        {recipeToShow && <RecipeModal onHide={() => setRecipeToShow(null)} recipe={recipeToShow} />}
        {addRecipe && <AddRecipeModal onHide={() => setAddRecipe(false)} setRecipes={setRecipes} cupboard={cupboard} />}
        {recipeToEdit && <AddRecipeModal onHide={() => {setRecipeToEdit(null)}} setRecipes={setRecipes} cupboard={cupboard} data={recipeToEdit} />}
    </div>;
}