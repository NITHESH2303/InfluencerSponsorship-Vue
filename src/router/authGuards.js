import {fetchWithAuth} from "@/api.js";

export async function checkSponsorVerified(to, from, next) {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch("http://127.0.0.1:5000/api/sponsor/meta", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                Accept: 'application/json',
            }
        });
        console.log(response);
        if (response.ok) {
            const sponsorMeta = await response.json();
            console.log(sponsorMeta);
            if (sponsorMeta.data.is_approved) {
                next();
            } else {
                next({
                    name: "Unauthorized",
                    params: {message: "Sponsor is not approved to access this page."},
                });
            }
        } else {
            next({
                name: "Unauthorized",
                params: {message: "Failed to fetch sponsor meta details."},
            });
        }
    } catch (error) {
        next({
            name: "Unauthorized",
            params: { message: "An error occurred: " + error.message },
        });
    }
}