import myFetch from './myFech';

async function fetchPosts() {
    const response = await myFetch('/api/posts?populate=*', 'GET', null, 'posts');
    const strapiPosts = response.data;

    const posts = strapiPosts.map(post => ({
        id: post.id,
        ...post.attributes,
        comments: post.attributes.comments ? post.attributes.comments.data.map(comment => ({
            id: comment.id,
            ...comment.attributes
        })) : []
    }));

    console.log('fetch posts', posts.slice(0, 2));
    return posts;
}

export default fetchPosts;
