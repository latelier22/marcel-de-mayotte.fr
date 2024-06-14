import { NextRequest, NextResponse } from "next/server"

import prisma from "../../../../prisma/prisma"

export async function GET( req: NextRequest, context: {params: {tagId: string, address: string}}) {

const tagId = context.params.tagId;

  console.log(tagId);
  try {
    if (tagId) {
      const tagImages = await prisma.photo.findMany({
        where: {
          tags: {
            some: {
              id: parseInt(tagId) // Assurez-vous que tagId est un nombre
            }
          }
        }
      });

      if (tagImages.length > 0) {
        return NextResponse.json({ tagImages });
      } else {
        return NextResponse.json({ message: "No images found for this tag" });
      }
    } else {
      return NextResponse.json({ error: "Tag ID is required" });
    }
  } catch (error) {
    console.error("Error fetching images by tag:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch images by tag",
      message: error.message,
    });
  }
}
