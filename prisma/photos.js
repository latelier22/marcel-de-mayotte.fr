const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Lire le fichier JSON
    const rawData = fs.readFileSync('catalogue.json');
    const data = JSON.parse(rawData);

   
    // Insérer les données des photos dans la base de données
    for (const item of data) {
      const { numero, dimensions, tags, url, name } = item;

      // Insérer la photo
      const photo = await prisma.photo.create({
        data: {
          numero,
          dimensions: dimensions.join(' x '), // Convertir les dimensions en format string
          url,
          name,
          tags: {
            connect: tags.map(tagName => ({ name: tagName })),
          },
        },
      });
    }

    console.log('Données des photos insérées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
