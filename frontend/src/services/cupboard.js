import { apiFetch } from "./apiUtils";

export function getCupboard() {
    return apiFetch('/cupboard/', {
        method: 'GET'
    });
}

export function addToCupboard(id) {
    return apiFetch('/cupboard/', {
        method: 'POST',
        body: JSON.stringify({ id })
    });
}

export function deleteFromCupboard(id) {
    return apiFetch(`/cupboard/${id}`, {
        method: 'DELETE'
    });
}