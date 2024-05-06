// app/api/toggleRecentPhotos/route.ts
import { NextResponse } from 'next/server';
import prisma from "../../../prisma/prisma"

export async function POST(request) {
  try {
    const { tagName, tagSlug } = await request.json();

    // Validation de base pour tagName
    if (!tagName || typeof tagName !== 'string' || tagName.trim().length === 0) {
      return NextResponse.json({ error: 'Tag name is required and must be a non-empty string.' });
    }

    // Validation de base pour tagSlug
    if (!tagSlug || typeof tagSlug !== 'string' || tagSlug.trim().length === 0) {
      return NextResponse.json({ error: 'Tag slug is required and must be a non-empty string.' });
    }

    // Vérifier si le tag existe déjà
    const existingTag = await prisma.tag.findUnique({
      where: {
        name: tagName,
      },
    });

    if (existingTag) {
      return NextResponse.json({ message: 'Tag already exists' });
    }

    // Créer le tag si non existant
    const newTag = await prisma.tag.create({
      data: {
        name: tagName,
        slug: tagSlug,
        // Vous pouvez ajouter d'autres champs ici si nécessaire
      },
    });

    return NextResponse.json(newTag);
  } catch (error) {
    console.error('An error occurred while creating a tag:', error);
    return NextResponse.json({ message: 'Failed to create tag', error: error.message });
  }
}
