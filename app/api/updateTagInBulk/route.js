import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const { addTag, selectedPhotoIds, selectedTag } = await request.json();
console.log("recu :",addTag, selectedPhotoIds, selectedTag )
  try {
    // Trouver le tag par son nom
    const tag = await prisma.tag.findUnique({
      where: {
        name: selectedTag
      }
    });

    if (!tag) {
      return NextResponse.json({ success: false, error: "Tag not found", message: `No tag found with the name '${selectedTag}'` });
    }

    const tagId = tag.id;

    console.log("tagId",tagId)

    // Préparation des opérations de mise à jour pour chaque photoId
    const operations = selectedPhotoIds.map(async (photoId) => {
      const photo = await prisma.photo.findUnique({
        where: { id: photoId },
        include: { tags: true }
      });
      console.log("photo",photo.name)

      if (photo && (!photo.tags.some(t => t.id === tagId) || !addTag)) {
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
      } else {
        // Si aucune opération n'est nécessaire, retournez une promesse résolue
        return Promise.resolve(null);
      }
    });

    // Exécuter toutes les opérations en une transaction
    const results = await prisma.$transaction(operations);
// console.log("results",results)

    return NextResponse.json({ success: true, action: addTag ? "added" : "removed", results: results });
  } catch (error) {
    console.error("Error updating TAG in bulk:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update Tag in bulk",
      message: error.message,
    });
  }
}
