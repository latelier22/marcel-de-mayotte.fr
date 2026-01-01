"use server";

async function myFetch(endpoint, method, body, entity) {
    const baseUrl = process.env.STRAPI_PUBLIC_URL;

    const headers = {};

    // Adjust headers and body for FormData
    if (body instanceof FormData) {
       
    } else {
        headers['Content-Type'] = 'application/json';
        body = body ? JSON.stringify(body) : null;
    }

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: method,
            headers,
            body,
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${entity}: Status ${response.status}`);
        }

        const data = await response.json();
       
        return data;
    } catch (error) {
        console.error(`An error occurred while fetching ${entity}:`, error);
        throw error; // It's usually good practice to handle or throw errors for the caller to decide what to do
    }
}

export default myFetch;