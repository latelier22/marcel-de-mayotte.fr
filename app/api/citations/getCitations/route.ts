import prisma from "../../../../prisma/prisma";
import { NextResponse } from 'next/server';


export async function GET() {
//   const { citationId } = await request.json();

  try {
    // Récupérer la photo avec l'ID spécifié
    
    const allCitations = await prisma.citation.findMany();

    if (!allCitations) {
      throw new Error('No citations found');
    }


    return NextResponse.json(allCitations);
  } catch (error) {
    console.error('An error occurred while fetching citations:', error);
    return NextResponse.json({ error: 'Failed to fetch citations' });
  }
}