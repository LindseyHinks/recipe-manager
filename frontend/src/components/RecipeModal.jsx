import { Modal } from 'react-bootstrap';

export default function RecipeModal({ onHide, recipe }) {

    return <Modal show={true} onHide={onHide} size="lg" centered >
        <Modal.Header closeButton>
            <Modal.Title>{recipe.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {recipe.method && (
                <>
                    <h5>Method</h5>
                    {recipe.method.split('\n').map((line, i) => (
                        <div key={i}>
                            <span>{line}</span><br />
                        </div>
                    ))}
                </>
            )}
            <h5 className={recipe.method && "mt-3"}>Ingredients</h5>
            {recipe.ingredients.some(ing => !ing.missing) && (
                <>
                    <h6 className="text-success">Ingredients in your cupboard:</h6>
                    <ul>
                        {recipe.ingredients.map(ing => (
                            !ing.missing && <li key={`recipe-ing-${ing.id}`} className="text-success">{ing.name}</li>
                        ))}
                    </ul>
                </>
            )}
            {recipe.ingredients.some(ing => ing.missing) && (
                <>
                    <h6 className="text-danger">Ingredients missing from your cupboard:</h6>
                    <ul>
                        {recipe.ingredients.map(ing => (
                            ing.missing && <li key={`recipe-ing-${ing.id}`} className="text-danger">{ing.name}</li>
                        ))}
                    </ul>
                </>
            )}
        </Modal.Body>
    </Modal>;
}