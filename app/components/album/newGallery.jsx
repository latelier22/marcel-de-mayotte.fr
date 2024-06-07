"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
// import DotLoaderSpinner from "../../components/spinners/DotLoaderSpinner";
import UploadImageComponent from "./UploadImageComponent";
import { useRouter } from "next/navigation";

import FavoriteModal from "../Modals/Modal";
import TagModal from "../Modals/Modal";
import RecentsModal from "../Modals/Modal";
import PublishedModal from "../Modals/Modal";
import TagCrudModal from "../Modals/Modal";
import DeleteConfirmationModal from "../Modals/Modal";

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

import { Eye, Star, Htag, Heart, Trash, Upload } from "./icons";
import EditableButton from "./buttons/EditableButton";

import { useSelector } from "react-redux";

import myFetch from "../../components/myFetch";
import ChangeOrderButton from "./ChangeOrderButton";

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";


const Gallery = ({ photos: initialPhotos, allTags, tagSlug, tagId }) => {
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
  const fileInputRef = useRef(null);
  const [zoomGallery, setZoomGallery] = useState(250);
  const [tagName, setTagName] = useState("");
  const [tagAction, setTagAction] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [unusedTags, setUnusedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [photosPerPage, setPhotosPerPage] = useState(100);
  const [recentPhotos, setRecentPhotos] = useState(new Set());

  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [importedFilesCount, setImportedFilesCount] = useState(0);
  const [isShowUpload, setIsShowUpload] = useState(false);

  // Htag
  const [openTagDiv, setOpenTagDiv] = useState(null);
  const [showOtherTags, setShowOtherTags] = useState(false);
  const [photoTagSearch, setPhotoTagSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const tagDivRef = useRef(null);

  const [showOtherUsedTags, setShowOtherUsedTags] = useState(false);
  const [showOtherUnusedTags, setShowOtherUnusedTags] = useState(false);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);


  const PhotoFrame = React.memo(
    React.forwardRef(function PhotoFrame(props, ref) {
      const { layoutOptions, imageProps, overlay, active, insertPosition, attributes, listeners } = props;
      const { alt, style, ...restImageProps } = imageProps;

      return (
        <div
          ref={ref}
          style={{
            width: overlay ? `calc(100% - ${2 * layoutOptions.padding}px)` : style.width,
            padding: style.padding,
            marginBottom: style.marginBottom,
          }}
          className={`photo-frame ${overlay ? 'overlay' : ''} ${active ? 'active' : ''} ${insertPosition === 'before' ? 'insertBefore' : ''} ${insertPosition === 'after' ? 'insertAfter' : ''}`}
          {...attributes}
          {...listeners}
        >
          <img
            alt={alt}
            style={{
              ...style,
              width: "100%",
              height: "auto",
              padding: 0,
              marginBottom: 0,
            }}
            {...restImageProps}
          />
        </div>
      );
    })
  );



  function SortablePhotoFrame(props) {
    const { photo, activeIndex } = props;
    const { attributes, listeners, isDragging, index, over, setNodeRef } = useSortable({ id: photo.id });

    return (
      <PhotoFrame
        ref={setNodeRef}
        active={isDragging}
        insertPosition={
          activeIndex !== undefined && over?.id === photo.id && !isDragging
            ? index > activeIndex
              ? "after"
              : "before"
            : undefined
        }
        aria-label="sortable image"
        attributes={attributes}
        listeners={listeners}
        {...props}
      />
    );
  }

  const renderedPhotos = useRef({});
  const [activeId, setActiveId] = useState();
  const activeIndex = activeId ? photos.findIndex((photo) => photo.id === activeId) : undefined;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(undefined);
  };

  const renderPhoto = (props) => {
    renderedPhotos.current[props.photo.id] = props;
    return <SortablePhotoFrame activeIndex={activeIndex} {...props} />;
  };

  const handleUpdatePhotos = (newPhotos) => {
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };



  const openDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(true);
  };

  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
  };

  const handleConfirmDelete = async () => {
    closeDeleteConfirmationModal();
    await handleDeleteSelectedPhotos();
  };

  const router = useRouter();

  // const localTag = allMyTags.filter((t) => t.slug === tagSlug);
  // const tagSlugName = localTag && localTag[0].name;

  // Définir le nom de la catégorie pour le tagSlug et CAS si tagSlug =favoris
  const localTag = allMyTags.filter((t) => t.slug === tagSlug);
  const tagSlugName =
    tagSlug === "favoris" ? "CATALOGUE COMPLET" : localTag[0]?.name || "";

  const filteredTags = (tags) => {
    if (!photoTagSearch) return tags;
    return tags.filter(
      (tag) =>
        tag &&
        tag.name &&
        tag.name.toLowerCase().includes(photoTagSearch.toLowerCase())
    );
  };

  const toggleTagDiv = (photoId) => {
    setOpenTagDiv((prevId) => (prevId === photoId ? null : photoId));
    setSelectedPhotoIds([photoId]);
  };

  const handleTagClickForPhoto = async (photoId, tagName) => {
    console.log("clic", photoId, tagName);
    setSelectedPhotoIds([photoId]); // Select the clicked photo

    // Call your function to add the tag
    await updateTagInBulk(true, tagName);
    setPhotoTagSearch("");
  };

  async function handleCreateTagandUpdate(tagName, photoId) {
    setSelectedPhotoIds([photoId]);
    await handleAddTag(tagName);
    setSelectedPhotoIds([photoId]);
    await updateTagInBulk(true, tagName);
    // Update local state to reflect the removed tag
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) => {
        if (photo.id === photoId) {
          return {
            ...photo,
            tags: photo.tags.filter((tag) => tag.name !== tagName),
          };
        }
        return photo;
      })
    );
  }

  const handleRemoveTagForPhoto = async (photoId, tagName) => {
    // Call your function to remove the tag
    await updateTagInBulk(false, tagName);

    // Update local state to reflect the removed tag
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) => {
        if (photo.id === photoId) {
          return {
            ...photo,
            tags: photo.tags.filter((tag) => tag.name !== tagName),
          };
        }
        return photo;
      })
    );

    // Update localTags to remove the tag from used tags if it's no longer used
    // const photoTagNames = photos.flatMap(photo => photo.tags.map(tag => tag.name));
    // setLocalTags(localTags.filter(tag => photoTagNames.includes(tag)));
  };

  const getNonPhotoUsedTags = (photo) => {
    const photoTagNames = photo.tags.map((tag) => tag.name);
    return localTags.filter((tag) => !photoTagNames.includes(tag));
  };

  const handleRestoreSelection = () => {
    setSelectedPhotoIds(lastSelection);
    setAllSelected(lastSelection.length === photos.length);
  };

  const handleSelectAll = () => {
    const allPhotoIds = photos
      .filter((photo) => isVisible || photo.published)
      .map((photo) => photo.id);
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
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSelectedPhotoIds([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagDivRef.current && !tagDivRef.current.contains(event.target)) {
        setOpenTagDiv(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tagDivRef]);

  useEffect(() => {
    const usedTags = new Set();
    photos.forEach((photo) => {
      photo.tags.forEach((tag) => {
        usedTags.add(tag.name);
      });
    });

    const newUnusedTags = allMyTags
      .filter((tag) => !usedTags.has(tag.name))
      .reduce(
        (acc, tag) => {
          if (tag.mainTag) {
            acc.mainTags.push(tag);
          } else {
            acc.otherTags.push(tag);
          }
          return acc;
        },
        { mainTags: [], otherTags: [] }
      );

    newUnusedTags.mainTags.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      } else {
        return 0;
      }
    });

    newUnusedTags.otherTags.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      } else {
        return 0;
      }
    });

    setUnusedTags([...newUnusedTags.mainTags, ...newUnusedTags.otherTags]);
  }, [allMyTags, photos, isShowAdmin]);

  const isTagNameExist = (tagName) => {
    return allMyTags.some((tag) => tag.name === tagName);
  };

  async function handleAddTag(tagName) {
    const trimmedTagName = tagName.trim();
    if (trimmedTagName && !isTagNameExist(trimmedTagName)) {
      const tagSlug = getSlug(trimmedTagName);
      try {
        const createdTag = await createTag(trimmedTagName, tagSlug);
        setAllMyTags((prevTags) => [
          ...prevTags,
          {
            ...createdTag,
            count: 0,
            mainTag: false,
            present: false,
            url: `generated-url-for-${trimmedTagName}`,
          },
        ]);
        // toast.success(`Tag "${trimmedTagName}" added successfully!`);

        // Update selected photos with the new tag if there are any selected
        if (selectedPhotoIds.length > 0) {
          await updateTagInBulk(true, createdTag.name);
        }
        return createTag;
      } catch (error) {
        console.error("Failed to create tag:", error);
        // toast.error(`Failed to add tag: ${error.message}`)
      }
    } else {
      // toast.error("This tag already exists or invalid tag name!");
    }
  }

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
        const newTags = allMyTags.map((tag) =>
          tag.name === oldTagName ? { ...tag, name: newTagName } : tag
        );
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

  // Séparer les tags utilisés et non utilisés
  const mainUsedTags = allMyTags.filter(
    (tag) => tag.mainTag && localTags.includes(tag.name)
  );
  const otherUsedTags = localTags.filter(
    (tag) => !mainUsedTags.some((t) => t.name === tag)
  );

  const mainUnusedTags = unusedTags.filter((tag) => tag.mainTag);
  const otherUnusedTags = unusedTags.filter((tag) => !tag.mainTag);

  const filteredMainUsedTags = mainUsedTags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );
  const filteredOtherUsedTags = otherUsedTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );
  const filteredMainUnusedTags = mainUnusedTags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );
  const filteredOtherUnusedTags = otherUnusedTags.filter((tag) =>
    tag.name && tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  useEffect(() => {
    if (tagSearch.length > 0) {
      setShowOtherUsedTags(true);
      setShowOtherUnusedTags(true);
    } else {
      setShowOtherUsedTags(false);
      setShowOtherUnusedTags(false);
    }
  }, [tagSearch]);

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
          selectedCounts[tag] = selectedCounts[tag]
            ? selectedCounts[tag] + 1
            : 1;
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

  // Sort tags so that mainTags are first, followed by other tags alphabetically
  const sortedTagStatus = Object.fromEntries(
    Object.entries(newTagStatus).sort((a, b) => {
      const tagA = allMyTags.find((t) => t.name === a[0]);
      const tagB = allMyTags.find((t) => t.name === b[0]);

      if (tagA.mainTag && !tagB.mainTag) {
        return -1;
      } else if (!tagA.mainTag && tagB.mainTag) {
        return 1;
      } else {
        return a[0].localeCompare(b[0]);
      }
    })
  );

  setTagStatus(sortedTagStatus);
}, [selectedPhotoIds, photos, localTags, allMyTags]);

