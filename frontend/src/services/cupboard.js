import { apiFetch } from "./apiUtils";

/**
 * Sends a get cupboard request to the backend API.
 * 
 * @returns {Promise} - The response from the API.
 */
export function getCupboard() {
    return apiFetch('/cupboard/', {
        method: 'GET'
    });
}

/**
 * Sends a add to cupboard request to the backend API.
 * 
 * @param {Integer} id - The ID of the ingredient to add.
 * @returns {Promise} - The response from the API.
 */
export function addToCupboard(id) {
    return apiFetch('/cupboard/', {
        method: 'POST',
        body: JSON.stringify({ id })
    });
}

/**
 * Sends a delete from cupboard request to the backend API.
 * 
 * @param {Integer} id - The ID of the ingredient to delete.
 * @returns {Promise} - The response from the API.
 */
export function deleteFromCupboard(id) {
    return apiFetch(`/cupboard/${id}`, {
        method: 'DELETE'
    });
}