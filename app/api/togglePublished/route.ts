// pages/api/togglePublished.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {


    const { photoId, published }  = await request.json();

    console.log(photoId,published)

    try {
      const updatedPhoto = await prisma.photo.update({
        where: { id: photoId },
        data: { published },
      });

      return NextResponse.json({
    });

    } catch (error) {
     return NextResponse.json({error});
    }
  }

