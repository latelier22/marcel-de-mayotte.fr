import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient();

async function getImagesbyTag(tagSlug, userId = null) {
    // Récupérer toutes les photos correspondant au tag
    const photos = await prisma.photo.findMany({
        where: {
            tags: {
                some: {
                    slug: tagSlug
                }
            }
        },
        include: {
            tags: true  // Inclut les détails des tags si nécessaire
        }
    });

    if (!userId) {
        // Si aucun utilisateur n'est connecté, renvoyez toutes les photos avec isFavorite défini à false
        return photos.map(photo => ({
            ...photo,
            isFavorite: false
        }));
    }

    // Si un utilisateur est connecté, déterminez quelles photos sont ses favoris
    const favoriteIds = new Set();
    const favorites = await prisma.favorite.findMany({
        where: {
            userId: userId
        }
    });
    favorites.forEach(fav => favoriteIds.add(fav.photoId));

    // Ajuster la propriété isFavorite pour chaque photo et trier pour mettre les favoris en premier
    const photosWithFavorites = photos.map(photo => ({
        ...photo,
        isFavorite: favoriteIds.has(photo.id)
    }));

    // Trier les photos pour que les favorites soient en premier
    photosWithFavorites.sort((a, b) => (b.isFavorite - a.isFavorite));

    return photosWithFavorites;
}


export default getImagesbyTag;
