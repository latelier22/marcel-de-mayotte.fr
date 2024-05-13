import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../prisma/prisma";

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    try {
        // Parse the ID from the request parameters
        const id = parseInt(context.params.id);

        // Validate the ID is a number
        if (isNaN(id)) {
            console.error('Invalid citation ID provided:', context.params.id);
            return new NextResponse(JSON.stringify({ error: 'Invalid citation ID.' }), { status: 400 });
        }

        // Attempt to delete the citation with the specified ID
        const deletedCitation = await prisma.citation.delete({
            where: { id },
        });

        // If deletion is successful, return a success message
        return new NextResponse(JSON.stringify({ message: 'Citation deleted successfully.' }), { status: 200 });
    } catch (error) {
        console.error('An error occurred while deleting citation:', error);

        // Determine the appropriate status code based on the error
        const statusCode = error.meta && error.meta.cause === 'Record not found' ? 404 : 500;

        return new NextResponse(JSON.stringify({ error: 'Failed to delete citation.' }), { status: statusCode });
    }
}
