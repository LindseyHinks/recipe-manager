import { apiFetch } from "./apiUtils";

/**
 * Sends a login request to the backend API.
 * 
 * @param {String} username - The username to log in with.
 * @param {String} password - The password to log in with.
 * @returns {Promise} - The response from the API.
 */
export function loginUser(username, password) {
    return apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}

/**
 * Sends a register request to the backend API.
 * 
 * @param {String} username - The username to register with.
 * @param {String} password - The password to register with.
 * @returns {Promise} - The response from the API.
 */
export function registerUser(username, password) {
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}