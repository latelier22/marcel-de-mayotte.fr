import myFetch from './myFetch';

async function fetchComments(postId = null) {
    let url = '/api/comments?populate=*';
    if (postId) {
        url += `&filters[post][id][$eq]=${postId}`; // Assurez-vous que cette syntaxe correspond à celle de votre API
    }
    
    const response = await myFetch(url, 'GET', null, 'comments');
    const strapiComments = response.data;

    const comments = strapiComments.map(comment => ({
        id: comment.id,
        texte: comment.attributes.texte,
        auteur: comment.attributes.auteur,
        etat: comment.attributes.etat,
        createdAt: comment.attributes.createdAt,
        updatedAt: comment.attributes.updatedAt,
        publishedAt: comment.attributes.publishedAt,
        post: comment.attributes.post ? comment.attributes.post.data.id : null,
        parent_comment: comment.attributes.parent_comment && comment.attributes.parent_comment.data ? comment.attributes.parent_comment.data.id : null,
        child_comments: comment.attributes.child_comments && Array.isArray(comment.attributes.child_comments.data) ? comment.attributes.child_comments.data.map(reply => reply.id) : []
    }));

    console.log('fetch comments', comments);
    return comments;
}

export default fetchComments;
