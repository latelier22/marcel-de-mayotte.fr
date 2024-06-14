import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getTags() {
  try {
    // Récupérer tous les tags depuis la base de données
    const allTags = await prisma.tag.findMany({
      
    });

    // Mapper les tags pour les transformer en format souhaité
    const tagsArray = allTags.map(tag => {
      const { name, slug } = tag;
    
      return {
        name,
        slug: slug, // Accéder directement à la propriété slug de chaque objet tag
        count:0,
        url: null, // Remplacer par l'URL de la photo aléatoire associée à ce tag
        mainTag: false // Remplacer par true/false en fonction de la logique de votre application
      };
    });

    // Afficher les trois premiers slugs dans la console

    return tagsArray;
  } catch (error) {
    console.error('Une erreur est survenue lors de la récupération des tags :', error);
    return []; // Retourner un tableau vide en cas d'erreur
  } finally {
    await prisma.$disconnect();
  }
}

export default getTags;
