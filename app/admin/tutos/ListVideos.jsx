"use client";

import React, { useState, useEffect } from "react";
import DotLoaderSpinner from "../../components/spinners/DotLoaderSpinner";
import getBaseUrl from '../../components/getBaseUrl';
import Image from "next/image";

function ListVideos({ allFiles }) {
  const [videos, setVideos] = useState([]);
  console.log("allFiles", allFiles);

  useEffect(() => {
    
    const updatedVideos = allFiles.map(video => ({
      ...video,
      convertedUrl: getBaseUrl(video.url.replace('.mov', '.mp4')),
      thumbnail: video.thumbnail ? getBaseUrl(video.thumbnail) : `https://placehold.co/600x400/EECC44/000000/png?font=monserrat&text=${encodeURIComponent(video.name)}`
    }));
    setVideos(updatedVideos);
  }, [allFiles]);

  if (!videos.length) {
    return <DotLoaderSpinner isLoading={true} />;
  }

  return (
    <div className="video-list mx-auto">
      {videos.map(video => {
        return (
          <div key={video.id} className="video-card flex flex-row ">
            <div className="w-24 h-24 relative">
              <Image src={video.thumbnail} alt={`Thumbnail of ${video.name}`} layout="fill" objectFit="cover" />
            </div>
            <div className=" video-info flex flex-row items-center justify-arround gap-8">
              <h3>{video.name}</h3>
              <p>{(video.size / 1048576).toFixed(2)} MB</p>
              <a href={video.convertedUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ListVideos;
