export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('access_token');
    const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        Accept: 'application/json',
    };

    const fetchOptions = {
        ...options,
        headers,
        credentials: "include",
    };

    let response = await fetch(url, fetchOptions);

    if (response.status === 401) {
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
            options.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
            response = await fetch(url, options);
        } else {
            window.location.href = '/login';
        }
    }
    return response;
}

async function refreshAccessToken() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/auth/token-refresh", {
            method: "PATCH",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.data.access_token);
            return true;
        }
    } catch (error) {
        console.error("Token refresh failed", error);
    }
    return false;
}
