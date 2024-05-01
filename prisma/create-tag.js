// create-tag.js

require('dotenv').config({ path: '../.env.local' });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTag(tagName) {
  try {
    const tag = await prisma.tag.create({
      data: {
        name: tagName,
        slug: tagName.toLowerCase(),
        mainTag: false,
      },
    });
    console.log('Tag created:',tag);
  } catch (error) {
    console.error('Error creating tag:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const tagName = process.argv[2]; // Get the tag name from command line arguments

if (!tagName) {
  console.log('Please provide a tag name');
  process.exit(1);
}

createTag(tagName);
