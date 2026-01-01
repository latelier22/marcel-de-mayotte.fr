import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../prisma/prisma";

export async function GET( req: NextRequest, context: {params: {tagId: string}}) {

  const tagId = context.params.tagId;

  try {
    // Trouver le tag par son ancien nom
    const tag = await prisma.tag.findUnique({
      where: {
        id: parseInt(tagId) // Assurez-vous que tagId est un nombre
      }
    });

    if (!tag) {
      return NextResponse.json({ success: false, error: "Tag not found", message: `No tag found with id ${tagId} `});
    }

    // Mettre à jour le nom du tag
    await prisma.tag.update({
      where: {
        id: tag.id
      },
      data: { 
        mainTag : !tag.mainTag
      }
    });

    return NextResponse.json({ success: true, message: `Tag updated successfully.` , tag});
  } catch (error) {
    console.error("Error in updating tag name:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update tag name",
      message: error.message
    });
  }
}