const handleTagClick = (tag) => {
  setSelectedTag(tag);
  setTagName(tag);

  if (selectedPhotoIds.length === 0) {
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

    let modalTagContent;
    if (isTagInAll) {
      modalTagContent =
        "Voulez-vous supprimer ce tag de toutes les photos sélectionnées ?";
    } else if (isTagInSome) {
      modalTagContent =
        "Ce tag est présent sur certaines des photos sélectionnées. Voulez-vous l'ajouter à toutes ou le retirer de celles qui l'ont ?";
    } else {
      modalTagContent =
        "Voulez-vous ajouter ce tag à toutes les photos sélectionnées ?";
    }

    setModalContent(modalTagContent);
    setShowTagModal(true);
  }
};

const updateTagInBulk = async (addTag, tag) => {
  const updatedPhotos = photos.map((photo) => {
    if (
      selectedPhotoIds.includes(photo.id) &&
      !photo.tags.find((t) => t.name === tag)
    ) {
      return {
        ...photo,
        tags: [...photo.tags, { name: tag, id: Date.now() }],
      };
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
    initialTitles[photo.id] = photo.title || "";
  });
  setTitles(initialTitles);
}, [photos]);

const handleTitleChange = (e, photoId) => {
  const newTitles = {
    ...titles,
    [photoId]: e.target.value,
  };
  setTitles(newTitles);
};

