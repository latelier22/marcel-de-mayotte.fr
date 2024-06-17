"use client";
import React, { useState } from "react";
import PhotoAlbum from "react-photo-album";
import NextJsImage from "./NextJsImage";
import useStore from '@/store/useStore'; // Import du store Zustand





export default function Gallery({ photos }) {
  const [index, setIndex] = useState(-1);
  const setMugTexture = useStore((state) => state.setMugTexture); // Accès à la fonction pour mettre à jour la texture du mug

  const handlePhotoClick = (photoId, photoSrc) => {
    // Recherche de l'index de la photo dans le tableau photos
    const photoIndex = photos.findIndex((photo) => photo.id === photoId);
    if (photoIndex !== -1) {
      setIndex(photoIndex);
      console.log(`Photo cliquée: index ${photoIndex}`);
      loadMugTexture(photoSrc); // Charger la texture du mug avec l'image correspondante
    }
  };

  const loadMugTexture = (textureSrc) => {
    // Ici, vous pouvez implémenter la logique pour charger la texture du mug avec l'image correspondante
    console.log(`Chargement de la texture du mug avec ${textureSrc}`);
    // Charger la texture du mug avec l'image de la photo cliquée

    setMugTexture(textureSrc);

  };
  // Exemple : mettre à jour l'état de la texture du mug ou effectuer toute autre action nécessaire


  return (
    <>

      <PhotoAlbum
        layout="rows"
        photos={photos}
        onClick={({ index }) => {
          // Lorsqu'un clic se produit dans PhotoAlbum, nous devons traiter l'index correctement
          const clickedPhoto = photos[index];
          handlePhotoClick(clickedPhoto.id, clickedPhoto.src); // Appeler handlePhotoClick avec l'ID et la source de la photo
        }}
        renderPhoto={(props) => (
          <NextJsImage {...props} onClick={() => handlePhotoClick(props.photo.id, props.photo.src)} />
        )}
        defaultContainerWidth={1200}
        sizes={{ size: "calc(100vw - 240px)" }}
      />
    </>
  );
}
