"use server";

async function myFetch(endpoint, method, body, entity) {
    const baseUrl = process.env.STRAPI_PUBLIC_URL;

    console.log("endpoint, method, body, entity", endpoint, method, body, entity);

    const headers = {};

    // Adjust headers and body for FormData
    if (body instanceof FormData) {
        // For FormData, browser automatically sets the Content-Type to 'multipart/form-data'
        // with the boundary, so we don't manually set 'Content-Type' here.
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