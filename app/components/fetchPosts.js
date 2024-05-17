import myFetch from "./myFech";


async function fetchPosts () {

    const response = await myFetch("/api/posts?populate=*", 'GET', null, 'posts');
    // const response = await myFetch('/api/posts?populate=*');

        const strapiPosts = response.data
        console.log(strapiPosts);

        const posts = strapiPosts.map(post => ({
            id: post.id,
            ...post.attributes
        }));
        
        console.log(posts);

    return posts

}

export default fetchPosts;


