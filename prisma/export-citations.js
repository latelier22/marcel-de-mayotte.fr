// importCitations.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function exportCitations() {
    try {
        const citations = await prisma.citation.findMany(
           
        );

        // Write to a JSON file
        fs.writeFileSync('citations2.json', JSON.stringify(citations, null, 2));
        console.log('Export completed successfully.');
    } catch (error) {
        console.error('Error exporting citations:', error);
    } finally {
        await prisma.$disconnect();
    }
}

exportCitations();