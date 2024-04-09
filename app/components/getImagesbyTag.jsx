import getImages from './getImages';
import slugify from './getSlug';

async function getImagesbyTag(tagSlug, limit = Infinity) {
    const allImages = await getImages(); // Obtenir toutes les images
    //const images = allImages.slice(0, limit); // Limiter le nombre d'images

    const filteredImages = allImages.filter(image => {
        // Générer le slug pour chaque tag de l'image et vérifier s'il correspond au tagSlug
        return image.tags && image.tags.some(tag => slugify(tag) === tagSlug);
    }).slice(0, limit); // Limiter le nombre d'images

    return filteredImages;
}

export default getImagesbyTag;
