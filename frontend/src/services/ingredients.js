import { apiFetch } from "./apiUtils";

export function getIngredient(name) {
    return apiFetch(`/ingredients/${name}`, {
        method: 'GET'
    });
}

export function addIngredient(name, category) {
    return apiFetch('/ingredients/', {
        method: 'POST',
        body: JSON.stringify({ name, category })
    });
}