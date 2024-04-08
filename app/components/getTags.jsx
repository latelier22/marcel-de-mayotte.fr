import getSlug from "./getSlug"

async function getTags(tableauPhotos) {
  const tagsCount = {};

  // Compter le nombre de photos pour chaque tag
  tableauPhotos.forEach(photo => {
    if (photo.tags) {
      photo.tags.forEach(tag => {
        tagsCount[tag] = (tagsCount[tag] || 0) + 1;
      });
    }
  });

  // Créer un tableau d'objets avec le nom du tag et le nombre de photos
  const tagsArray = Object.keys(tagsCount).map(tag => ({
    name: tag,
    count: tagsCount[tag],
    slug: getSlug(tag)
  }));

  // Trier le tableau d'objets par ordre décroissant du nombre de photos
  tagsArray.sort((a, b) => b.count - a.count);

  return tagsArray;
}

export default getTags;
