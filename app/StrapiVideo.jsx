"use client";

// VideoPlayer.js
import React, { useRef, useEffect, useState } from 'react';
import styles from './VideoPlayer.module.css'; // Importez vos styles CSS

const VideoPlayer = ({ myVideoUrl }) => {
  const [showText, setShowText] = useState(true);
  const videoRef = useRef(null);
  console.log("myVideoUrl",myVideoUrl);

  useEffect(() => {
    const video = videoRef.current;
    

    const handlePlay = () => {
      setShowText(false); // Faites disparaître le texte lorsque la vidéo est en lecture
    };

    const handlePause = () => {
      setShowText(true); // Affichez à nouveau le texte lorsque la vidéo est mise en pause
    };

    if (video) {
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      // Ajout d'un écouteur d'événement pour la fin de la vidéo
      video.addEventListener('ended', handlePause);
    }

    return () => {
      if (video) {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handlePause);
      }
    };
  }, []);

  return (
    <div className="mx-auto">
      <video ref={videoRef} controls>
        <source src={myVideoUrl} type="video/mp4" />
        Votre navigateur ne prend pas en charge la lecture de vidéos.
      </video>
      {showText && <div className={styles.overlay}>Tutoriel</div>}
    </div>
  );
};

export default VideoPlayer;
