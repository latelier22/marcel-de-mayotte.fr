import getImages from './getImages';
import slugify from './getSlug';

async function getImagesbyTag(tagSlug, limit = Infinity) {
    const allImages = await getImages(); // Obtenir toutes les images

    const filteredImages = allImages.filter(image => {
        // Générer le slug pour chaque tag de l'image et vérifier s'il correspond au tagSlug
        return image.tags && image.tags.some(tag => slugify(tag) === tagSlug);
    }).slice(0, limit); // Limiter le nombre d'images

    // Trier les images par ordre croissant basé sur leur .numero
    filteredImages.sort((a, b) => {
        return a.numero - b.numero;
    });

    return filteredImages;
}

export default getImagesbyTag;
