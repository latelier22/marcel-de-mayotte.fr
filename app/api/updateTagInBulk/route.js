import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const { addTag, selectedPhotoIds, selectedTag } = await request.json();

  console.log(addTag, selectedPhotoIds, selectedTag);
  try {
    if (addTag) {
      // Préparation des données pour l'ajout des tags
      const tagData = selectedPhotoIds.map(photoId => ({
        tagId: selectedTag,
        photoId: photoId,
      }));

      // Ajout des tags aux photos en évitant les doublons
      await prisma.$transaction(
        tagData.map(tag => 
          prisma.photo.update({
            where: { id: tag.photoId },
            data: {
              tags: {
                connectOrCreate: {
                  where: { id: tag.tagId },
                  create: { id: tag.tagId }
                }
              }
            }
          })
        )
      );

      return NextResponse.json({ success: true, action: "added" });
    } else {
      // Suppression des tags des photos
      await prisma.$transaction(
        selectedPhotoIds.map(photoId => 
          prisma.photo.update({
            where: { id: photoId },
            data: {
              tags: {
                disconnect: {
                  id: selectedTag
                }
              }
            }
          })
        )
      );
      return NextResponse.json({ success: true, action: "removed" });
    }
  } catch (error) {
    console.error("Error updating TAG in bulk:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update Tag in bulk",
      message: error.message,
    });
  }
}
