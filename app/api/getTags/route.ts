// app/api/toggleRecentPhotos/route.ts
import { NextResponse } from 'next/server';
import prisma from "../../../prisma/prisma"

export async function GET() {
  // const { photoId, toggleRecent } = await request.json();

  try {
    // Récupérer la photo avec l'ID spécifié
    const allTags = await prisma.tag.findMany();

    if (!allTags) {
      throw new Error('Tag not found');
    }


    return NextResponse.json(allTags);
  } catch (error) {
    console.error('An error occurred while fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' });
  }
}
