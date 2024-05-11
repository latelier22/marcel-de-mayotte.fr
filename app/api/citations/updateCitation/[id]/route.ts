import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../prisma/prisma";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    try {
       

        // Parse the ID from the request parameters
        const id = parseInt(context.params.id);

         // Parse the body data
         const {texte, auteur, etat } = await req.json();

        // Validate the ID is a number
        if (isNaN(id)) {
            console.error('Invalid citation ID provided:', context.params.id);
            return new NextResponse(JSON.stringify({ error: 'Invalid citation ID.' }), { status: 400 });
        }


        // Attempt to update the citation with the specified ID
        const updatedCitation = await prisma.citation.update({
            where: { id },
            data: { texte, auteur, etat },
        });

        // If update is successful, return a success message
        return new NextResponse(JSON.stringify({ message: 'Citation updated successfully.', citation: updatedCitation }), { status: 200 });
    } catch (error) {
        console.error('An error occurred while updating citation:', error);

        // Determine the appropriate status code based on the error
        const statusCode = error.meta && error.meta.cause === 'Record not found' ? 404 : 500;

        return new NextResponse(JSON.stringify({ error: 'Failed to update citation.' }), { status: statusCode });
    }
}
