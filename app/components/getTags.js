import prisma from "../../../prisma/prisma"

async function getTags() {
  try {
  
    let allTags = await prisma.tag.findMany({

      include: {
        photos: true // Inclure les photos associées à chaque tag
      }
      
    });


    const tagsArray = allTags.map ((tag) => {
      const { name, slug, photos } = tag;
      const count = photos.length; // Compter le nombre de photos associées à ce tag
      let url = null;
      if (photos.length > 0) {
        // Sélectionner une photo aléatoire parmi les photos associées à ce tag
        const randomIndex = Math.floor(Math.random() * photos.length);
        url = photos[randomIndex].url; // URL de la photo aléatoire
      }
      return {
        name,
        slug,
        count,
        url: url, // Remplacer par l'URL de la photo aléatoire associée à ce tag
        mainTag: false // Remplacer par true/false en fonction de la logique de votre application
      };h
    })

    return tagsArray;
  } catch (error) {
    console.error('Une erreur est survenue lors de la récupération des tags :', error);
    return []; // Retourner un tableau vide en cas d'erreur
  } finally {
    await prisma.$disconnect();
  }
}

export default getTags;
