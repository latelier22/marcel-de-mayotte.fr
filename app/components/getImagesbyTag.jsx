import getImages from './getImages';
import slugify from './getSlug';

async function getImagesbyTag(tagSlug) {
    const allImages = await getImages(); // Obtenir toutes les images
    // const images =allImages.slice(70,90)
    const images =allImages;
    console.log(tagSlug);
    console.log(images);
    const filteredImages = images.filter(image => {
        console.log("tags:", image.tags);
        // Générer le slug pour chaque tag de l'image et vérifier s'il correspond au tagSlug
        return image.tags.some(tag => slugify(tag) === tagSlug);
    });

    console.log(filteredImages)
    return filteredImages;
}

export default getImagesbyTag;