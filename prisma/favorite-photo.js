const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addFavorite(userId, photoId) {
    try {
        // Vérifiez si le favori existe déjà pour éviter les doublons
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_photoId: {
                    userId: userId,
                    photoId: photoId
                }
            }
        });

        // S'il existe déjà, informez l'utilisateur et ne faites rien
        if (existingFavorite) {
            console.log(`Favorite already exists for user ${userId} and photo ${photoId}`);
            return;
        }

        // Sinon, créez le favori
        const favorite = await prisma.favorite.create({
            data: {
                userId: userId,
                photoId: photoId
            }
        });

        console.log(`Added favorite for user ${userId} on photo ${photoId}`);
    } catch (error) {
        console.error("Error adding favorite:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Vérifiez les arguments et exécutez la fonction
if (process.argv.length !== 4) {
    console.log('Usage: node addFavorite.js <userId> <photoId>');
    process.exit(1);
}

const userId = parseInt(process.argv[2], 10);
const photoId = parseInt(process.argv[3], 10);

addFavorite(userId, photoId);
