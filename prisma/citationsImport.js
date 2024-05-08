const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function importCitation(citation, parentId = null) {
  const { texte, auteur, photoId, etat } = citation;
  return await prisma.citation.create({
    data: {
      texte,
      auteur,
      photoId: photoId || null, // Assurez-vous que photoId est correctement géré selon vos données
      etat : "publiée",
      parentCitationId: parentId // Set the ID of the parent citation
    }
  });
}

async function main() {
  const citationsData = JSON.parse(fs.readFileSync('citations.json', 'utf-8'));

  for (const item of citationsData) {
    if (Array.isArray(item)) { // Handle nested citations as hierarchical chain
      let parentId = null;
      for (const citation of item) {
        const newCitation = await importCitation(citation, parentId);
        parentId = newCitation.id; // Update the parentId for the next citation in the chain
      }
    } else {
      await importCitation(item);
    }
  }

  console.log('Data import completed.');
}

main()
  .catch(e => {
    console.error(`An error occurred: ${e.message}`);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
