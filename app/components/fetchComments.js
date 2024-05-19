import myFetch from './myFech';

async function fetchComments() {
    const response = await myFetch('/api/comments?populate=*', 'GET', null, 'comments');
    const strapiComments = response.data;

    const comments = strapiComments.map(comment => ({
        id: comment.id,
        ...comment.attributes,
        post: comment.attributes.post.data.id,
        comments: comment.attributes.comments ? comment.attributes.comments.data.map(reply => ({
            id: reply.id,
            ...reply.attributes
        })) : []
    }));

    console.log('fetch comments', comments.slice(0, 2));
    return comments;
}

export default fetchComments;
