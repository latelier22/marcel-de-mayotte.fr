"use server"

async function myFetch(endpoint, method, body, entity) {
    const baseUrl = process.env.NEXTAUTH_URL;

    try {
        const response = await fetch(`${baseUrl}${endpoint}`,{cache: "no-store"} ,{ 
            headers: {
                'Content-Type': 'application/json',
            },
            method : method,
            body: body ? JSON.stringify(body) : null,
        });
  
        if (!response.ok) {
            throw new Error(`Failed to fetch ${entity}`);
        }
  
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`An error occurred while fetching ${entity}:`, error);
        throw new Error(`Failed to fetch ${entity}`);
    }
}

export default myFetch;
