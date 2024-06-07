import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../prisma/prisma"

export const dynamic = 'force-dynamic'

export async function GET( req: NextRequest, context: {params: {tagSlug: string}}) {

  const tagSlug = context.params.tagSlug;

  console.log(tagSlug,"tagSlug")

  try {
    // Trouver le tag par son nom
    const tag = await prisma.tag.findUnique({
      where: {
        slug: tagSlug 
      }
    });

    if (!tag) {
      return NextResponse.json({ success: false, error: "Tag not found", message: `No tag found with the slug '${tagSlug}'` });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('An error occurred while fetching tag:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' });
  }
}
