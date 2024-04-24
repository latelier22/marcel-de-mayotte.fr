import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deletePhoto(photoId) {
    try {
        // Vérifier si la photo existe
        const existingPhoto = await prisma.photo.findUnique({
            where: {
                id: parseInt(photoId)
            }
        });

        // Si la photo n'existe pas, afficher un message d'erreur
        if (!existingPhoto) {
            console.error(`La photo avec l'ID ${photoId} n'existe pas.`);
            return;
        }

        // Vérifier s'il y a des tags associés à la photo
        const tags = await prisma.photoTag.findMany({
            where: {
                photoId: parseInt(photoId)
            }
        });

        // Si des tags sont associés à la photo, ne pas la supprimer et afficher un message
        if (tags.length > 0) {
            console.log(`La photo avec l'ID ${photoId} a des tags associés et ne peut pas être supprimée.`);
            return;
        }

        // Supprimer la photo si aucun tag n'est associé
        await prisma.photo.delete({
            where: {
                id: parseInt(photoId)
            }
        });

        console.log(`La photo avec l'ID ${photoId} a été supprimée avec succès.`);
    } catch (error) {
        console.error(`Une erreur est survenue lors de la suppression de la photo :`, error);
    } finally {
        await prisma.$disconnect();
    }
}

// Récupérer l'ID de la photo à supprimer depuis les arguments de ligne de commande
const photoId = process.argv[2];

if (!photoId) {
    console.error('Veuillez fournir l\'ID de la photo à supprimer.');
} else {
    deletePhoto(photoId);
}
