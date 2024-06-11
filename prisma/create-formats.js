// scripts/initTags.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Step 1: Create the main "FORMATS" tag and child tags
  const formatsTag = await prisma.tag.create({
    data: {
      name: 'FORMATS',
      mainTag: true,
      slug: 'formats',
      childTags: {
        create: [
          { name: 'Format PORTRAIT', slug: 'format-portrait' },
          { name: 'Format PAYSAGE', slug: 'format-paysage' },
          { name: 'Format CARRE', slug: 'format-carre' },
          { name: 'Format PANORAMIQUE PORTRAIT', slug: 'format-panoramique-portrait' },
          { name: 'Format PANORAMIQUE PAYSAGE', slug: 'format-panoramique-paysage' },
        ],
      },
    },
    include: {
      childTags: true,
    },
  });

  // Fetch the "PROGRESSIONS" tag
  const progressionsTag = await prisma.tag.findUnique({
    where: { slug: 'progressions' },
  });

  // Step 2: Fetch all photos and assign the appropriate format tags based on dimensions
  const photos = await prisma.photo.findMany({
    include: {
      tags: true,
    },
  });

  const portraitTag = formatsTag.childTags.find(tag => tag.name === 'Format PORTRAIT');
  const paysageTag = formatsTag.childTags.find(tag => tag.name === 'Format PAYSAGE');
  const carreTag = formatsTag.childTags.find(tag => tag.name === 'Format CARRE');
  const panoramiquePortraitTag = formatsTag.childTags.find(tag => tag.name === 'Format PANORAMIQUE PORTRAIT');
  const panoramiquePaysageTag = formatsTag.childTags.find(tag => tag.name === 'Format PANORAMIQUE PAYSAGE');

  const tolerance = 0.05; // 5% tolerance

  for (const photo of photos) {
    // Check if the photo has the "PROGRESSIONS" tag
    const hasProgressionsTag = photo.tags.some(tag => tag.id === progressionsTag.id);
    if (hasProgressionsTag) {
      continue;
    }

    const { width, height } = photo;
    let tagToAssign;

    if (width > height) {
      if (width > 2 * height * (1 - tolerance)) {
        tagToAssign = panoramiquePaysageTag;
      } else {
        tagToAssign = paysageTag;
      }
    } else if (height > width) {
      if (height > 2 * width * (1 - tolerance)) {
        tagToAssign = panoramiquePortraitTag;
      } else {
        tagToAssign = portraitTag;
      }
    } else {
      if (Math.abs(width - height) / width < tolerance) {
        tagToAssign = carreTag;
      }
    }

    if (tagToAssign) {
      await prisma.photo.update({
        where: { id: photo.id },
        data: {
          tags: {
            connect: { id: tagToAssign.id },
          },
        },
      });
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
