import { PrismaClient } from '@prisma/client';
import getSlug from "./getSlug";

const prisma = new PrismaClient();

async function getTags() {
  try {
    // Récupérer tous les tags depuis la base de données
    const allTags = await prisma.tag.findMany();

    // Mapper les tags pour les transformer en format souhaité
    const tagsArray = allTags.map(tag => {
      const { name } = tag;
      const slug = getSlug(name); // Utiliser votre fonction getSlug pour créer le slug
      return {
        name,
        slug,
        count: 0, // Remplacer par le vrai nombre de photos associées à ce tag
        url: null, // Remplacer par l'URL de la photo aléatoire associée à ce tag
        mainTag: false // Remplacer par true/false en fonction de la logique de votre application
      };
    });

    return tagsArray;
  } catch (error) {
    console.error('Une erreur est survenue lors de la récupération des tags :', error);
    return []; // Retourner un tableau vide en cas d'erreur
  } finally {
    await prisma.$disconnect();
  }
}

export default getTags;
