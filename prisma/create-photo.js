
require('dotenv').config({ path: '../.env.local' });
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

async function createPhoto(numero, filename, title, description) {
  try {
    const filePath = path.join(process.cwd(),'..', 'public', 'uploads', filename);


    const fs = require('fs');

    if (!fs.existsSync(filePath)) {
      console.error('File does not exist:', filePath);
      return;
    }
    


    const image = sharp(filePath);

    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;

    const photo = await prisma.photo.create({
      data: {
        numero: parseInt("2297653400121", 10),
        name: filename,
        title,
        description,
        width,
        height,
        url: `/uploads/${filename}`,
      },
    });

    console.log('Photo created:', photo);
  } catch (error) {
    console.error('Failed to create photo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const args = process.argv.slice(2);
const numero =  args[0];
const filename =args[1];
const title = args[2];
const description = args[3];

if (!numero || !filename || !title) {
  console.log('Usage: node create-photo <numero> <filename> <title> [description]');
  process.exit(1);
}

createPhoto(numero , filename, title, description);
