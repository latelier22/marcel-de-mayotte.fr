// pages/api/togglePublished.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {


  const { photoId, title } = await request.json();

  console.log(photoId, "titre" ,title)

  try {
    const updatedPhoto = await prisma.photo.update({
      where: { id: parseInt(photoId) },
      data: { title },  // Mise à jour du titre
    });

    return NextResponse.json({
    });

  } catch (error) {
    return NextResponse.json({ error });
  }
}
