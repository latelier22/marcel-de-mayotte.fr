import React from 'react';
import FileTagsClient from './FileTagsClient';

async function fetchPhotoTags(photoId) {
  const response = await fetch(`/api/getPhoto/${photoId}`);
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getPhoto/${photoId}`);
  const photo = await response.json();
  return photo.tags || [];
}

const FileTags = async ({ photoId }) => {
  const fileTags = await fetchPhotoTags(photoId);

  return (
    <FileTagsClient fileTags={fileTags} />
  );
};

export default FileTags;
