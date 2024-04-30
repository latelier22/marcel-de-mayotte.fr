// pages/api/togglePublished.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const { userId, photoId, toggleFavorite } = await request.json();

  try {
      // Toggle favorite logic
      console.log(userId, photoId, "toggleFavorite",toggleFavorite)
      if (toggleFavorite) {
          // Attempt to add to favorites
          const existingFavorite = await prisma.favorite.findUnique({
              where: {
                  userId_photoId: {
                      userId: userId,
                      photoId: photoId
                  }
              }
          });

          if (!existingFavorite) {
            console.log("pas de favori donct on jaoute")
              await prisma.favorite.create({
                  data: {
                      userId: userId,
                      photoId: photoId
                  }
              });
              const response = NextResponse.json({ success: true, action: "added" });
              return response;
          } else {
              return NextResponse.json({  success: false, error: "Favorite already exists" });
          }
      } else {
          // Attempt to remove from favorites
          await prisma.favorite.delete({
              where: {
                  userId_photoId: {
                      userId: userId,
                      photoId: photoId
                  }
              }
          });
          return NextResponse.json({ success: true, action: "removed" });
      }
  } catch (error) {
      console.error("Error updating or creating favorite:", error);
      return NextResponse.json({ 
          success: false, 
          error: "Failed to update favorite",
          message: error.message
      })
  }
}