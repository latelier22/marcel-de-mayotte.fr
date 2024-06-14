import React from 'react';
import myFetch from "../../../components/myFetch";
import StrapiVideo from "../../../StrapiVideo";

// Fonction pour récupérer une vidéo par son ID
async function fetchVideo(videoId) {
  const strapiVideo = await myFetch(`/api/video/${videoId}`, 'GET', null, 'video by Id');

  const convertedUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${strapiVideo.url}`;
  const thumbnail = strapiVideo.formats?.thumbnail?.url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${strapiVideo.formats.thumbnail.url}` : null;

  const video = {
    id: strapiVideo.id,
    ...strapiVideo.attributes,
    convertedUrl,
    thumbnail,
  };

 
  return video;
}

// Composant Page qui affiche une vidéo spécifique
async function Page({ params }) {
  const videoId = params.videoId;
  let video;

  try {
    video = await fetchVideo(videoId);
  } catch (error) {
    console.error(error);
    return <div>Video not found</div>;
  }

  const pageTitle = 'Tutos';
  const pageDescription = 'Comment utiliser le site';

  return (
    <div className="container flex flex-row mx-auto py-2 md:py-8 md:px-12 lg:px-20 lg:py-64 animate-appear">
      <StrapiVideo myVideoUrl={video.convertedUrl} />
    </div>
  );
};

export default Page;
