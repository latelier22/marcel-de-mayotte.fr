const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Lire le fichier JSON
    const rawData = fs.readFileSync('catalogue.json');
    const data = JSON.parse(rawData);

    // Créer toutes les catégories de tags uniques
    const uniqueTags = [...new Set(data.flatMap(item => item.tags))];

    for (const tagName of uniqueTags) {
      await prisma.tag.create({
        data: {
          name: tagName,
        },
      });
    }

    console.log('Catégories de tags créées avec succès !');

   
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