const handleTitleBlur = (photoId) => {
  const title = titles[photoId];
  updatePhotoTitle(photoId, title);
};

const handleCheckboxChange = (photoId) => {
  const newTitle = photos.find((p) => p.id === photoId).name;
  setTitles((prevTitles) => ({
    ...prevTitles,
    [photoId]: newTitle,
  }));
  updatePhotoTitle(photoId, newTitle);
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
    console.error("Erreur lors de la mise à jour", error);
    toast.error("Failed to update title");
  }
};

const handleDeleteButtonClick = async (photoId) => {
  try {
    // Vérifier si la photo est importée
    const strapiResponse = await myFetch(
      `/api/pictures?filters[photoId][$eq]=${photoId}`,
      "GET",
      null,
      "photo import status"
    );
    const picture = strapiResponse.data[0]; // On suppose qu'il n'y a qu'une seule photo avec cet ID

    // Si la photo est importée, mettre à jour son état pour refléter qu'elle n'est plus importée
    if (picture && picture.attributes.imported) {
      await myFetch(
        `/api/pictures/${picture.id}`,
        "PUT",
        {
          data: {
            imported: false,
          },
        },
        "update photo import status"
      );
    }

    // Supprimer la photo
    const response = await fetch(`/api/deletePhoto`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ photoId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete the photo");
    }

    // Mettre à jour l'état des photos après suppression
    setPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => photo.id !== photoId)
    );
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

const canDeleteSelection = useMemo(() => {
  return (
    selectedPhotoIds.length > 0 &&
    selectedPhotoIds.every((photoId) => {
      const photo = photos.find((p) => p.id === photoId);
      return photo && !photo.published;
    })
  );
}, [selectedPhotoIds, photos]);

const handleDeleteSelectedPhotos = async () => {
  try {
    for (const photoId of selectedPhotoIds) {
      await handleDeleteButtonClick(photoId);
    }
    setSelectedPhotoIds([]);
    // toast.success("Photos deleted successfully!");
  } catch (error) {
    console.error("Failed to delete photos:", error);
    // toast.error("Failed to delete photos");
  }
};

const handleTagButtonClick = (photoId) => {
  photos.forEach((photo) => {
    if (selectedPhotoIds.includes(photo.id)) {
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

function normalizeString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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
        photo.tags?.some((tag) =>
          normalizeString(tag.name).includes(normalizedSearchTerm)
       
// PARTIE 3
