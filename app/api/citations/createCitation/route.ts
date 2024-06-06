
import { NextResponse } from 'next/server';
import prisma from "../../../../prisma/prisma";

export async function POST(request) {
  try {
    const { texte, auteur, etat , parentCitationId} = await request.json();

    // Validation de base pour texte
    if (!texte || typeof texte !== 'string' || texte.trim().length === 0) {
      return NextResponse.json({ error: 'Texte is required and must be a non-empty string.' });
    }

    // Validation de base pour auteur
    if (!auteur || typeof auteur !== 'string' || auteur.trim().length === 0) {
      return NextResponse.json({ error: 'Auteur is required and must be a non-empty string.' });
    }

    // Validation de base pour etat
    if (!etat || typeof etat !== 'string' || etat.trim().length === 0) {
      return NextResponse.json({ error: 'Etat is required and must be a non-empty string.' });
    }

    // Créer la citation
    const newCitation = await prisma.citation.create({
      data: {
        texte,
        auteur,
        etat,
        parentCitationId : parentCitationId ? parseInt(parentCitationId) : null
        // Vous pouvez ajouter d'autres champs ici si nécessaire
      },
    });

    return NextResponse.json({ citation: newCitation, message :'success'});
  } catch (error) {
    console.error('An error occurred while creating a citation:', error);
    return NextResponse.json({ message: 'Failed to create citation', error: error.message });
  }
}
