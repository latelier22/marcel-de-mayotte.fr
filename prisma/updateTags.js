// updateTags.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const slugify = require('slugify');

function generateSlug(name) {
    return slugify(name, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
    });
}

async function updateTagSlugs() {
    const tags = await prisma.tag.findMany();
    const updates = tags.map(tag => {
        const newSlug = generateSlug(tag.name);
        return prisma.tag.update({
            where: { id: tag.id },
            data: { slug: newSlug }
        });
    });

    await Promise.all(updates);
    console.log('All slugs have been updated.');

    // Always close the Prisma Client connection
    await prisma.$disconnect();
}

updateTagSlugs().catch(e => {
    console.error(e);
    process.exit(1);
});
