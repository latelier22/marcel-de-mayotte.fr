"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import myFetch from "../../components/myFetch";
import DotLoaderSpinner from "../../components/spinners/DotLoaderSpinner";

function ListVideos({ allFiles }) {
  
const [videos, setVideos] = useState([]);
console.log("allFiles",allFiles)


  useEffect(() => {
    const videoFiles = allFiles.filter(file => file.mime.startsWith("video/"));
    setVideos(videoFiles);
  }, [allFiles]);

  if (!videos.length) {
    return <DotLoaderSpinner isLoading={true} />;
  }

  return (
    <div className="video-list">
      {videos.map(video => (
        <div key={video.id} className="video-card">
          <img src={video.thumbnail} alt={`Thumbnail of ${video.name}`} />
          <div className="video-info">
            <h3>{video.name}</h3>
            <p>{video.size} MB</p>
            <a href={video.url} target="_blank" rel="noopener noreferrer">Watch Video</a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListVideos;

// "use client";

// import React, { useState, useEffect } from "react";
// import DotLoaderSpinner from "../../components/spinners/DotLoaderSpinner";

// function ListVideos({ allFiles }) {
//   const [videos, setVideos] = useState([]);

//   useEffect(() => {
//     const videoFiles = allFiles.filter(file => file.mime.startsWith("video/"));
//     setVideos(videoFiles);
//   }, [allFiles]);

//   if (!videos.length) {
//     return <DotLoaderSpinner isLoading={true} />;
//   }

//   return (
//     <div className="video-list">
//       {videos.map(video => (
//         <div key={video.id} className="video-card">
//           <img src={video.thumbnail} alt={`Thumbnail of ${video.name}`} />
//           <div className="video-info">
//             <h3>{video.name}</h3>
//             <p>{video.size} MB</p>
//             <a href={video.url} target="_blank" rel="noopener noreferrer">Watch Video</a>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// 