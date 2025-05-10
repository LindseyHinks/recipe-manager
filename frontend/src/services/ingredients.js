import { apiFetch } from "./apiUtils";

/**
 * Sends a get ingredient request to the backend API.
 * 
 * @returns {Promise} - The response from the API.
 */
export function getIngredient(name) {
    return apiFetch(`/ingredients/${name}`, {
        method: 'GET'
    });
}

/**
 * Sends a add ingredient request to the backend API.
 * 
 * @param {String} name - The name of the ingredient to add.
 * @param {String} category - The category of the ingredient to add.
 * @returns {Promise} - The response from the API.
 */
export function addIngredient(name, category) {
    return apiFetch('/ingredients/', {
        method: 'POST',
        body: JSON.stringify({ name, category })
    });
}