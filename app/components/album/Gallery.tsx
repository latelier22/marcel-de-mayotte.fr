"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { PrismaClient } from '@prisma/client';
import PhotoAlbum from "react-photo-album";
import NextJsImage from "./NextJsImage";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Eye from "./icons/eye"
import Star from "./icons/Star"
import { tree } from 'next/dist/build/templates/app-page';

const prisma = new PrismaClient();

const Gallery = ({ photos }) => {
  const { data: session } = useSession();  // Récupérer les données de session
  const [favorites, setFavorites] = useState(new Set());
  const [index, setIndex] = useState(-1);
  const [publishedPhotos, setPublishedPhotos] = useState([]);

  // Filtre les photos en fonction de la session.
  useEffect(() => {
    if (session) {
      setPublishedPhotos(photos);
    } else {
      const filteredPublishedPhotos = photos.filter(photo => photo.published);
      setPublishedPhotos(filteredPublishedPhotos);
    }
  }, [session, photos]);

  // Initialiser l'état 'favorites' avec les favoris de l'objet 'photos'
  useEffect(() => {
    const initialFavorites = photos.reduce((favoritesSet, photo) => {
      if (photo.isFavorite) {
        favoritesSet.add(photo.id);
      }
      return favoritesSet;
    }, new Set());

    setFavorites(initialFavorites);
  }, [photos]);


  // Dans votre composant Gallery

  const [recentPhotos, setRecentPhotos] = useState(new Set());

  useEffect(() => {
    const initialRecentPhotos = photos.reduce((recentPhotosSet, photo) => {
      if (photo.tags.some(tag => tag.id === 70)) { // Vérifie si le tag avec l'ID 70 est présent
        recentPhotosSet.add(photo.id);
      }
      return recentPhotosSet;
    }, new Set());

    setRecentPhotos(initialRecentPhotos);
  }, [photos]);

  const toggleRecent = async (photoId) => {
    try {
      let isRecent = false; // Définir isRecent en dehors de la boucle map
  
      const updatedPhotos = publishedPhotos.map(photo => {
        if (photo.id === photoId) {
          // Vérifie si la photo est déjà marquée comme récente
          isRecent = recentPhotos.has(photoId);
  
          // Met à jour l'ensemble des photos récentes
          if (isRecent) {
            recentPhotos.delete(photoId); // Retire la photo des photos récentes
          } else {
            recentPhotos.add(photoId); // Ajoute la photo aux photos récentes
          }
  
          // Met à jour les tags de la photo en fonction de son statut récent
          return {
            ...photo,
            tags: isRecent
              ? photo.tags.filter(tag => tag.id !== 70) // Retire le tag "TABLEAUX RECENT" si la photo était récente
              : [...photo.tags, { id: 70 }] // Ajoute le tag "TABLEAUX RECENT" si la photo n'était pas récente
          };
        }
        return photo;
      });
  
      // Met à jour l'état des photos récentes
      setRecentPhotos(new Set(recentPhotos));
  
      // Appel à l'API pour mettre à jour l'état des photos récentes sur le serveur
      await updateRecentPhotosOnServer(photoId, !isRecent);
  
      console.log('Tag "TABLEAUX RECENT" updated successfully');
    } catch (error) {
      console.error('An error occurred while updating tag "TABLEAUX RECENT":', error);
    }
  };
  
  const updateRecentPhotosOnServer = async (photoId, toggleRecent) => {
    try {
      const response = await fetch(`/api/toggleRecentPhotos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoId, toggleRecent }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update the recent photos');
      }
    } catch (error) {
      console.error("An error occurred while updating recent photos:", error);
      toast.error("Erreur lors de la mise à jour des photos récentes.");
    }
  };
  
  const togglePublished = async (photoId, state) => {
    console.log(photoId, state)
    const newPhotos = publishedPhotos.map(photo => {
      if (photo.id === photoId) {
        return { ...photo, published: !photo.published };
      }
      return photo;
    });

    setPublishedPhotos(newPhotos);

    try {
      const response = await fetch('/api/togglePublished', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoId, published: newPhotos.find(p => p.id === photoId).published }),
      });

      if (!response.ok) {
        throw new Error('Failed to update the photo');
      }
    } catch (error) {
      console.error("Une erreur est survenue lors de la mise à jour de l'état de publication :", error);
    }
  };

  const toggleFavorite = async (photoId) => {
    if (!session) {
      toast.info("Veuillez vous connecter ou vous inscrire pour mémoriser vos favoris.");
      return;
    }

    const isFavorited = favorites.has(photoId);
    const newFavorites = new Set(favorites);
    if (isFavorited) {
      newFavorites.delete(photoId);
    } else {
      newFavorites.add(photoId);
    }

    setFavorites(newFavorites);
    updateFavoritesOnServer(photoId, !isFavorited, session.user.id);

    const newPhotos = publishedPhotos.map(photo => {
      if (photo.id === photoId) {
        return { ...photo, isFavorite: !isFavorited };
      }
      return photo;
    });
    setPublishedPhotos(newPhotos);
  };

  const updateFavoritesOnServer = async (photoId, toggleFavorite, userId) => {
    try {
      const response = await fetch(`/api/updateFavorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, photoId, toggleFavorite })
      });

      if (!response.ok) {
        throw new Error('Failed to update the favorites');
      }
    } catch (error) {
      console.error("An error occurred while updating favorites:", error);
      toast.error("Erreur lors de la mise à jour des favoris.");
    }
  };

  return (
    <div>
      <PhotoAlbum
        photos={publishedPhotos}
        spacing={50}
        layout="rows"
        targetRowHeight={350}
        onClick={({ index }) => setIndex(index)}
        renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => {
          const hasBlackAndWhiteTag = photo.tags?.includes("NOIR ET BLANC");
          const borderStyle = hasBlackAndWhiteTag ? "4px solid white" : "4px solid black";

          return (
            <div style={{
              ...wrapperStyle,
              border: borderStyle,
              position: 'relative',
              opacity: photo.published ? 1 : 0.2 // Appliquer l'opacité selon l'état 'published'
            }} title={photo.src}>
              {/* Icône de cœur pour marquer comme favori */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(photo.id);
                }}
                className={`absolute top-2 left-2`}
              >
                {favorites.has(photo.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" stroke="black" viewBox="0 0 24 24">
                    <path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="grey" stroke="red" viewBox="0 0 24 24">
                    <path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z" />
                  </svg>
                )}
              </button>

              {/* Bouton Publier/Non publié, visible seulement si la session existe */}
              {session && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePublished(photo.id, photo.published);
                  }}
                  className={`absolute top-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-lg ${photo.published ? "" : 'text-red-700 font-extrabold'}`}
                >
                  <Eye isOpen={photo.published} />
                </button>
              )}
              {/* Afficher l'icône d'étoile et gérer le clic */}
              {session && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRecent(photo.id);
                  }}
                  className={`absolute bottom-2 left-2 bg-white text-gray-800 px-2 py-1 rounded-lg ${photo.published ? "" : 'text-red-700 font-extrabold'}`}
                >
                  <Star isOpen={recentPhotos.has(photo.id)} />
                </button>
              )}
              {renderDefaultPhoto({ wrapped: true })}
            </div>
          );
        }}
      />
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={publishedPhotos}
        render={{ slide: NextJsImage }}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
      <ToastContainer />
    </div>
  );
};

export default Gallery;
