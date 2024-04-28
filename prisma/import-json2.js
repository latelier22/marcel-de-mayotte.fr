const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function addPhotosToDatabase() {
  try {
    // Charger le fichier JSON contenant les données des photos
    const rawData = fs.readFileSync('photos.json');
    const photos = JSON.parse(rawData);

    // Parcourir chaque photo dans le fichier JSON
    for (const photoData of photos) {
      // Créer une nouvelle entrée dans la table Photo de la base de données
      const createdPhoto = await prisma.photo.create({
        data: {
          numero: photoData.numero,
          name: photoData.name,
          url: photoData.url,
          width: photoData.width,
          height: photoData.height,
        }
      });

      // Insérer les tags de la photo
      for (const tagName of photoData.tags) {
        let tag = await prisma.tag.findUnique({ where: { name: tagName } });
        if (!tag) {
          tag = await prisma.tag.create({ data: { name: tagName, slug: tagName.toLowerCase().replace(/ /g, '-'), mainTag: false } });
        }
        await prisma.photoTag.create({
          data: {
            photoId: createdPhoto.id,
            tagId: tag.id,
          },
        });
      }
    }

    console.log('Photos ajoutées à la base de données avec succès.');
  } catch (error) {
    console.error('Une erreur est survenue lors de l\'ajout des photos à la base de données :', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPhotosToDatabase();