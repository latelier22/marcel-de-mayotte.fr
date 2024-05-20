import myFetch from "./myFetch";


async function fetchPictures () {

    const response = await myFetch("/api/pictures", 'GET', null, 'pictures');


    const strapiData = response.data;
    const strapiPictures = Array.isArray(strapiData) ? strapiData : [strapiData];
        // console.log("FROM FETCHpictures strapipictures", strapiPictures);

         const pictures = strapiPictures.map(f => ({
             id: f.id,
             ...f.attributes
         }));

        
        console.log("pictures",pictures);

    return pictures

}

export default fetchPictures;


// import myFetch from './myFetch';

// async function fetchPosts(id = null) {
//     const endpoint = id ? `/api/posts/${id}?populate=*` : '/api/posts?populate=*';
//     const response = await myFetch(endpoint, 'GET');
//     const strapiData = response.data;

//     const posts = Array.isArray(strapiData) ? strapiData : [strapiData];

//     const formattedPosts = posts.map(post => {
//         // Vérifier d'abord si medias et data existent et ne sont pas nulls
//         const imageUrl = post.attributes.medias && post.attributes.medias.data && post.attributes.medias.data.length > 0
//             ? post.attributes.medias.data[0].attributes.url
//             : null;

//         return {
//             id: post.id,
//             imageUrl: imageUrl,
//             title: post.attributes.title,
//             content: post.attributes.content,
//             auteur: post.attributes.auteur,
//             etat: post.attributes.etat,
//             createdAt: post.attributes.createdAt,
//             updatedAt: post.attributes.updatedAt,
//             publishedAt: post.attributes.publishedAt,
//             comments: post.attributes.comments.data.map(comment => comment.id)
//         };
//     });

//     console.log('fetched posts', formattedPosts.slice(0, 2));
//     return formattedPosts;
// }

// export default fetchPosts;
