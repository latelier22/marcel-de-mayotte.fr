import myFetch from "./myFech";


async function fetchPosts () {

    const response = await myFetch("/api/posts", 'GET', null, 'posts');


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


