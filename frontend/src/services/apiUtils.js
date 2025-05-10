const BASE_URL = "http://localhost:5000";

/**
 * Wrapper around the Fetch API for requests to the backend.
 * 
 * @param {String} path - The endpoint path to call relative to BASE_URL.
 * @param {Object} options - Optional fetch options e.f. method, headers or body.
 * @returns 
 */
export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const result = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers
    });

    const data = await result.json();

    // if the JWT token is expired, remove it and redirect to login
    if (result.status === 401 || result.status === 422) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    if (!result.ok) {
        return {"error": data.error || "API error" };
    }

    return data;
}