import { NextResponse } from 'next/server';
import prisma from '../../../prisma/prisma';

export async function DELETE(request) {
  const { photoId } = await request.json();

  try {
    // Supprimer les associations photo-tag
    await prisma.photo.update({
      where: { id: photoId },
      data: {
        tags: {
          deleteMany: {}, // Suppression de toutes les associations avec les tags
        },
        favorites: {
          deleteMany: {}, // Suppression de toutes les associations avec les favoris
        },
      },
    });

    // Ensuite, supprimer la photo
    const deletedPhoto = await prisma.photo.delete({
      where: {
        id: photoId,
      },
    });

    console.log("Photo supprimée avec l'ID:", photoId, deletedPhoto);

    return new NextResponse(JSON.stringify({
      message: 'Photo supprimée avec succès',
      photoIds: photoId,
    }), { status: 200 });
  } catch (error) {
    console.error('Échec de la suppression de la photo:', photoId, error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
