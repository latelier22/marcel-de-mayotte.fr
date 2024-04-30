

export  async  function toggleFavorites  (userId,photos, selectedPhotoIds, setPhotos) {
    console.log("Selected IDs:", selectedPhotoIds); // Vérifier les IDs sélectionnés
        const updatedPhotos = photos.map(photo => {
            if (selectedPhotoIds.includes(photo.id)) {
                return { ...photo, isFavorite: !photo.isFavorite };
            }
            return photo;
        });
        setPhotos(updatedPhotos); // Mise à jour de l'état local
    
        // API call to update the server
        try {
            const response = await fetch(`/api/updateFavorites`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId, selectedPhotoIds, isFavorite }),
            });
      
            if (!response.ok) {
              throw new Error("Failed to update favorites");
            }
            console.log("Favorites updated successfully on the server.");
          } catch (error) {
            console.error("An error occurred while updating favorites:", error);
            toast.error("Erreur lors de la mise à jour des favoris.");
          }
    };
    

export const toggleRecent = (photos, selectedPhotoIds, setPhotos) => {
    const updatedPhotos = photos.map(photo => {
        if (selectedPhotoIds.includes(photo.id)) {
            photo.isRecent = !photo.isRecent;
        }
        return photo;
    });
    setPhotos(updatedPhotos);
};

export const togglePublished = (photos, selectedPhotoIds, setPhotos) => {
    const updatedPhotos = photos.map(photo => {
        if (selectedPhotoIds.includes(photo.id)) {
            photo.published = !photo.published;
        }
        return photo;
    });
    setPhotos(updatedPhotos);
};

export const moveToTrash = (photos, selectedPhotoIds, setPhotos) => {
    const remainingPhotos = photos.filter(photo => !selectedPhotoIds.includes(photo.id));
    setPhotos(remainingPhotos);
    // Add additional logic to handle server-side or database updates
};
