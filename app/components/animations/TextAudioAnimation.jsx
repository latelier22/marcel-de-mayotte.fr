"use client"

// components/TextAudioAnimation.jsx
import React, { useEffect, useState } from 'react';
import usePreloadedAudio from './hooks/usePreloadedAudio';


const TextAudioAnimation = ({ textData, audioUrl }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const { audio, loaded, playAudio } = usePreloadedAudio(audioUrl);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    if (loaded) {
      playAudio(); // Jouer l'audio
      setTextVisible(true); // Afficher le texte
      const interval = setInterval(() => {
        setCurrentTextIndex(prev => (prev + 1) % textData.length);
      }, 4000); // Changer de texte toutes les 4 secondes

      return () => clearInterval(interval);
    }
  }, [loaded, playAudio, textData.length]);

  return (
    <div className="flex justify-center items-center h-screen">
      {textVisible && (
        <p className="text-center text-2xl">{textData[currentTextIndex]}</p>
      )}
    </div>
  );
};

export default TextAudioAnimation;
