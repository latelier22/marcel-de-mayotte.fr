// lib/prisma.js
import { PrismaClient } from '@prisma/client';

let prisma;

if (typeof window === "undefined") {
    // Assurez-vous que le client Prisma n'est créé que côté serveur
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;
