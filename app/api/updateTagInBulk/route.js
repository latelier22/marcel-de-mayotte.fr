import { NextResponse } from "next/server";
import prisma from "../../../prisma/prisma";

export async function POST(request) {
  const { addTag, selectedPhotoIds, selectedTag } = await request.json();
  console.log("reçu :", addTag, selectedPhotoIds, selectedTag);

  try {
    // Trouver le tag par son nom
    const tag = await prisma.tag.findUnique({
      where: { name: selectedTag }
    });

    if (!tag) {
      return NextResponse.json({
        success: false,
        error: "Tag not found",
        message: `No tag found with the name '${selectedTag}'`
      });
    }

    const tagId = tag.id;
    console.log("tagId", tagId);

    // Préparation des opérations de mise à jour pour chaque photoId
    const operations = selectedPhotoIds.map(photoId => {
      if (addTag) {
        return prisma.photo.update({
          where: { id: photoId },
          data: {
            tags: {
              connect: { id: tagId }
            }
          }
        });
      } else {
        return prisma.photo.update({
          where: { id: photoId },
          data: {
            tags: {
              disconnect: { id: tagId }
            }
          }
        });
      }
    });

    // Exécuter toutes les opérations en une transaction
    const results = await prisma.$transaction(operations);
    console.log("results", results);

    // Convertir BigInt en string pour la sérialisation JSON
    const sanitizedResults = results.map(result => ({
      ...result,
      numero: result.numero.toString()
    }));

    return NextResponse.json({
      success: true,
      action: addTag ? "added" : "removed",
      results: sanitizedResults
    });
  } catch (error) {
    console.error("Error updating TAG in bulk:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update Tag in bulk",
      message: error.message,
    });
  }
}
