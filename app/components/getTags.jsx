import getSlug from "./getSlug";

// Fonction pour choisir une photo au hasard dans une catégorie spécifique
function chooseRandomPhoto(tableauPhotos, tag) {
  const photosWithTag = tableauPhotos.filter(photo => photo.tags && photo.tags.includes(tag));
  if (photosWithTag.length > 0) {
    const randomIndex = Math.floor(Math.random() * photosWithTag.length);
    return photosWithTag[randomIndex];
  }
  return null; // Retourner null si aucune photo n'est trouvée pour ce tag
}

async function getTags(tableauPhotos) {
  const tagsCount = {};

  // Compter le nombre de photos pour chaque tag
  tableauPhotos.forEach(photo => {
    if (photo.tags) {
      photo.tags.forEach(tag => {
        // Convertir le tag en minuscules pour éviter les cas de "NU" ou "Nu" ou "nU"
        const lowercaseTag = tag.toLowerCase();
        // Exclure les tags "nu" ou "NU"
        // if (lowercaseTag !== "nu") {
        //   tagsCount[tag] = (tagsCount[tag] || 0) + 1;
        // }
      
          tagsCount[tag] = (tagsCount[tag] || 0) + 1;
        
      });
    }
  });

  // Créer un tableau d'objets avec le nom du tag, le nombre de photos et une URL aléatoire
  const tagsArray = Object.keys(tagsCount).map(tag => {
    const count = tagsCount[tag];
    const slug = getSlug(tag);
    const randomPhoto = chooseRandomPhoto(tableauPhotos, tag);
    const url = randomPhoto ? randomPhoto.url : null;
    return {
      name: tag,
      count,
      slug,
      url
    };
  });  

  // Trier le tableau d'objets par ordre décroissant du nombre de photos
  tagsArray.sort((a, b) => b.count - a.count);

  // console.log(tagsArray)

  return tagsArray;
}

export default getTags;

