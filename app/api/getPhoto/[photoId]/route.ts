import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../prisma/prisma"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, context: { params: { photoId: string } }) {

  const photoId = context.params.photoId;
  console.log("photo by id",photoId)

  try {
    // Trouver le tag par son nom
    const photo = await prisma.photo.findUnique({
      where: {
        id: parseInt(photoId) // Assurez-vous que tagId est un nombre
      },
      include: {
        tags: true
      }

    });

    if (!photo) {
      return NextResponse.json({ success: false, error: "Tag not found", message: `No photo found with the id '${photoId}'` });
    }

    return NextResponse.json({ success: true, photo});
  } catch (error) {
    console.error('An error occurred while fetching photo:', error);
    return NextResponse.json({ error: 'Failed to fetch photo' });
  }
}


// ,
//       include: {
//         childTags: true,
//         parentTag: true,
//       }