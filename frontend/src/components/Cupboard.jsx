import { useEffect, useState } from 'react';
import { addToCupboard, deleteFromCupboard, getCupboard } from '../services/cupboard';
import { CATEGORY_NAMES } from '../constants';
import { Form, Row, Col, Button, Alert, Accordion } from 'react-bootstrap';
import { addIngredient, getIngredient } from '../services/ingredients';
import { Trash } from 'react-bootstrap-icons';

/**
 * Cupboard component for viewing and editing the user's cupboard.
 * 
 * @returns {JSX.Element} - An input, select and button to add ingredients to the
 * cupboard, and a grid of accordions to view and delete ingredients.
 */
export default function Cupboard() {
    const [cupboard, setCupboard] = useState({});
    const [error, setError] = useState("");
    const [newIngredient, setNewIngredient] = useState("");
    const [newIngCategory, setNewIngCategory] = useState(Object.keys(CATEGORY_NAMES)[0]);

    useEffect(() => {
        async function loadCupboard() {
            try {
                const data = await getCupboard();
                if (data.error) {
                    setError(`Error when loading cupboard: ${data.error}`);
                    return;
                }
                setCupboard(groupCupboardByCategories(data));
            } catch (err) {
                setError("Unexpected error, please try again later");
            }
        }

        loadCupboard();
    }, []);

    /**
     * Groups the ingredients in the cupboard by their categories to make
     * later rendering and processing simpler.
     * 
     * @param {Array} data - Array of ingredients in cupboard.
     * @returns 
     */
    function groupCupboardByCategories(data) {
        const groupedData = {};
        Object.keys(CATEGORY_NAMES).forEach(cat => groupedData[cat] = []);
        data.forEach(ing => {
            groupedData[ing.category].push({ "id": ing.id, "name": ing.name });
        });
        return groupedData;
    }

    /**
     * Handles the key down event on the input to add a new ingredient. If
     * the enter key is pressed, calls handleAddNewIngredient.
     * 
     * @param {Event} e - The key down event. 
     */
    function handleNewIngredientKeyDown(e) {
        if (e.key === 'Enter')
            handleAddNewIngredient();
    }

    /**
     * Handles the addition of a new ingredient to the cupboard. Validates the
     * ingredient and calls the API endpoint to find if the ingredient exists. If not,
     * the ingredient is added to the database and then added to the users cupboard.
     */
    async function handleAddNewIngredient() {
        if (newIngredient.trim() === "")
            return;
        
        // check if already in user's cupboard
        if (cupboard[newIngCategory].find(ing => ing.name.toLowerCase() === newIngredient.toLowerCase())) {
            setNewIngredient("");
            return;
        }
        
        let ingredientId;

        // check if this ingredient exists, if it does we grab the ID, otherwise create the ingredient
        try {
            const response = await getIngredient(newIngredient.trim());
            if (response.error && response.error !== "Ingredient not found") {
                setError(response.error);
                return;
            } else if (!response.error) {
                // attempt to find a matching ingredient in the same category
                response.forEach(ing => {
                    if (ing.category === newIngCategory)
                        ingredientId = ing.id;
                });
            }
        } catch (err) {
            setError("Unexpected error, please try again later");
            return;
        }

        if (!ingredientId) {
            // no existing ingredient so we need to add it to the db
            try {
                const response = await addIngredient(newIngredient.trim(), newIngCategory);
                if (response.error) {
                    setError(response.error);
                    return;
                }

                ingredientId = response.id;
            } catch (err) {
                setError("Unexpected error, please try again later");
                return;
            }
        }

        // add ingredient to user's cupboard
        try {
            const response = await addToCupboard(ingredientId);
            if (response.error) {
                setError(response.error);
                return;
            }

            // add to our cupboard object to avoid fetching all ingredients again
            setCupboard(prev => {
                const updated = {...prev};
                updated[newIngCategory].push({ "id": ingredientId, "name": newIngredient.trim()});
                return updated;
            });
            setNewIngredient("");
        } catch (err) {
            setError("Unexpected error, please try again later");
            return;
        }
    }

    /**
     * Handles the removal of an ingredient from the cupboard. Calls the API
     * endpoint to remove the given ingredient and updates the cupboard object.
     * 
     * @param {Integer} ingId - The ID of the ingredient to remove.
     * @param {String} category - The category of the ingredient to remove.
     * @returns 
     */
    async function handleRemoveIngredient(ingId, category) {
        try {
            const response = await deleteFromCupboard(ingId);
            if (response.error) {
                setError(response.error);
                return;
            }

            // remove from our cupboard object
            setCupboard(prev => {
                const updated = {...prev};
                updated[category] = updated[category].filter(ing => ing.id !== ingId);
                return updated;
            });
        } catch (err) {
            setError("Unexpected error, please try again later");
            return;
        }
    }

    return <div className='m-3'>
        <div className={`d-flex align-items-center ${error ? 'justify-content-between' : 'justify-content-end'}`}>
            {error && <Alert variant="danger" className='w-fit-content p-2 mt-2'>{error}</Alert>}
            <Form.Group className='w-fit-content'>
                <Row>
                    <Col sm="auto">
                        <Form.Label className='mt-2 fw-bold'>Add ingredient:</Form.Label>
                    </Col>
                    <Col sm="auto">
                        <Form.Control
                            type="text"
                            value={newIngredient}
                            placeholder='Type ingredient...'
                            onChange={(e) => setNewIngredient(e.target.value)}
                            onKeyDown={handleNewIngredientKeyDown}/>
                    </Col>
                    <Col sm="auto">
                        <Form.Select value={newIngCategory} onChange={(e) => setNewIngCategory(e.target.value)}>
                            {Object.entries(CATEGORY_NAMES).map(cat => (
                                <option key={cat[0]} value={cat[0]}>{cat[1]}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm="auto">
                        <Button variant="dark" className='mb-2' onClick={handleAddNewIngredient}>+</Button>
                    </Col>
                </Row>
            </Form.Group>            
        </div>
        <div className='cupboard-grid'>
            {Object.entries(cupboard).map(([cat, ings]) => (
                <Accordion defaultActiveKey={cat} key={`accordion-${cat}`}>
                    <Accordion.Item eventKey={cat}>
                        <Accordion.Header>{CATEGORY_NAMES[cat]}</Accordion.Header>
                        <Accordion.Body>
                            <ul>
                                {ings.map(ing => (
                                    <li key={`ing-${cat}-${ing.name}`} className='mb-2'>
                                        <Button size="sm" variant="outline-danger" className='me-2' onClick={() => handleRemoveIngredient(ing.id, cat)}>
                                            <Trash size={14} />
                                        </Button>
                                        {ing.name}
                                    </li>
                                ))}
                            </ul>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            ))}
        </div>
    </div>;
}