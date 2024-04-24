import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getImages( noSlugTags = []) {
    try {
        // Récupérer les premières "limit" images de la base de données
        // Récupérer les premières "limit" images de la base de données
        let images = await prisma.photo.findMany({
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

        images.slice(0, 3).forEach(image => {
            // Assurez-vous que l'objet tags existe et est un tableau
            if (image.tags && Array.isArray(image.tags)) {
                // Utilisez la méthode map pour transformer chaque objet tag en son nom
                const tagNames = image.tags.map(tag => tag.name);
                console.log("Noms des tags pour l'image", image.id, ":", tagNames);
            } else {
                console.log("Pas de tags associés à l'image", image.id);
            }
        });

         // Récupérer les images exclues
         const excludedImages = await prisma.photo.findMany({
            where: {
                tags: {
                    some: {
                        name: {
                            in: noSlugTags
                        }
                    }
                }
            },
            include: {
                tags: true // Inclure les tags associés à chaque image
            }
        });

        // Afficher les images exclues dans la console
        console.log("Images exclues :", excludedImages);




        // Log pour vérification
        // console.log("getImages PRISMA", images);

        // Retourner les images récupérées
        return images;
    } catch (error) {
        console.error("Une erreur est survenue lors de la récupération des images :", error);
        return []; // Retourner un tableau vide en cas d'erreur
    } finally {
        await prisma.$disconnect(); // Déconnecter Prisma une fois que la récupération est terminée
    }
}

export default getImages;
