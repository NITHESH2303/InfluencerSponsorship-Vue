import {fetchWithAuth} from "@/api.js";

export async function checkSponsorVerified(to, from, next) {
    try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/sponsor/meta", {
            method: 'GET',
        });
        if (response.ok) {
            const sponsorMeta = await response.json();
            if (sponsorMeta.data.verification_status === 2) {
                to.params.sponsorMeta = sponsorMeta.data;
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

export async function getInfluencerMeta(to, from, next) {
    try {
        const response = await fetchWithAuth("http://127.0.0.1:5000/api/influencer/meta", {
            method: 'GET',
        });
        if (response.ok) {
            const influencerMeta = await response.json();
            to.params.influencerMeta = influencerMeta.data;
            next();
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