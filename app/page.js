"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Utilisation de next/navigation pour la redirection

const WordAnimation = ({ word, color, initialX, finalX, delay, rotate, onComplete }) => {
  const [style, setStyle] = useState({
    opacity: 0,
    transform: `translateX(${initialX}vw) rotate(0deg)`, // Utiliser vw pour le positionnement initial
    position: 'absolute',
    top: '50%',
    left: '40%',
    transformOrigin: 'center',
    color: color,
    transition: `opacity 1s, transform 1s`
  });

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStyle(prevStyle => ({
        ...prevStyle,
        opacity: 1,
        transform: `translateX(${finalX}vw) rotate(${rotate}deg)` // Utiliser vw pour la translation finale
      }));
    }, delay);

    const timer2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, delay + 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [initialX, finalX, rotate, delay, onComplete]);

  return <div className='font-bold text-[5vw]' style={style}>{word}</div>;
};

const Home = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (step === 3) {
      setTimeout(() => {
        setFadeOut(true);
      }, 1000);
      setTimeout(() => {
        router.push('/accueil');
      }, 1500);
    }
  }, [step, router]);

  return (
    <div className='container h-screen flex items-center justify-center' style={{ transition: 'opacity 1s', opacity: fadeOut ? 0 : 1 }}>
      {step >= 1 && (
        <WordAnimation
          word="Liberté"
          color="blue"
          initialX="0"
          finalX="-25" // Pourcentage de la translation à gauche
          delay={0}
          rotate={0}
          onComplete={() => setStep(2)}
        />
      )}
      {step >= 2 && (
        <WordAnimation
          word="Égalité"
          color="white"
          initialX="0"
          finalX="0" // Aucun déplacement
          delay={0}
          rotate={0}
          onComplete={() => setStep(3)}
        />
      )}
      {step >= 3 && (
        <WordAnimation
          word="Magnégné"
          color="#c85831"
          initialX="-100" // Départ à droite
          finalX="25" // Translation vers la gauche
          delay={0}
          rotate={20}
          onComplete={() => setStep(4)}
        />
      )}
    </div>
  );
};

export default Home;
