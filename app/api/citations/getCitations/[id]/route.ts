import prisma from "../../../../../prisma/prisma";
import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic' // defaults to force-static


export async function GET(req :NextRequest, context: {params: {id: string}}) {
//   const { citationId } = await request.json();

const id = parseInt(context.params.id);

  console.log("id",id)

  try {
    // Récupérer la photo avec l'ID spécifié
    
    const citation = await prisma.citation.findUnique({
      where: {
        id: id
      }
    });

    if (!citation) {
      throw new Error('No citation found');
    }

    return NextResponse.json(citation);
  } catch (error) {
    console.error('An error occurred while fetching citation:', error);
    return NextResponse.json({ error: 'Failed to fetch citation' });
  }
}
