"use client";

// VideoPlayer.js
import React, { useRef, useEffect, useState } from 'react';
import styles from './VideoPlayer.module.css'; // Importez vos styles CSS

const VideoPlayer = () => {
  const [showText, setShowText] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 10.5; // Démarrer la lecture à partir de 1 minute 20 secondes (80 secondes)
    }
  }, []);

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
    }

    return () => {
      if (video) {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <video ref={videoRef} controls>
        <source src="https://marcel-de-mayotte.latelier22.fr/videos/videomarcel-sd.mp4" />
        Votre navigateur ne prend pas en charge la lecture de vidéos.
      </video>
      {showText && <div className={styles.overlay}>Entretien de Marcel Séjour</div>}
    </div>
  );
};

export default VideoPlayer;
