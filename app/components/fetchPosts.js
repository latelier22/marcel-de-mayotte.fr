import myFetch from './myFech';

async function fetchPosts() {
    const response = await myFetch('/api/posts?populate=*', 'GET', null, 'posts');
    const strapiPosts = response.data;

    const posts = strapiPosts.map(post => ({
        id: post.id,
        title: post.attributes.title,
        content: post.attributes.content,
        auteur: post.attributes.auteur,
        etat: post.attributes.etat,
        createdAt: post.attributes.createdAt,
        updatedAt: post.attributes.updatedAt,
        publishedAt: post.attributes.publishedAt,
        comments: post.attributes.comments ? post.attributes.comments.data.map(comment => comment.id) : []
    }));

    console.log('fetch posts', posts.slice(0, 2));
    return posts;
}

export default fetchPosts;
