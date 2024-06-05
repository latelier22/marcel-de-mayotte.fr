import myFetch from './myFetch';

async function fetchPostBySlug(slug) {
    const endpoint = `/api/posts/?filters[slug][$eq]=${slug}&populate=*`;
    try {
        const response = await myFetch(endpoint, 'GET');
        const strapiData = response.data;

        if (strapiData.length === 0) {
            // Return an empty array if no post is found
            return [];
        }

        const post = strapiData[0];

        const formattedPost = {
            id: post.id,
            slug: post.attributes.slug,
        };

        console.log('fetched post', formattedPost);
        return [formattedPost];
    } catch (error) {
        // Log the error and return an empty array
        console.error('Error fetching post by slug:', error);
        return [];
    }
}

export default fetchPostBySlug;
