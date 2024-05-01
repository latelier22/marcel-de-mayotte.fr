const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const photos = await prisma.photo.findMany(); // Récupérer toutes les photos depuis la base de données

    // Parcourir toutes les photos et extraire les dimensions
    for (const photo of photos) {
      const { width, height } = extractDimensions(photo.dimensions); // Appeler la fonction extractDimensions pour extraire les dimensions

      // Mettre à jour la photo avec les valeurs de largeur et de hauteur
      await prisma.photo.update({
        where: { id: photo.id },
        data: { width, height },
      });

      console.log(`Dimensions de la photo ${photo.id} mises à jour.`);
    }

    console.log('Mise à jour des dimensions terminée.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des dimensions :', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour extraire les dimensions à partir de la chaîne de caractères
function extractDimensions(dimensionsString) {
  // Vérifier si la chaîne de caractères est définie
  if (!dimensionsString) {
    return { width: null, height: null };
  }

  // Séparer la chaîne de caractères en largeur et hauteur en utilisant l'espace comme séparateur
  const [width, height] = dimensionsString.split(' x ');

  // Retourner un objet avec la largeur et la hauteur converties en nombre
  return { width: parseInt(width), height: parseInt(height) };
}

main();
