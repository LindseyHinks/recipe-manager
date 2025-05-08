import { apiFetch } from "./apiUtils";

export function loginUser(username, password) {
    return apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}

export function registerUser(username, password) {
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}