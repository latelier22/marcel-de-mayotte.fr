"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";

import FavoriteModal from "../Modals/Modal";
import TagModal from "../Modals/Modal";
import RecentsModal from "../Modals/Modal";
import PublishedModal from "../Modals/Modal";
import TagCrudModal from "../Modals/Modal";
import getSlug from "../getSlug";

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

import { Eye, Star, Htag, Heart, Trash } from "./icons";
import EditableButton from "./buttons/EditableButton";

import { useSelector } from "react-redux";

import myFetch from "../../components/myFetch";

const Gallery = ({ photos : initialPhotos, allTags }) => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState(new Set());
  const [index, setIndex] = useState(-1);
  const [publishedPhotos, setPublishedPhotos] = useState([]);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [titles, setTitles] = useState({});
  const inputRef = useRef(null);
  const [tagStatus, setTagStatus] = useState({});
  const [allSelected, setAllSelected] = useState(false);
  const [lastSelection, setLastSelection] = useState([]);
  const [photos, setPhotos] = useState(initialPhotos);
  const [allMyTags, setAllMyTags] = useState(allTags);
  const [selectedTag, setSelectedTag] = useState("");
  const [showTagModal, setShowTagModal] = useState(false);
  const [showRecentsModal, setShowRecentsModal] = useState(false);
  const [showPublishedModal, setShowPublishedModal] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [showTagCrudModal, setShowTagCrudModal] = useState(false);
  const isVisible = useSelector((state) => state.visible.isVisible);
  const isShowAdmin = useSelector((state) => state.showAdmin.isShowAdmin);
  const isReadOnly = !session || session.user.role !== "admin";
  const isAdmin = session && session.user.role === "admin";
  const isActive = !isAdmin || (isAdmin && !isShowAdmin);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const [zoomGallery, setZoomGallery] = useState(350);
  const [tagName, setTagName] = useState("");
  const [tagAction, setTagAction] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [unusedTags, setUnusedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [photosPerPage, setPhotosPerPage] = useState(25);
  const [recentPhotos, setRecentPhotos] = useState(new Set());

  const handleRestoreSelection = () => {
    setSelectedPhotoIds(lastSelection);
    setAllSelected(lastSelection.length === photos.length);
  };

  const handleSelectAll = () => {
    const allPhotoIds = photos.filter((photo) => isVisible || photo.published).map((photo) => photo.id);
    setSelectedPhotoIds(allPhotoIds);
    setAllSelected(true);
  };

  const handleDeselectAll = () => {
    setLastSelection(selectedPhotoIds);
    setSelectedPhotoIds([]);
    setAllSelected(false);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
  };

  useEffect(() => {
    if (!isShowAdmin) {
      setIndex(-1);
      handleDeselectAll();
    } else {
      handleRestoreSelection();
    }
  }, [isShowAdmin]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSelectedPhotoIds([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const usedTags = new Set();
    photos.forEach((photo) => {
      photo.tags.forEach((tag) => {
        usedTags.add(tag.name);
      });
    });

    const newUnusedTags = allMyTags.filter((tag) => !usedTags.has(tag.name)).map((tag) => tag.name).sort();
    setUnusedTags(newUnusedTags);
  }, [allMyTags, photos, isShowAdmin]);

  const isTagNameExist = (tagName) => {
    return allMyTags.some((tag) => tag.name === tagName);
  };

  const handleAddTag = async (tagName) => {
    const trimmedTagName = tagName.trim();
    if (trimmedTagName && !isTagNameExist(trimmedTagName)) {
      const tagSlug = getSlug(trimmedTagName);
      try {
        const createdTag = await createTag(trimmedTagName, tagSlug);
        setAllMyTags((prevTags) => [...prevTags, { ...createdTag, count: 0, mainTag: false, present: false, url: `generated-url-for-${trimmedTagName}` }]);
        // toast.success(`Tag "${trimmedTagName}" added successfully!`);

        // Update selected photos with the new tag if there are any selected
        if (selectedPhotoIds.length > 0) {
          await updateTagInBulk(true, createdTag.name);
        }
      } catch (error) {
        console.error("Failed to create tag:", error);
        // toast.error(`Failed to add tag: ${error.message}`)
      }
    } else {
      // toast.error("This tag already exists or invalid tag name!");
    }
  };

  async function createTag(tagName, tagSlug) {
    try {
      const response = await fetch("/api/createTag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagName, tagSlug }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  }

  const deleteTag = async (tagName) => {
    try {
      const response = await fetch("/api/deleteTag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newTags = allMyTags.filter((tag) => tag.name !== tagName);
      setAllMyTags(newTags);
      // toast.success(`Tag "${tagName}" removed successfully!`);
    } catch (error) {
      console.error("Error deleting tag:", error);
      // toast.error(`Failed to delete tag: ${error.message}`);
    }
  };

  const handleDeleteTag = (tagName) => {
    if (allMyTags.some((tag) => tag.name === tagName)) {
      deleteTag(tagName);
    } else {
      // toast.error("Tag does not exist!");
    }
  };

  const handleEditTag = async (oldTagName, newTagName) => {
    oldTagName = oldTagName.trim();
    newTagName = newTagName.trim();

    if (!isTagNameExist(oldTagName)) {
      // toast.error("Original tag does not exist.");
      return;
    }

    if (oldTagName === newTagName) {
      // toast.info("No changes detected.");
      return;
    }

    try {
      const response = await fetch("/api/editTag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldTagName, newTagName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        const newTags = allMyTags.map((tag) => (tag.name === oldTagName ? { ...tag, name: newTagName } : tag));
        setAllMyTags(newTags);
        // toast.success(`Tag "${oldTagName}" updated to "${newTagName}" successfully!`);
      } else {
        // toast.error(result.message);
      }
    } catch (error) {
      console.error("Failed to update the tag:", error);
      // toast.error(`Error updating tag: ${error.message}`);
    }
  };

  const openModal = (action) => {
    setTagAction(action);
    setShowTagCrudModal(true);
  };

  const closeModal = () => {
    setShowTagCrudModal(false);
  };

  const numberOfPublishedPhotos = useMemo(() => {
    return photos.filter((photo) => photo.published).length;
  }, [photos]);

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

  const tagCounts = useMemo(() => {
    const counts = {};
    const selectedCounts = {};

    photos.forEach((photo) => {
      photo.tags.forEach((tag) => {
        if (typeof tag === "object") {
          tag = tag.name;
        }
        counts[tag] = counts[tag] ? counts[tag] + 1 : 1;
      });
    });

    photos.forEach((photo) => {
      if (selectedPhotoIds.includes(photo.id)) {
        photo.tags.forEach((tag) => {
          if (typeof tag === "object") {
            tag = tag.name;
          }
          selectedCounts[tag] = selectedCounts[tag] ? selectedCounts[tag] + 1 : 1;
        });
      }
    });

    return { counts, selectedCounts };
  }, [photos, selectedPhotoIds]);

  useEffect(() => {
    const newTagStatus = {};
    if (selectedPhotoIds.length === 0) {
      localTags.forEach((tag) => {
        newTagStatus[tag] = "bg-neutral-500";
      });
    } else {
      localTags.forEach((tag) => {
        const isTagInAll = selectedPhotoIds.every((id) => photos.find((photo) => photo.id === id)?.tags.some((t) => t.name === tag));
        const isTagInSome = selectedPhotoIds.some((id) => photos.find((photo) => photo.id === id)?.tags.some((t) => t.name === tag));

        newTagStatus[tag] = isTagInAll ? "bg-green-500" : isTagInSome ? "bg-orange-500" : "bg-red-500";
      });
    }
    setTagStatus(newTagStatus);
    console.log(newTagStatus);
  }, [selectedPhotoIds, photos, localTags]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setTagName(tag);
    console.log(selectedTag);
    if (selectedPhotoIds.length === 0) {
      const taggedPhotoIds = photos.filter((photo) => photo.tags.some((t) => t.name === tag)).map((photo) => photo.id);
      setSelectedPhotoIds(taggedPhotoIds);
    } else {
      const isTagInAll = selectedPhotoIds.every((id) => photos.find((photo) => photo.id === id)?.tags.some((t) => t.name === tag));
      const isTagInSome = selectedPhotoIds.some((id) => photos.find((photo) => photo.id === id)?.tags.some((t) => t.name === tag));

      let modalTagContent;
      if (isTagInAll) {
        modalTagContent = "Voulez-vous supprimer ce tag de toutes les photos sélectionnées ?";
      } else if (isTagInSome) {
        modalTagContent = "Ce tag est présent sur certaines des photos sélectionnées. Voulez-vous l'ajouter à toutes ou le retirer de celles qui l'ont ?";
      } else {
        modalTagContent = "Voulez-vous ajouter ce tag à toutes les photos sélectionnées ?";
      }

      setModalContent(modalTagContent);
      setShowTagModal(true);
    }
  };

  const updateTagInBulk = async (addTag, tag) => {
    const updatedPhotos = photos.map((photo) => {
      if (selectedPhotoIds.includes(photo.id) && !photo.tags.find((t) => t.name === tag)) {
        return { ...photo, tags: [...photo.tags, { name: tag, id: Date.now() }] };
      }
      return photo;
    });

    setPhotos(updatedPhotos);

    try {
      const response = await fetch(`/api/updateTagInBulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedPhotoIds, selectedTag: tag, addTag }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tags on the server");
      }
      // toast.success("Tags updated successfully!");
    } catch (error) {
      console.error("Failed to update tags:", error);
      // toast.error("Error updating tags.");
    }
  };

  const applyTagChange = (addTag) => {
    updateTagInBulk(addTag, selectedTag);
    setShowTagModal(false);
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

  const handleDeleteButtonClick = async (photoId) => {
    try {
      // Vérifier si la photo est importée
      const strapiResponse = await myFetch(`/api/pictures?filters[photoId][$eq]=${photoId}`, 'GET', null, 'photo import status');
      const picture = strapiResponse.data[0]; // On suppose qu'il n'y a qu'une seule photo avec cet ID
  
      // Si la photo est importée, mettre à jour son état pour refléter qu'elle n'est plus importée
      if (picture && picture.attributes.imported) {
        await myFetch(`/api/pictures/${picture.id}`, 'PUT', {
          data: {
            imported: false,
          },
        }, 'update photo import status');
      }
  
      // Supprimer la photo
      const response = await fetch(`/api/deletePhoto`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoId }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete the photo");
      }
  
      // Mettre à jour l'état des photos après suppression
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== photoId));
      // toast.success("Photo deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete photo");
    }
  };

  const handlePhotoClick = (e, photoId) => {
    if (isShowAdmin && isAdmin) {
      e.stopPropagation();
      handleTagButtonClick(photoId);
    }
  };

  const handleTagButtonClick = (photoId) => {

    photos.forEach((photo) => {
      if (selectedPhotoIds.includes(photo.id)) {
       console.log(photo.tags)
      }
    });

    const isSelected = selectedPhotoIds.includes(photoId);
    let newSelectedPhotoIds = selectedPhotoIds.slice();

    if (isSelected) {
      newSelectedPhotoIds = newSelectedPhotoIds.filter((id) => id !== photoId);
    } else {
      newSelectedPhotoIds = [...newSelectedPhotoIds, photoId];
    }

    setSelectedPhotoIds(newSelectedPhotoIds);
  };

  useEffect(() => {
    console.log("Selected Photo IDs:", selectedPhotoIds);
    
  }, [selectedPhotoIds]);

  const handleTagSelection = (tagId) => {
    const isSelected = selectedTags.includes(tagId);

    if (isSelected) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
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
      // toast.success("Titre mis à jour!");
    } catch (error) {
      console.error("Erruer lors de la mise à jour", error);
      // toast.error("Failed to update title");
    }
  };

  function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  const sortedAndFilteredPhotos = useMemo(() => {
    let filteredPhotos = photos;

    if (!isAdmin || !isVisible) {
      filteredPhotos = filteredPhotos.filter((photo) => photo.published);
    }

    if (searchTerm) {
      const normalizedSearchTerm = normalizeString(searchTerm);
      filteredPhotos = filteredPhotos.filter(
        (photo) =>
          normalizeString(photo.title || "").includes(normalizedSearchTerm) ||
          normalizeString(photo.name || "").includes(normalizedSearchTerm) ||
          photo.tags?.some((tag) => normalizeString(tag.name).includes(normalizedSearchTerm))
      );
    }

    return filteredPhotos.sort((a, b) => {
      const aFavorite = favorites.has(a.id);
      const bFavorite = favorites.has(b.id);
      if (aFavorite && !bFavorite) {
        return -1;
      } else if (!aFavorite && bFavorite) {
        return 1;
      }
      return 0;
    });
  }, [photos, favorites, isAdmin, isVisible, searchTerm]);

  useEffect(() => {
    const initialFavorites = photos.reduce((favoritesSet, photo) => {
      if (photo.isFavorite) {
        favoritesSet.add(photo.id);
      }
      return favoritesSet;
    }, new Set());

    setFavorites(initialFavorites);
  }, [photos]);

  const paginatedPhotos = useMemo(() => {
    const startIndex = (currentPage - 1) * photosPerPage;
    const endIndex = startIndex + photosPerPage;
    return sortedAndFilteredPhotos.slice(startIndex, endIndex);
  }, [currentPage, photosPerPage, sortedAndFilteredPhotos]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedAndFilteredPhotos.length / photosPerPage);
  }, [photosPerPage, sortedAndFilteredPhotos]);

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const changePhotosPerPage = (number) => {
    setPhotosPerPage(number);
    setCurrentPage(1);
  };

  useEffect(() => {
    const initialRecentPhotos = photos.reduce((recentPhotosSet, photo) => {
      if (photo.tags.some((tag) => tag.id === 70)) {
        recentPhotosSet.add(photo.id);
      }
      return recentPhotosSet;
    }, new Set());

    setRecentPhotos(initialRecentPhotos);
  }, [photos]);

  const toggleRecent = async (photoId) => {
    try {
      let isRecent = recentPhotos.has(photoId);

      const updatedPhotos = publishedPhotos.map((photo) => {
        if (photo.id === photoId) {
          const updatedTags = isRecent ? photo.tags.filter((tag) => tag.id !== 70) : [...photo.tags, { id: 70, name: "TABLEAUX RECENTS" }];

          return { ...photo, tags: updatedTags };
        }
        return photo;
      });

      setPublishedPhotos(updatedPhotos);

      if (isRecent) {
        recentPhotos.delete(photoId);
      } else {
        recentPhotos.add(photoId);
      }
      setRecentPhotos(new Set(recentPhotos));

      const response = await fetch(`/api/toggleRecentPhotos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoId, toggleRecent: !isRecent }),
      });

      if (response.ok) {
        if (isRecent) {
          const remainingPhotos = updatedPhotos.filter((photo) => photo.tags.some((tag) => tag.id === 70));
          setPublishedPhotos(remainingPhotos);
        }
        // toast.success("Mise à jour réussie!");
      } else {
        // throw new Error("Failed to update the photo tags");
      }
    } catch (error) {
      console.error("Failed to toggle recent tag:", error);
      // toast.error("Erreur lors de la mise à jour des photos récentes.");
    }
  };

  const togglePublished = async (photoId, published) => {


    console.log( "tog pub : ",photoId, published, paginatedPhotos)

    const newPhotos = photos.map((photo) => {
      if (photo.id === photoId) {
        return { ...photo, published: !photo.published };
      }
      return photo;
    });

    console.log("recheche photo par id ", newPhotos.filter( (p) => p.id === photoId))

    setPhotos(newPhotos);

    const targetPhoto = newPhotos.find((p) => p.id === photoId);
    if (!targetPhoto) {
      console.error("No photo found with the ID:", photoId);
      return;
    }

    try {
      const response = await fetch("/api/togglePublished", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoId, published: targetPhoto.published }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the photo");
      }
    } catch (error) {
      console.error("Error updating publication state:", error);
    }
  };

  const handleTogglePublisheds = () => {
    const selectedPhotos = photos.filter((photo) => selectedPhotoIds.includes(photo.id));

    selectedPhotos.map((photo) => console.log(photo.id));

    setShowPublishedModal(true);
    setModalContent("Que voulez-vous faire? :");
  };

  const applyPublishedsChange = (makePublished) => {
    updatePublishedsInBulk(selectedPhotoIds, makePublished);
    setShowPublishedModal(false);
  };

  const updatePublishedsInBulk = async (selectedPhotoIds, makePublished) => {
    // Mettre à jour l'état local avant l'appel à l'API pour un retour visuel rapide
    const newPhotos = photos.map((photo) => {
      if (selectedPhotoIds.includes(photo.id)) {
        return { ...photo, published: makePublished };
      }
      return photo;
    });
  
    setPhotos(newPhotos);
  
    try {
      const response = await fetch(`/api/updatePublishedsBulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedPhotoIds, makePublished }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update Published in bulk");
      }
  
      toast.success("Published updated successfully in bulk!");
    } catch (error) {
      console.error("An error occurred while updating Published in bulk:", error);
      toast.error("Erreur lors de la mise à jour des Images publiées en masse.");
      // Revert local state in case of error
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          selectedPhotoIds.includes(photo.id) ? { ...photo, published: !makePublished } : photo
        )
      );
    }
  };
  

  const handleToggleRecents = () => {
    const selectedPhotos = photos.filter((photo) => selectedPhotoIds.includes(photo.id));

    selectedPhotos.map((photo) => console.log(photo.id));

    setShowRecentsModal(true);
    setModalContent("Que voulez-vous faire? :");
  };

  const applyRecentsChange = (makeRecents) => {
    const tagName = "TABLEAUX RECENTS";
    updateRecentsInBulk(selectedPhotoIds, makeRecents, tagName);
    setShowRecentsModal(false);
  };

  const updateRecentsInBulk = async (selectedPhotoIds, addTag, tagName) => {
    const updatedPhotos = photos.map((photo) => {
      if (selectedPhotoIds.includes(photo.id) && !photo.tags.find((t) => t.name === tagName)) {
        return { ...photo, tags: [...photo.tags, { name: tagName, id: Date.now() }] };
      }
      return photo;
    });

    setPhotos(updatedPhotos);

    try {
      const response = await fetch(`/api/updateTagInBulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedPhotoIds, selectedTag: tagName, addTag }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tags on the server");
      }
      // toast.success("Tags updated successfully!");
    } catch (error) {
      console.error("Failed to update tags:", error);
      // toast.error("Error updating tags.");
    }
  };

  const handleToggleFavorites = () => {
    const selectedPhotos = photos.filter((photo) => selectedPhotoIds.includes(photo.id));

    selectedPhotos.map((photo) => console.log(photo.id, photo.isFavorite));

    setShowFavoriteModal(true);
    setModalContent("Que voulez-vous faire? :");
  };

  const applyFavoritesChange = (makeFavorites) => {
    updateFavoritesInBulk(selectedPhotoIds, makeFavorites);
    setShowFavoriteModal(false);
  };

  const updateFavoritesInBulk = async (selectedPhotoIds, makeFavorite) => {
    try {
      const response = await fetch(`/api/updateFavoritesBulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id, selectedPhotoIds, makeFavorite }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorites in bulk");
      }
      // toast.success("Favorites updated successfully in bulk!");

      const newPhotos = photos.map((photo) => {
        if (selectedPhotoIds.includes(photo.id)) {
          return { ...photo, isFavorite: makeFavorite };
        }
        return photo;
      });
      setPhotos(newPhotos);

      const newFavorites = new Set(favorites);
      selectedPhotoIds.forEach((photoId) => {
        if (makeFavorite) {
          newFavorites.add(photoId);
        } else {
          newFavorites.delete(photoId);
        }
      });
      setFavorites(newFavorites);
    } catch (error) {
      console.error("An error occurred while updating favorites in bulk:", error);
      // toast.error("Erreur lors de la mise à jour des favoris en masse.");
    }
  };

  const toggleFavorite = async (photoId) => {
    if (!session) {
      // toast.info("Veuillez vous connecter ou vous inscrire pour mémoriser vos favoris.");
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
    updateFavoriteOnServer(photoId, !isFavorited, session.user.id);

    const newPhotos = publishedPhotos.map((photo) => {
      if (photo.id === photoId) {
        return { ...photo, isFavorite: !isFavorited };
      }
      return photo;
    });
    setPublishedPhotos(newPhotos);
  };

  const updateFavoriteOnServer = async (photoId, toggleFavorite, userId) => {
    console.log("updateFavoritesOnServer", photoId, toggleFavorite, userId);
    try {
      const response = await fetch(`/api/updateFavorite`, {
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
      // toast.error("Erreur lors de la mise à jour des favoris.");
    }
  };

  return (
    <>
      <div ref={containerRef} className="z-[2]" style={{ display: "flex" }}>
        {isAdmin && isShowAdmin && (
          <div className="flex flex-col pt-16 px-16 text-white bg-neutral-600 top-0 h-screen max-h-full overflow-y-auto " style={{ width: "20%" }}>
            <div className="flex flex-row justify-around ">
              <button className="rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2" onClick={handleSelectAll}>
                Select All ({numberOfPublishedPhotos})
              </button>
              <button className="rounded-md bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-2" onClick={handleDeselectAll}>
                Deselect All ({selectedPhotoIds.length})
              </button>
              <button onClick={handleRestoreSelection} className={`rounded-md text-white font-bold py-2 px-4 m-2 ${!lastSelection.length ? "bg-neutral-200 hover:bg-neutral-200" : "bg-green-700 hover:bg-green-500 text-black"}`} disabled={!lastSelection.length}>
                Restaurer la sélection ({lastSelection.length})
              </button>
            </div>
            {Object.entries(tagStatus).map(([tag, color]) => (
              <button className={`${color} `} key={tag} style={{ margin: "5px" }} onClick={() => handleTagClick(tag)}>
                <div className="flex items-center justify-between flex-wrap py-2 px-4">
                  <div className="flex-wrap text-center">{tag}</div>
                  <div className="flex-none">{tagCounts.selectedCounts[tag] || 0} / {tagCounts.counts[tag] || 0}</div>
                </div>
              </button>
            ))}

            <div className="flex flex-row justify-around ">
              <div>
                <div className="flex-flex-row">
                  <button className="rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2" onClick={handleToggleFavorites}>
                    <Heart isOpen={true} />
                  </button>
                  <button className="rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2" onClick={handleToggleRecents}>
                    <Star isOpen={true} />
                  </button>
                  <button className="rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2" onClick={handleTogglePublisheds}>
                    <Eye isOpen={true} />
                  </button>
                </div>

                <div style={{ margin: "20px 0" }}>
                  <input type="text" placeholder="Enter tag name" value={tagName} onChange={(e) => setTagName(e.target.value)} className="input-tag-name text-black p-4" />
                  <button
                    onClick={() => openModal("add")}
                    disabled={!tagName.trim() || isTagNameExist(tagName)}
                    className={`rounded-md ${!tagName.trim() || isTagNameExist(tagName) ? `bg-green-700` : `bg-green-500  hover:bg-green-300`}  text-white font-bold py-2 px-4 m-2`}
                    title={!tagName.trim() ? "Entrez un nom pour un nouveau tag." : allMyTags.some((tag) => tag.name === tagName) ? "Ce tag existe déjà!" : "Ajouter un tag"}
                  >
                    Add Tag
                  </button>

                  <button
                    onClick={() => openModal("delete")}
                    disabled={!tagName.trim() || !isTagNameExist(tagName)}
                    className="rounded-md bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-2"
                    title={!tagName.trim() ? "Entrez le nom du tag à supprimer." : !tagName.trim() || !isTagNameExist(tagName) ? "Ce tag n'existe pas!" : "Supprimer un tag"}
                  >
                    Delete Tag
                  </button>

                  <button
                    onClick={() => openModal("edit")}
                    disabled={!tagName.trim() || !isTagNameExist(tagName)}
                    className="rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2"
                    title={!tagName.trim() ? "Entrez le nom du tag à éditer." : !tagName.trim() || !isTagNameExist(tagName) ? "Ce tag n'existe pas!" : "Éditer un tag"}
                  >
                    Edit Tag
                  </button>
                </div>

                <TagCrudModal isOpen={showTagCrudModal} onClose={() => setShowTagCrudModal(false)} title={`${tagAction.charAt(0).toUpperCase() + tagAction.slice(1)} Tag`}>
                  <p className="p-8">Are you sure you want to {tagAction} the tag &quot;{tagName}&quot;?</p>
                  {tagAction === "add" && (
                    <button
                      className="bg-lime-600 rounded-md p-2 m-4 items-end"
                      onClick={() => {
                        closeModal();
                        handleAddTag(tagName);
                      }}
                    >
                      Confirm Add
                    </button>
                  )}

                  {tagAction === "delete" && (
                    <button
                      className="bg-lime-600 rounded-md p-2 m-4 items-end"
                      onClick={() => {
                        closeModal();
                        handleDeleteTag(tagName);
                      }}
                    >
                      Confirm Delete
                    </button>
                  )}

                  {tagAction === "edit" && (
                    <>
                      <input type="text" placeholder="New tag name" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} />
                      <button
                        className="bg-lime-600 rounded-md p-2 m-4 items-end"
                        onClick={() => {
                          handleEditTag(tagName, newTagName);
                          closeModal();
                        }}
                      >
                        Confirm Edit
                      </button>
                    </>
                  )}
                </TagCrudModal>

                <div>
                  <h4 className="text-lg text-center font-semibold">Autres Tags</h4>
                  <div className="mt-4 flex flex-wrap">
                    {unusedTags.map((tag) => (
                      <button className="flex items-center flex-wrap py-2 px-4 rounded-md text-gray-800 bg-white hover:bg-gray-100 m-2" key={tag} onClick={() => handleTagClick(tag)}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <PublishedModal isOpen={showPublishedModal} onClose={() => setShowPublishedModal(false)} title="Modification des Images publiées">
                <p>{modalContent}</p>
                <button className="bg-neutral-300 rounded-md p-4 m-2" onClick={() => applyPublishedsChange(true)}>
                  Ajouter la sélection aux Images publiées
                </button>
                <button className="bg-neutral-300 rounded-md p-4 m-2" onClick={() => applyPublishedsChange(false)}>
                  Retirer la sélection des Images publiées
                </button>
              </PublishedModal>
              <RecentsModal isOpen={showRecentsModal} onClose={() => setShowRecentsModal(false)} title="Modification des Récents">
                <p>{modalContent}</p>
                <button className="bg-neutral-300 rounded-md p-4 m-2" onClick={() => applyRecentsChange(true)}>
                  Ajouter la sélection aux Récents
                </button>
                <button className="bg-neutral-300 rounded-md p-4 m-2" onClick={() => applyRecentsChange(false)}>
                  Retirer la sélection des Récents
                </button>
              </RecentsModal>
              <FavoriteModal isOpen={showFavoriteModal} onClose={() => setShowFavoriteModal(false)} title="Modification des Favoris">
                <p>{modalContent}</p>
                <button className="bg-neutral-300 rounded-md p-4 m-2" onClick={() => applyFavoritesChange(true)}>
                  Ajouter la sélection aux favoris
                </button>
                <button className="bg-neutral-300 rounded-md p-4 m-2" onClick={() => applyFavoritesChange(false)}>
                  Retirer la sélection des favoris
                </button>
              </FavoriteModal>
              <TagModal isOpen={showTagModal} onClose={() => setShowTagModal(false)} title="Modification des Tags">
                <p>{modalContent}</p>
                <button className="bg-neutral-300 rounded-md p-4 m-2" onClick={() => applyTagChange(true)}>
                  Ajouter ce tag à la sélection
                </button>
                <button className="bg-neutral-300 rounded-md p-4 m-2" onClick={() => applyTagChange(false)}>
                  Retirer ce tag de la sélection
                </button>
              </TagModal>

              <div>
                <ToastContainer position="top-center" autoClose={5000} />
              </div>
            </div>
          </div>
        )}
        <div style={{ width: isAdmin && isShowAdmin ? "80%" : "100%", padding: "10px" }}>
          <div className="left-12 top-2 w-full">
            <input className="text-black w-full text-bold text-2xl text-center" type="textarea" placeholder="Recherche par mot (titre, nom d'image, tag...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="flex flex-row justify-center items-center gap-8 p-2 my-4 bg-neutral-700 rounded-md border border-white relative">
            <button className={`p-2 rounded-sm ${currentPage === 1 ? "bg-neutral-500 text-neutral-700" : "bg-neutral-700 text-white"}`} onClick={goToPreviousPage} disabled={currentPage === 1}>
              Page Précédente
            </button>
            <span>Page {currentPage} / {totalPages}</span>
            <span>
              <label className="mr-2 text-white">Photos per page:</label>
              <select className="p-1 text-xl font-bold text-black bg-white" onChange={(e) => changePhotosPerPage(Number(e.target.value))} value={photosPerPage}>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={sortedAndFilteredPhotos.length}>TOUS ({sortedAndFilteredPhotos.length})</option>
              </select>
            </span>
            <button className="p-2 rounded-sm bg-neutral-700 text-white" onClick={goToNextPage} disabled={currentPage === totalPages}>
              Page Suivante
            </button>
            <button className="p-2 rounded-sm bg-neutral-700 text-white" onClick={() => setZoomGallery(zoomGallery + 50)}>
              ZOOM IN
            </button>
            <button className="p-2 rounded-sm bg-neutral-700 text-white" onClick={() => setZoomGallery(zoomGallery - 50)}>
              ZOOM OUT
            </button>
          </div>

          <PhotoAlbum
            photos={paginatedPhotos}
            spacing={zoomGallery / 7}
            layout="rows"
            targetRowHeight={zoomGallery}
            onClick={({ index }) => setIndex(index)}
            renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => {
              const getBorderStyle = (photo) => {
                if (selectedPhotoIds.includes(photo.id)) {
                  return "8px solid green";
                } else {
                  return photo.tags?.some((tag) => tag.name === "NOIR ET BLANC") ? "4px solid white" : "4px solid black";
                }
              };

              return (
                <>
                  <div onClick={(e) => handlePhotoClick(e, photo.id)} style={{ ...wrapperStyle, border: getBorderStyle(photo), position: "relative", opacity: photo.published ? 1 : 0.2,maxWidth: "33.33%", }
                }
                className="mb-4"
                 title={photo.src}>
                    {zoomGallery >= 200 && (
                      <EditableButton
                        text={titles[photo.id] || ""}
                        onChange={(e) => {
                          const newTitles = { ...titles, [photo.id]: e.target.value };
                          setTitles(newTitles);
                        }}
                        onBlur={() => updatePhotoTitle(photo.id, titles[photo.id])}
                        isEditable={!isReadOnly}
                        inputRef={inputRef}
                      />
                    )}
                    {zoomGallery >= 200 && (
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(photo.id); }} className={`absolute top-2 left-2`}>
                        <Heart isOpen={favorites.has(photo.id)} />
                      </button>
                    )}
                    {zoomGallery >= 200 && isAdmin && isShowAdmin && !photo.published && isVisible &&(
                      <button onClick={(e) => { e.stopPropagation(); setIndex(-1); handleDeleteButtonClick(photo.id); }} className={`absolute bottom-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-lg`}>
                        <Trash isOpen={true} />
                      </button>
                    )}
                    {zoomGallery >= 200 && isAdmin && isShowAdmin && photo.published && (
                      <button onClick={(e) => { e.stopPropagation(); setIndex(-1); handleTagButtonClick(photo.id); }} className={`absolute bottom-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-lg`}>
                        <Htag isOpen={true} /> 
                      </button>
                    )}
                    {zoomGallery >= 200 && isAdmin && isShowAdmin && (
                      <button onClick={(e) => { e.stopPropagation(); togglePublished(photo.id, photo.published); }} className={`absolute top-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-lg ${photo.published ? "" : "text-red-700 font-extrabold"}`}>
                        <Eye isOpen={photo.published} />
                      </button>
                    )}
                    {zoomGallery >= 200 && isAdmin && isShowAdmin && (
                      <button onClick={(e) => { e.stopPropagation(); toggleRecent(photo.id); }} className={`absolute bottom-2 left-2 bg-white text-gray-800 px-2 py-1 rounded-lg ${photo.published ? "" : "text-red-700 font-extrabold"}`}>
                        <Star isOpen={recentPhotos.has(photo.id)} />
                      </button>
                    )}
                    {renderDefaultPhoto({ wrapped: true })}
                  </div>
                </>
              );
            }}
          />
          <Lightbox open={isActive && index >= 0} 
          index={index}
           close={() => setIndex(-1)} 
           slides={paginatedPhotos} 
           render={{ slide: NextJsImage }}
            plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
            zoom={{
               maxZoomPixelRatio : 3,
              // zoomInMultiplier,
              // doubleTapDelay,
              // doubleClickDelay,
              // doubleClickMaxStops,
              // keyboardMoveDistance,
              // wheelZoomDistanceFactor,
              // pinchZoomDistanceFactor,
              scrollToZoom : true ,
            }}
             />
          <ToastContainer />
          <div className="flex flex-row justify-center gap-8 p-2 my-4 bg-neutral-700 rounded-md border border-white">
            <button className={`p-2 rounded-sm ${currentPage === 1 ? "bg-neutral-500 text-neutral-700" : "bg-neutral-700 text-white"}`} onClick={goToPreviousPage} disabled={currentPage === 1}>
              Page Précédente
            </button>
            <span>Page {currentPage} / {totalPages}</span>
            <span>
              <label className="mr-2 text-white">Photos per page:</label>
              <select className="p-1 text-xl font-bold text-black bg-white" onChange={(e) => changePhotosPerPage(Number(e.target.value))} value={photosPerPage}>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </span>
            <button className="p-2 rounded-sm bg-neutral-700 text-white" onClick={goToNextPage} disabled={currentPage === totalPages}>
              Page Suivante
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;
