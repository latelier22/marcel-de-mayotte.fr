import { NextResponse } from "next/server";
import prisma from "../../../prisma/prisma"

export async function POST(request) {
    const { selectedPhotoIds, makePublished } = await request.json();

    console.log("Updating published status for photos:", selectedPhotoIds, "Make published:", makePublished);

    try {
        // Conditionnel pour ajouter ou retirer la publication en masse
        if (makePublished) {
            // Mettre à jour les photos pour les mettre en état publié
            await prisma.photo.updateMany({
                where: {
                    id: { in: selectedPhotoIds }
                },
                data: { published: true }
            });
            return NextResponse.json({ success: true, action: "published" });
        } else {
            // Mettre à jour les photos pour retirer l'état publié
            await prisma.photo.updateMany({
                where: {
                    id: { in: selectedPhotoIds }
                },
                data: { published: false }
            });
            return NextResponse.json({ success: true, action: "unpublished" });
        }
    } catch (error) {
        console.error("Error updating published status in bulk:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to update published status in bulk",
            message: error.message
        });
    }
}
