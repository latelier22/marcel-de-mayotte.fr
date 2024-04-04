"use client";
import { useEffect } from "react";

const ImagesBar = ( {photos}) => {
  useEffect(() => {
    const init = async () => {
      const { Tooltip, initTE } = await import("tw-elements");
      initTE({ Tooltip });
    };
    init();
  }, []);

  return (
    <header>
 
      <div>
      <div className="container mx-auto px-5 py-2 lg:pt-4 ">
  <div className="-m-1 flex flex-wrap">
    {/* Utiliser une boucle pour générer les éléments d'image */}
    {photos.map((photo, index) => (
      <div
        key={index}
        className="flex justify-around w-1/4 flex-wrap items-center"
      >
        <div className="flex justify-center items-center">
        <div className="w-full">
          <img
            alt={photo.alt}
            className="picto block w-60 h-60 my-12 object-cover object-center"
            src={`images/${photo.url}`}
          />
          {/* Make sure the h3 element is properly styled and visible */}
          
        </div>
        <h3 className="text-green-900 text-center mt-2 ">{photo.text}</h3>
        </div>
      </div>
    ))}
  </div>
</div>
      </div>
    </header>
  );
};

export default ImagesBar;
