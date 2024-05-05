"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const AnimatedImage = () => {
  const [scale, setScale] = useState(0); // Commence l'échelle à 0
  const [opacity, setOpacity] = useState(100); // Opacité initiale à 100
  const router = useRouter();

  useEffect(() => {
    const growImage = () => {
      if (scale < 1000) {
        setTimeout(() => {
          setScale(scale + 1); // Augmenter l'échelle de 1
        }, 100); // Vitesse de l'animation
      } else if (opacity > 0) {
        setTimeout(() => {
          setOpacity(opacity - 2); // Diminuer l'opacité
        }, 50);
      } else {
        router.push('/accueil'); // Rediriger après l'animation
      }
    };

    growImage();
  }, [scale, opacity, router]);

  const handleImageClick= () => {
      // router.replace(`/`); // Navigation vers la page d'accueil
      console.log("CLIC")
  };

  return (
   <a href="/"
   className="fixed inset-0 flex items-center justify-center"
   >
    {/* onClick={handleImageClick} */}
    
      <Image
        src="/images/mosaique-marcel1.jpg"
        style={{
          transform: `scale(${scale / 75})`,
          opacity: `${opacity / 100}`
        }}
        width={900}
        height={900}
        
        className=" rounded-full transition-transform duration-700 ease-in-out"
        alt="Animated"
      />
    </a>
  );
};

export default AnimatedImage;