import React, { useEffect, useState } from 'react';
import { CATEGORY_NAMES } from '../constants';
import { Modal, Alert, Form, Button, Col, Row } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { addIngredient, getIngredient } from '../services/ingredients';
import { createRecipe } from '../services/recipes';

export default function AddRecipeModal({ onHide, setRecipes }) {
    const [title, setTitle] = useState("");
    const [method, setMethod] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [ingredientName, setIngredientName] = useState("");
    const [ingredientCategory, setIngredientCategory] = useState(Object.keys(CATEGORY_NAMES)[0]);
    const [error, setError] = useState("");

    function handleIngredientInput(e) {
        setIngredientName(e.target.value);
        setError("");
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter')
            handleAddIngredient();
    }

    function handleAddIngredient() {
        if (ingredientName.trim() === "")
            return;

        if (ingredients.find(ing => ing.name === ingredientName && ing.category === ingredientCategory)) {
            setError("Ingredient already added");
            setIngredientName("");
            return;
        }

        setIngredients(prev => {
            const updated = [...prev];
            updated.push({ "name": ingredientName, "category": ingredientCategory });
            return updated;
        });

        setIngredientName("");
        setIngredientCategory(Object.keys(CATEGORY_NAMES)[0]);
    }

    function handleRemoveIngredient(name, category) {
        setIngredients(prev => {
            const updated = [...prev];
            return updated.filter(ing => !(ing.name === name && ing.category === category));
        });
    }

    async function handleAddRecipe() {
        if (title.trim() === "") {
            setError("Please add a title");
            return;
        }
        if (ingredients.length === 0) {
            setError("Please add at least one ingredient");
            return;
        }

        // first need to add any ingredients that don't exist to the database
        const ingredientsToSend = [];
        const fullIngredients = [];
        for (const ing of ingredients) {
            try {
                const response = await getIngredient(ing.name.trim());
                if (response.error && response.error !== "Ingredient not found") {
                    setError(response.error);
                    return;
                } else if (!response.error) {
                    response.forEach(foundIng => {
                        if (foundIng.category === ing.category) {
                            ingredientsToSend.push(foundIng.id);
                            fullIngredients.push({
                                "id": foundIng.id,
                                "name": foundIng.name,
                                "category": foundIng.category
                            });
                        }
                    });
                } else {
                    // need to add the ingredient to the database
                    const result = await addIngredient(ing.name.trim(), ing.category);
                    if (result.error) {
                        setError(response.error);
                        return;
                    }
                    ingredientsToSend.push(result.id);
                    fullIngredients.push({
                        "id": result.id,
                        "name": ing.name.trim(),
                        "category": ing.category
                    });
                }
            } catch (err) {
                setError("Unexpected error, please try again later");
                return;
            }
        }

        try {
            const response = await createRecipe({
                "title": title.trim(),
                "method": method,
                "ingredient_ids": ingredientsToSend
            });
            if (response.error) {
                setError(response.error);
                return;
            }
            setRecipes(prev => {
                const updated = [...prev];
                return updated.push({
                    "id": response.id,
                    "title": title.trim(),
                    "method": method,
                    "ingredients": fullIngredients
                });
            });
        } catch (err) {
            setError("Unexpected error, please try again later");
            return;
        }

        onHide();
    }

    return <Modal show={true} centered onHide={onHide} size="lg" keyboard={false} backdrop="static">
        <Modal.Header closeButton>
            <Modal.Title>Add Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className='mb-3'>
                    <Form.Label>Title</Form.Label>
                    <Form.Control value={title} placeholder='Type title...' onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Method</Form.Label>
                    <Form.Control as="textarea" placeholder='Type method...' rows={6} value={method} onChange={(e) => setMethod(e.target.value)} />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Ingredients</Form.Label>
                    {ingredients.map(ing => (
                        <Row key={`${ing.name}-${ing.category}`}>
                            <Col sm="auto">
                                <Form.Control value={ing.name} disabled />
                            </Col>
                            <Col sm="auto">
                                <Form.Select disabled>
                                    <option>{CATEGORY_NAMES[ing.category]}</option>
                                </Form.Select>
                            </Col>
                            <Col sm="auto">
                                <Button variant="outline-danger" className='mb-2' onClick={() => handleRemoveIngredient(ing.name, ing.category)}><Trash /></Button>                        
                            </Col>
                        </Row>
                    ))}
                    <Row>
                        <Col sm="auto">
                            <Form.Control value={ingredientName} placeholder='Type ingredient...' onChange={handleIngredientInput} onKeyDown={handleKeyDown} />
                        </Col>
                        <Col sm="auto">
                            <Form.Select value={ingredientCategory} onChange={(e) => setIngredientCategory(e.target.value)}>
                                {Object.entries(CATEGORY_NAMES).map(cat => (
                                    <option key={cat[0]} value={cat[0]}>{cat[1]}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col sm="auto">
                            <Button variant="dark" className='mb-2' onClick={handleAddIngredient}>+</Button>                        
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
            {error && <Alert variant="danger" className='w-fit-content'>{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Cancel</Button>
            <Button variant="dark" onClick={handleAddRecipe}>Add</Button>
        </Modal.Footer>
    </Modal>;
}