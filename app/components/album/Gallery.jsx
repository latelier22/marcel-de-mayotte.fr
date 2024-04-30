"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";


import Modal from "../Modals/Modal"

import {
  toggleFavorites,
  toggleRecent,
  togglePublished,
  moveToTrash,
} from "./galleryActions";

import PhotoAlbum from "react-photo-album";
import NextJsImage from "./NextJsImage";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Eye, Star, Htag, Heart } from "./icons";
import EditableButton from "./buttons/EditableButton";

import { useSelector, useDispatch } from "react-redux";

const Gallery = ({ photos }) => {
  const { data: session } = useSession(); // Récupérer les données de session
  const [favorites, setFavorites] = useState(new Set());
  const [index, setIndex] = useState(-1);
  const [publishedPhotos, setPublishedPhotos] = useState([]);

  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [titles, setTitles] = useState({});
  const inputRef = useRef(null);

  const [tagStatus, setTagStatus] = useState({});

  //
  const [allSelected, setAllSelected] = useState(false);

  // @ts-ignore
  const isVisible = useSelector((state) => state.visible.isVisible);
  // @ts-ignore
  const isReadOnly = !session || session.user.role !== "admin";
  // @ts-ignore
  const isAdmin = session && session.user.role === "admin";

  const handleSelectAll = () => {
    const allPhotoIds = photos
      .filter((photo) => isVisible || photo.published)
      .map((photo) => photo.id);
    setSelectedPhotoIds(allPhotoIds);
    setAllSelected(true); // Assurez-vous que cela reflète l'état de sélection globale
  };

  const handleDeselectAll = () => {
    setSelectedPhotoIds([]);
    setAllSelected(false); // Met à jour l'état pour refléter qu'aucune photo n'est sélectionnée
  };

  // Toggle entre sélectionner/désélectionner tous
  const toggleSelectAll = () => {
    if (allSelected) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
  };
  //

  // useMemo pour calculer localTags en fonction de la visibilité et des photos publiées
  const localTags = useMemo(() => {
    const tags = new Set();
    photos.forEach((photo) => {
      if (isVisible || photo.published) {
        photo.tags.forEach((tag) => {
          tags.add(tag.name);
        });
      }
    });
    return Array.from(tags);
  }, [photos, isVisible]);

  useEffect(() => {
    const newTagStatus = {};
    if (selectedPhotoIds.length === 0) {
      localTags.forEach((tag) => {
        newTagStatus[tag] = "bg-neutral-500";
      });
    } else {
      localTags.forEach((tag) => {
        const isTagInAll = selectedPhotoIds.every((id) =>
          photos
            .find((photo) => photo.id === id)
            ?.tags.some((t) => t.name === tag)
        );
        const isTagInSome = selectedPhotoIds.some((id) =>
          photos
            .find((photo) => photo.id === id)
            ?.tags.some((t) => t.name === tag)
        );

        newTagStatus[tag] = isTagInAll
          ? "bg-green-500"
          : isTagInSome
          ? "bg-orange-500"
          : "bg-red-500";
      });
    }
    setTagStatus(newTagStatus);
    console.log(newTagStatus); // Ajout d'un log pour le débogage
  }, [selectedPhotoIds, photos, localTags]);

  const handleTagClick = (tag) => {
    if (selectedPhotoIds.length === 0) {
      // Sélectionner toutes les photos qui ont ce tag
      const taggedPhotoIds = photos
        .filter((photo) => photo.tags.some((t) => t.name === tag))
        .map((photo) => photo.id);
      setSelectedPhotoIds(taggedPhotoIds);
    } else {
      const isTagInAll = selectedPhotoIds.every((id) =>
        photos
          .find((photo) => photo.id === id)
          ?.tags.some((t) => t.name === tag)
      );
      const isTagInSome = selectedPhotoIds.some((id) =>
        photos
          .find((photo) => photo.id === id)
          ?.tags.some((t) => t.name === tag)
      );

      // Dialog or modal logic to confirm action based on tag color status
      let message = "";
      if (isTagInAll) {
        message =
          "Voulez-vous supprimer ce tag de toutes les photos sélectionnées ?";
      } else if (isTagInSome) {
        message =
          "Ce tag est présent sur certaines des photos sélectionnées. Voulez-vous l'ajouter à toutes ou le retirer de celles qui l'ont ?";
      } else {
        // isTagInNone
        message =
          "Voulez-vous ajouter ce tag à toutes les photos sélectionnées ?";
      }

      if (window.confirm(message)) {
        // Apply or remove tags based on the user's choice
        updateTagsForSelectedPhotos(tag, isTagInAll, isTagInSome);
      }
    }
  };

  const updateTagsForSelectedPhotos = (tag, isTagInAll, isTagInSome) => {
    const updatedPhotos = photos.map((photo) => {
      if (selectedPhotoIds.includes(photo.id)) {
        if (isTagInAll) {
          // Supprimer le tag
          photo.tags = photo.tags.filter((t) => t.name !== tag);
        } else if (isTagInSome) {
          // Dialog pour choisir entre ajouter ou supprimer
          if (photo.tags.some((t) => t.name === tag)) {
            // Supprimer le tag de cette photo
            photo.tags = photo.tags.filter((t) => t.name !== tag);
          } else {
            // Ajouter le tag à cette photo
            photo.tags.push({ name: tag, id: new Date().getTime() }); // Assurez-vous d'avoir un ID unique
          }
        } else {
          // Ajouter le tag
          photo.tags.push({ name: tag, id: new Date().getTime() });
        }
      }
      return photo;
    });

    setPhotos(updatedPhotos); // Mettez à jour l'état global des photos si nécessaire
  };

  useEffect(() => {
    const initialTitles = {};
    photos.forEach((photo) => {
      if (isAdmin) {
        initialTitles[photo.id] = photo.title || photo.name;
      } else {
        initialTitles[photo.id] = photo.title || "";
      }
    });
    setTitles(initialTitles);
  }, [photos, isAdmin]);

  const handleTagButtonClick = (photoId) => {
    // Vérifier si la photo est déjà sélectionnée
    const isSelected = selectedPhotoIds.includes(photoId);

    // Crée une copie de l'état actuel
    let newSelectedPhotoIds = selectedPhotoIds.slice();

    if (isSelected) {
      // Retirer la photo de la liste des photos sélectionnées
      newSelectedPhotoIds = newSelectedPhotoIds.filter((id) => id !== photoId);
    } else {
      // Ajouter la photo à la liste des photos sélectionnées
      newSelectedPhotoIds = [...newSelectedPhotoIds, photoId];
    }

    // Mettre à jour l'état avec la nouvelle liste
    setSelectedPhotoIds(newSelectedPhotoIds);
  };

  useEffect(() => {
    // Afficher les identifiants des photos sélectionnées dans la console après mise à jour
    console.log("Selected Photo IDs:", selectedPhotoIds);
  }, [selectedPhotoIds]); // Ajouter selectedPhotoIds comme dépendance pour réagir à ses changements

  const handleTagSelection = (tagId) => {
    // Vérifier si le tag est déjà sélectionné pour cette photo
    const isSelected = selectedTags.includes(tagId);

    if (isSelected) {
      // Retirer le tag de la liste des tags sélectionnés
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      // Ajouter le tag à la liste des tags sélectionnés
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const updatePhotoTitle = async (photoId, title) => {
    try {
      const response = await fetch(`/api/updatePhotoTitle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoId, title }),
      });

      if (!response.ok) throw new Error("Failed to update photo title");
      toast.success("Titre mis à jour!");
    } catch (error) {
      console.error("Erruer lors de la mise à jour", error);
      toast.error("Failed to update title");
    }
  };

  const sortedAndFilteredPhotos = useMemo(() => {
    // Filtrer les photos selon les critères d'administration et de visibilité
    let filteredPhotos = photos;
    if (!isAdmin || !isVisible) {
      filteredPhotos = filteredPhotos.filter((photo) => photo.published);
    }

    // Trier les photos pour favoriser les favorites et les sélectionnées
    return filteredPhotos.sort((a, b) => {
      const aSelected = selectedPhotoIds.includes(a.id);
      const bSelected = selectedPhotoIds.includes(b.id);
      const aFavorite = favorites.has(a.id);
      const bFavorite = favorites.has(b.id);

      // Priorité aux favorites sélectionnées
      if (aFavorite && aSelected && !(bFavorite && bSelected)) {
        return -1;
      }
      if (bFavorite && bSelected && !(aFavorite && aSelected)) {
        return 1;
      }

      // Ensuite, autres photos sélectionnées
      if (aSelected && !bSelected) {
        return -1;
      }
      if (bSelected && !aSelected) {
        return 1;
      }

      // Ensuite, favorites non sélectionnées
      if (aFavorite && !aSelected && !(bFavorite && !bSelected)) {
        return -1;
      }
      if (bFavorite && !bSelected && !(aFavorite && !bSelected)) {
        return 1;
      }

      return 0; // Conserver l'ordre initial si toutes les conditions sont égales
    });
  }, [photos, selectedPhotoIds, favorites, isAdmin, isVisible]);

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
      if (photo.tags.some((tag) => tag.id === 70)) {
        // Vérifie si le tag avec l'ID 70 est présent
        recentPhotosSet.add(photo.id);
      }
      return recentPhotosSet;
    }, new Set());

    setRecentPhotos(initialRecentPhotos);
  }, [photos]);

  const toggleRecent = async (photoId) => {
    try {
      let isRecent = false; // Définir isRecent en dehors de la boucle map

      const updatedPhotos = publishedPhotos.map((photo) => {
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
              ? photo.tags.filter((tag) => tag.id !== 70) // Retire le tag "TABLEAUX RECENT" si la photo était récente
              : [...photo.tags, { id: 70 }], // Ajoute le tag "TABLEAUX RECENT" si la photo n'était pas récente
          };
        }
        return photo;
      });

      // Met à jour l'état des photos récentes
      setRecentPhotos(new Set(recentPhotos));

      // Appel à l'API pour mettre à jour l'état des photos récentes sur le serveur
      await updateRecentPhotosOnServer(photoId, !isRecent);
    } catch (error) {
      console.error(
        'An error occurred while updating tag "TABLEAUX RECENT":',
        error
      );
    }
  };

  const updateRecentPhotosOnServer = async (photoId, toggleRecent) => {
    try {
      const response = await fetch(`/api/toggleRecentPhotos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoId, toggleRecent }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the recent photos");
      }
    } catch (error) {
      console.error("An error occurred while updating recent photos:", error);
      toast.error("Erreur lors de la mise à jour des photos récentes.");
    }
  };

  const togglePublished = async (photoId, state) => {
    const newPhotos = publishedPhotos.map((photo) => {
      if (photo.id === photoId) {
        return { ...photo, published: !photo.published };
      }
      return photo;
    });

    setPublishedPhotos(newPhotos);

    try {
      const response = await fetch("/api/togglePublished", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoId,
          published: newPhotos.find((p) => p.id === photoId).published,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the photo");
      }
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la mise à jour de l'état de publication :",
        error
      );
    }
  };


  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');


  const handleToggleFavorites = () => {
    const selectedPhotos = photos.filter(photo => selectedPhotoIds.includes(photo.id));
    const allAreFavorites = selectedPhotos.every(photo => photo.isFavorite);
    const noneAreFavorites = selectedPhotos.every(photo => !photo.isFavorite);

console.log("allAreFavorites",allAreFavorites)


    if (allAreFavorites || noneAreFavorites) {
      // Si toutes sont favorites ou non favorites, toggle toutes
      updateFavoritesOnServer(selectedPhotoIds, !allAreFavorites, user.id);
    } else {
      // Sinon, afficher la modale pour demander ce que l'utilisateur veut faire
      setShowModal(true);
      setModalContent('Certaines photos sont des favoris tandis que d’autres ne le sont pas. Voulez-vous :');
    }
  };

  const applyFavoritesChange = (makeFavorites) => {
    updateFavoritesOnServer(selectedPhotoIds, makeFavorites, user.id);
    setShowModal(false);
  };









  const toggleFavorite = async (photoId) => {
    if (!session) {
      toast.info(
        "Veuillez vous connecter ou vous inscrire pour mémoriser vos favoris."
      );
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

    const newPhotos = publishedPhotos.map((photo) => {
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, photoId, toggleFavorite }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the favorites");
      }
    } catch (error) {
      console.error("An error occurred while updating favorites:", error);
      toast.error("Erreur lors de la mise à jour des favoris.");
    }
  };




  // Tri des photos pour mettre les sélectionnées en haut
  const sortedPhotos = useMemo(() => {
    return photos.sort((a, b) => {
      const aSelected = selectedPhotoIds.includes(a.id);
      const bSelected = selectedPhotoIds.includes(b.id);
      if (aSelected && !bSelected) {
        return -1; // a vient avant b
      } else if (!aSelected && bSelected) {
        return 1; // b vient avant a
      } else {
        return 0; // l'ordre est maintenu
      }
    });
  }, [photos, selectedPhotoIds]);

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          className="flex flex-col"
          style={{ width: "20%", padding: "10px" }}
        >
          <div className="flex flex-row justify-around ">
            <button
              className="rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <button
              className="rounded-md bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-2"
              onClick={handleDeselectAll}
            >
              Deselect All
            </button>
          </div>
          {Object.entries(tagStatus).map(([tag, color]) => (
            <button
              className={`${color}`}
              key={tag}
              style={{ margin: "5px" }}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
          <div className="flex flex-row justify-around ">
            <button 
            className="rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2"
            onClick={handleToggleFavorites}><Heart isOpen={true} /></button>
{showModal && (
        <Modal onClose={() => setShowModal(false)} title="Confirmer l'action">
          <p>{modalContent}</p>
          <button onClick={() => applyFavoritesChange(true)}>Tout mettre en favoris</button>
          <button onClick={() => applyFavoritesChange(false)}>Tout retirer des favoris</button>
          <button onClick={() => applyFavoritesChange(null)}>Toggle</button>
          <button onClick={() => setShowModal(false)}>Annuler</button>
        </Modal>
      )}
            
          </div>
        </div>
        <div style={{ width: "80%", padding: "10px" }}>
          {/* Votre contenu principal de la galerie ici */}

          <PhotoAlbum
            photos={sortedAndFilteredPhotos}
            spacing={50}
            layout="rows"
            targetRowHeight={350}
            onClick={({ index }) => setIndex(index)}
            renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => {
              // Fonction pour déterminer le style de bordure basé sur les tags et l'état de sélection
              const getBorderStyle = (photo) => {
                if (selectedPhotoIds.includes(photo.id)) {
                  return "8px solid green"; // Vert pour les photos sélectionnées
                } else {
                  // Retourner blanc ou noir basé sur la présence du tag "NOIR ET BLANC"
                  return photo.tags?.some((tag) => tag.name === "NOIR ET BLANC")
                    ? "4px solid white"
                    : "4px solid black";
                }
              };

              return (
                <>
                  <div
                    style={{
                      ...wrapperStyle,
                      border: getBorderStyle(photo), // Appliquer le style de bordure ici
                      position: "relative",
                      opacity: photo.published ? 1 : 0.2,
                    }}
                    title={photo.src}
                  >
                    <EditableButton
                      text={titles[photo.id] || ""}
                      onChange={(e) => {
                        const newTitles = {
                          ...titles,
                          [photo.id]: e.target.value,
                        };
                        setTitles(newTitles);
                      }}
                      onBlur={() =>
                        updatePhotoTitle(photo.id, titles[photo.id])
                      }
                      isEditable={!isReadOnly}
                      inputRef={inputRef}
                    />

                    {/* Icône de cœur pour marquer comme favori */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(photo.id);
                      }}
                      className={`absolute top-2 left-2`}
                    >
                        <Heart isOpen={favorites.has(photo.id)}/>
                     
                    </button>
                    {/* @ts-ignore*/}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagButtonClick(photo.id);
                        }}
                        className={`absolute bottom-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-lg`}
                      >
                        <Htag isOpen={true} />
                      </button>
                    )}

                    {/* @ts-ignore*/}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePublished(photo.id, photo.published);
                        }}
                        className={`absolute top-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-lg ${
                          photo.published ? "" : "text-red-700 font-extrabold"
                        }`}
                      >
                        <Eye isOpen={photo.published} />
                      </button>
                    )}
                    {/* @ts-ignore*/}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRecent(photo.id);
                        }}
                        className={`absolute bottom-2 left-2 bg-white text-gray-800 px-2 py-1 rounded-lg ${
                          photo.published ? "" : "text-red-700 font-extrabold"
                        }`}
                      >
                        <Star isOpen={recentPhotos.has(photo.id)} />
                      </button>
                    )}

                    {renderDefaultPhoto({ wrapped: true })}
                  </div>
                </>
              );
            }}
          />
          <Lightbox
            open={index >= 0}
            index={index}
            close={() => setIndex(-1)}
            slides={sortedAndFilteredPhotos}
            render={{ slide: NextJsImage }}
            plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
          />
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default Gallery;
