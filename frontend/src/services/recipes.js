import { apiFetch } from "./apiUtils";

/**
 * Sends a get recipes request to the backend API.
 * 
 * @returns {Promise} - The response from the API.
 */
export function getRecipes() {
    return apiFetch('/recipes/', {
        method: 'GET'
    });
}

/**
 * Sends a add recipe request to the backend API.
 * 
 * @param {String} data - The details of the recipe to add.
 * @returns {Promise} - The response from the API.
 */
export function createRecipe(data) {
    return apiFetch('/recipes/', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * Sends a edit recipe request to the backend API.
 * 
 * @param {Integer} id - The ID of the recipe to edit.
 * @param {String} data - The details of the recipe to edit.
 * @returns {Promise} - The response from the API.
 */
export function editRecipe(id, data) {
    return apiFetch(`/recipes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * Sends a delete recipe request to the backend API.
 * 
 * @param {Integer} id - The ID of the recipe to delete.
 * @returns {Promise} - The response from the API.
 */
export function deleteRecipe(id) {
    return apiFetch(`/recipes/${id}`, {
        method: 'DELETE'
    });
}