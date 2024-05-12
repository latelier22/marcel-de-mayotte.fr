"use server"

async function myFetch(endpoint, method, body, entity) {
    const baseUrl = process.env.STRAPI_PUBLIC_URL;
    
    console.log("endpoint, method, body, entity", endpoint, method, body, entity);

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
            cache: "no-store"
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch ${entity}: Status ${response.status}`);
        }
  
        const data = await response.json();
        console.log("data", data);
        return data;
    } catch (error) {
        console.error(`An error occurred while fetching ${entity}:`, error);
        throw error; // You might want to throw the actual error back to the caller
    }
}


export default myFetch;


