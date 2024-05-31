import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../prisma/prisma"

export const dynamic = 'force-dynamic'

export async function GET( req: NextRequest, context: {params: {tagId: string, address: string}}) {

  const tagId = context.params.tagId;

  try {
    // Trouver le tag par son nom
    const tag = await prisma.tag.findUnique({
      where: {
        id: parseInt(tagId) // Assurez-vous que tagId est un nombre
      },
      include: {
        childTags: true,
        parentTag: true,
      }

    });

    if (!tag) {
      return NextResponse.json({ success: false, error: "Tag not found", message: `No tag found with the id '${tagId}'` });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('An error occurred while fetching tag:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' });
  }
}
