import { apiFetch } from "./apiUtils";

export function getRecipes() {
    return apiFetch('/recipes/', {
        method: 'GET'
    });
}

export function createRecipe(data) {
    return apiFetch('/recipes/', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function editRecipe(id, data) {
    return apiFetch(`/recipes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

export function deleteRecipe(id) {
    return apiFetch(`/recipes/${id}`, {
        method: 'DELETE'
    });
}