"use client"

import { useRouter } from "next/navigation";

export const UI = () => {

    
    const router = useRouter();
    
    const handleClick = () => {
        router.push('/accueil');
      };

    return (
  
        <div className="absolute z-10 text-center w-full mx-auto">

    <button 
    onClick={handleClick}
    className="   align-center text-center pointer-events-auto py-4 px-16 bg-gold-500 text-white font-black rounded-full hover:bg-orange-600 cursor-pointer transition-colors">
          Entrer sur le site
          </button>
        </div>

    )
  };

  export default UI