import { NextResponse } from 'next/server';
import prisma from "../../../prisma/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Fetch all tags with their childTags and parentTag relations
    const allTags = await prisma.tag.findMany({
      include: {
        childTags: true,
        parentTag: true,
      },
    });

    if (!allTags) {
      throw new Error('Tags not found');
    }

    return NextResponse.json(allTags);
  } catch (error) {
    console.error('An error occurred while fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' });
  }
}
