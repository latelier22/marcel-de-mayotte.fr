// app/api/toggleRecentPhotos/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const { photoId, toggleRecent } = await request.json();

  try {
    // Récupérer la photo avec l'ID spécifié
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { tags: true }, // Inclure les tags de la photo
    });

    if (!photo) {
      throw new Error('Photo not found');
    }

    let updatedTags = [];

    if (toggleRecent) {
      // Vérifier si le tag avec l'ID 70 est déjà présent dans les tags de la photo
      const hasRecentTag = photo.tags.some(tag => tag.id === 70);
      
      // Si le tag est déjà présent, ne rien faire
      if (!hasRecentTag) {
        // Ajouter le tag avec l'ID 70 aux tags de la photo
        updatedTags = [...photo.tags, { id: 70 }];
      } else {
        updatedTags = photo.tags;
      }
    } else {
      // Retirer le tag avec l'ID 70 des tags de la photo
      updatedTags = photo.tags.filter(tag => tag.id !== 70);
    }

    // Mettre à jour les tags de la photo avec les nouveaux tags
    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: { tags: { set: updatedTags } },
    });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error('An error occurred while updating recent photos:', error);
    return NextResponse.json({ error: 'Failed to update recent photos' });
  }
}
