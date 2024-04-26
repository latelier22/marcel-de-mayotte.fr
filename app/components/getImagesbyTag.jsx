import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getImagesbyTag(tagSlug, limit = Infinity) {
    console.log(tagSlug)
    try {
        // Récupérer les informations du tag correspondant au slug donné
        const tag = await prisma.tag.findFirst({
            where: {
                slug: tagSlug,
            },
            include: {
                photos: true // Inclure les photos associées au tag
            }
        });

        if (!tag) {
            console.error(`Tag with slug ${tagSlug} not found.`);
            return [];
        }

        // Extraire les photos associées au tag
        const photos = tag.photos;

        // Trier les photos par ordre croissant basé sur leur .numero
        photos.sort((a, b) => {
            return a.numero - b.numero;
        });

        // Limiter le nombre de photos
        const limitedPhotos = photos.slice(0, limit);

        console.log("limitedPhotos",limitedPhotos.slice(0,3))

        return limitedPhotos;
    } catch (error) {
        console.error('Une erreur est survenue lors de la récupération des images par tag :', error);
        return [];
    } finally {
        await prisma.$disconnect();
    }
}

export default getImagesbyTag;
