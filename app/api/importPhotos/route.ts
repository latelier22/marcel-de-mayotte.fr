// pages/api/addPhotos.js
import { NextResponse } from 'next/server';
import prisma from '../../../prisma/prisma';

// export const config = {
//     runtime: 'experimental-edge',
// };

export async function POST(request) {
    const { photos } = await request.json();

    try {
        const createdPhotos = [];
        for (let photo of photos) {
            const createdPhoto = await prisma.photo.create({
                data: {
                    numero: 0,
                    name: photo.name,
                    url: photo.url,
                    width: photo.width,
                    height: photo.height,
                    published: true,
                    title: photo.title || '',
                    
                }
            });
            createdPhotos.push(createdPhoto);
        }
    
        const photoIds = createdPhotos.map(p => p.id);
    
        // Logique supplémentaire pour utiliser les IDs...
        console.log("Created Photos with IDs:", photoIds, createdPhotos);
    
        return new NextResponse(JSON.stringify({
            message: 'Photos added successfully',
            photoIds: photoIds,
            createdPhotos,
        }), { status: 200 });
    }catch (error) {
        console.error('Failed to add photos:', error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

