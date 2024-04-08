import getImages from './getImages';
import slugify from './getSlug';

async function getImagesbyTag(tagSlug) {
    const images = await getImages(); // Obtenir toutes les images
    const filteredImages = images.filter(image => {
        // Générer le slug pour chaque tag de l'image et vérifier s'il correspond au tagSlug
        return image.tags.some(tag => slugify(tag) === tagSlug);
    });
    return filteredImages;
}

export default getImagesbyTag;