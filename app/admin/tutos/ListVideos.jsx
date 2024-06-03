"use client";

import React, { useState, useEffect } from "react";
import DotLoaderSpinner from "../../components/spinners/DotLoaderSpinner";
import Image from "next/image";

function ListVideos({ allFiles }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const updatedVideos = allFiles.map(video => {
      const convertedUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${video.url}`;
      const thumbnail = video.formats?.thumbnail?.url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${video.formats.thumbnail.url}` : null;
      
      return {
        ...video,
        convertedUrl,
        thumbnail
      };
    });

    setVideos(updatedVideos);
  }, [allFiles]);

  if (!videos.length) {
    return <DotLoaderSpinner isLoading={true} />;
  }

  return (
    <div className="video-list mx-auto">
      {videos.map(video => {
        if (!video.thumbnail) {
          console.warn(`Thumbnail URL is missing for video: ${video.name}`);
          return null;
        }

        return (
          <div key={video.id} className="video-card flex flex-row ">
            <div className="w-24 h-24 relative">
              <Image 
                src={video.thumbnail} 
                alt={`Thumbnail of ${video.name}`} 
                fill 
                style={{ objectFit: "cover" }} 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                priority
              />
            </div>
            <div className="video-info flex flex-row items-center justify-around gap-8">
              <h3>{video.name}</h3>
              <p>{(video.size / 1048576).toFixed(2)} MB</p>
              <a href={`/admin/tutos/${video.id}`} target="_blank" rel="noopener noreferrer">Watch Video</a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ListVideos;
