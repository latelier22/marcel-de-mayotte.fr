import { NextResponse } from "next/server";
import prisma from "../../../prisma/prisma";

export async function POST(request) {
  const { tagName } = await request.json();

  try {
    // Trouver le tag par son nom
    const tag = await prisma.tag.findUnique({
      where: {
        name: tagName
      }
    });

    if (!tag) {
      return NextResponse.json({ success: false, error: "Tag not found", message: `No tag found with the name '${tagName}'` });
    }

    // Récupérer toutes les photos associées à ce tag
    const photos = await prisma.photo.findMany({
      where: {
        tags: {
          some: {
            id: tag.id
          }
        }
      }
    });

    // Détacher le tag de toutes les photos
    const detachOperations = photos.map(photo => {
      return prisma.photo.update({
        where: { id: photo.id },
        data: {
          tags: {
            disconnect: { id: tag.id }
          }
        }
      });
    });

    // Exécuter les opérations de détachement
    await prisma.$transaction(detachOperations);

    // Supprimer le tag de la base de données
    await prisma.tag.delete({
      where: {
        id: tag.id
      }
    });

    return NextResponse.json({ success: true, message: `Tag '${tagName}' and all its associations have been deleted successfully.` });
  } catch (error) {
    console.error("Error in deleting tag and its associations:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to delete tag and its associations",
      message: error.message
    });
  }
}
