import { NextResponse } from "next/server";
import prisma from "../../../prisma/prisma"

export async function POST(request) {
  const { userId, selectedPhotoIds, makeFavorite } = await request.json();

  console.log(userId, selectedPhotoIds, makeFavorite)
  try {
    if (makeFavorite) {
      // Add to favorites in bulk
      const addFavorites = selectedPhotoIds.map(photoId => ({
        userId: userId,
        photoId: photoId,
      }));
      await prisma.favorite.createMany({
        data: addFavorites,
        skipDuplicates: true, // This prevents SQL errors on duplicate entries
      });
      return NextResponse.json({ success: true, action: "added" });
    } else {
      // Remove from favorites in bulk
      await prisma.favorite.deleteMany({
        where: {
          userId: userId,
          photoId: { in: selectedPhotoIds },
        },
      });
      return NextResponse.json({ success: true, action: "removed" });
    }
  } catch (error) {
    console.error("Error updating favorites in bulk:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update favorites in bulk",
      message: error.message,
    });
  }
}
