import getTags from "./getTags";

async function getProgressionsTags(tableauPhotos) {
    const tags = await getTags(tableauPhotos); // Obtenez tous les tags
  
    // Filtrer les tags dont le nom commence par "progressions"
    const progressionsTags = tags.filter(tag => tag.name.toLowerCase().startsWith("progression"));
  
    return progressionsTags;
  }

  export default getProgressionsTags
  