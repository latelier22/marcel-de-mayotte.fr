import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'

async function getImages( noSlugTags = [],userId=null) {
    try {
        // Récupérer les premières "limit" images de la base de données
        // Récupérer les premières "limit" images de la base de données
        let photos = await prisma.photo.findMany({
            where: {
                NOT: {
                    tags: {
                        some: {
                            name: {
                                in: noSlugTags
                            }
                        }
                    }
                }
            },
            // take: limit, // Utiliser la limite spécifiée
            include: {
                tags: true // Inclure les tags associés à chaque image
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

        
    } catch (error) {
        console.error("Une erreur est survenue lors de la récupération des images :", error);
        return []; // Retourner un tableau vide en cas d'erreur
    } finally {
        await prisma.$disconnect(); // Déconnecter Prisma une fois que la récupération est terminée
    }
}

export default getImages;
