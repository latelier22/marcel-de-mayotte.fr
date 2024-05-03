"use client"

// hooks/usePreloadedAudio.js
import { useState, useEffect } from 'react';

function usePreloadedAudio(url) {
  const [audio, setAudio] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const audioInstance = new Audio(url);
    setAudio(audioInstance);

    const handleCanPlay = () => {
      setLoaded(true);
    };

    audioInstance.addEventListener('canplaythrough', handleCanPlay);
    audioInstance.load();

    return () => {
      audioInstance.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, [url]);

  // Contrôleur pour jouer l'audio
  const playAudio = () => {
    if (audio) {
      audio.play();
    }
  };

  return { audio, loaded, playAudio };
}

export default usePreloadedAudio;
