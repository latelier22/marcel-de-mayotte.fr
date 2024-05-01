
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
