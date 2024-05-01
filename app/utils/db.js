// utils/db.js

import prisma from '../prisma/prisma'; // Assurez-vous que le chemin vers votre client Prisma est correct

export async function getUserFromDb(email) {
  // Utilisez Prisma pour rechercher l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });
  return user; // Cela renvoie l'utilisateur trouvé, ou null si aucun utilisateur n'est trouvé
}
