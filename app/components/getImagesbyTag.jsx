import getImages from './getImages';
import slugify from './getSlug';

async function getImagesbyTag(tagSlug, limit = Infinity) {
    const allImages = await getImages(); // Obtenir toutes les images

    console.log(allImages.slice(0,5))

    const uniqueNames = {}; // Objet pour suivre les noms uniques déjà rencontrés
    const filteredImages = []; // Tableau pour stocker les images filtrées

    allImages.forEach(image => {
        // Générer le slug pour chaque tag de l'image et vérifier s'il correspond au tagSlug
        if (image.tags && image.tags.some(tag => slugify(tag) === tagSlug)) {
            // Vérifier si le nom de l'image est déjà dans uniqueNames
            if (!uniqueNames[image.name]) {
                // Si le nom n'est pas encore rencontré, ajouter l'image au tableau filtré et marquer le nom comme rencontré
                filteredImages.push(image);
                uniqueNames[image.name] = true;
            }
        }
    });

    // Limiter le nombre d'images
    const limitedImages = filteredImages.slice(0, limit);

    // Trier les images par ordre croissant basé sur leur .numero
    limitedImages.sort((a, b) => {
        return a.numero - b.numero;
    });

    return limitedImages;
}

export default getImagesbyTag;
