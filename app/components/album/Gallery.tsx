"use client";

import React, { useState } from 'react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const Gallery = ({ photos }) => {
  const [index, setIndex] = useState(-1);
  const [publishedPhotos, setPublishedPhotos] = useState(photos);

  const togglePublished = async (photoId) => {
    try {
      // Mettre à jour l'état de publication de la photo
      const updatedPhotos = publishedPhotos.map((photo) =>
        photo.id === photoId ? { ...photo, published: !photo.published } : photo
      );
      setPublishedPhotos(updatedPhotos);

      // Mettre à jour la base de données avec Prisma
      // await prisma.photo.update({
      //   where: { id: photoId },
      //   data: { published: !updatedPhotos.find((photo) => photo.id === photoId).published },
      // });

      console.log(`Toggle published for photo with ID ${photoId}`);
    } catch (error) {
      console.error("Une erreur est survenue lors de la mise à jour de l'état de publication :", error);
    }
  };

  return (
    <div className="pt-32 grid grid-cols-12 gap-4">
      {publishedPhotos.map((photo) => (
        <div 
        key={photo.id} 
        className="relative"
         title={`id:${photo.id}/${photo.name}/${photo.dimensions}/${photo.published}`}>
          {/* Afficher la photo */}
          <img src={photo.src} alt={photo.name} className="w-300 h-auto" />

          {/* Bouton pour basculer l'état de publication */}
          <button
            onClick={() => togglePublished(photo.id)}
            className="absolute top-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-lg"
          >
            {photo.published ? 'Publié' : 'Non publié'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
