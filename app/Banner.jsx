"use client";
import { useEffect } from "react";
import Image from "next/image";

const ImagesBar = ({ photo }) => {
  useEffect(() => {
    const init = async () => {
      const { Tooltip, initTE } = await import("tw-elements");
      initTE({ Tooltip });
    };
    init();
  }, []);

  return (
    <header>
      {/* Utiliser une boucle pour générer les éléments d'image */}

      <div className="flex justify-center items-center">
        <div className="w-full">
          <Image
            alt={photo.alt}
            className="picto block w-full h-auto my-12 object-cover object-center"
            src={`/images/${photo.url}`}
            width="2400"
            height="1564"
            priority // Add this property
          />
          {/* Make sure the h3 element is properly styled and visible */}
        </div>
        <h3 className="text-green-900 text-center mt-2 ">{photo.text}</h3>
      </div>
    </header>
  );
};

export default ImagesBar;
