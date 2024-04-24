const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Créer les tags
    const tag1 = await prisma.tag.create({
      data: {
        name: 'PERSONNAGES',
      },
    });

    const tag2 = await prisma.tag.create({
      data: {
        name: 'PORTRAITS',
      },
    });

    // Créer la photo et l'associer aux tags
    const photo = await prisma.photo.create({
      data: {
        numero: '0000',
        dimensions: '100 x 200',
        url: '',
        name: 'mon image',
        tags: {
          connect: [
            { id: tag1.id },
            { id: tag2.id },
          ],
        },
      },
      include: {
        tags: true,
      },
    });

    console.log('Données insérées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
