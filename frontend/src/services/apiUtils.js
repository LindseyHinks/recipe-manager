const BASE_URL = "http://localhost:5000";

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

    if (!result.ok) {
        return {"error": data.error || "API error" };
    }

    return data;
}