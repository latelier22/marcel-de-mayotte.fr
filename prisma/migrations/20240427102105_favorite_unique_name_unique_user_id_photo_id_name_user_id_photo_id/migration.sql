/*
  Warnings:

  - A unique constraint covering the columns `[userId,photoId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Favorite_photoId_userId_key` ON `Favorite`;

-- CreateIndex
CREATE UNIQUE INDEX `Favorite_userId_photoId_key` ON `Favorite`(`userId`, `photoId`);
