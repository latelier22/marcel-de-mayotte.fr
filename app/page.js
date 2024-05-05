"use client"

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';

const OverlayAnimation = React.lazy(() => import('./components/animations/OverlayAnimation'));

const Home = () => {
  // Dynamic metadata for the home page

  const router = useRouter();

  const pageTitle = "Accueil";
  const pageDescription = "Bienvenue sur le site de Marcel Séjour";

  return (
    <Suspense fallback={<div className="text-white min-h-screen bg-black flex justify-center items-center"> Loading...</div>}>
    <a href='/accueil'>

    
    <div 
      
      className=" min-h-screen bg-black flex justify-center items-center">
        <OverlayAnimation />
      </div>

      </a>
    </Suspense>
  );
}

export default Home;