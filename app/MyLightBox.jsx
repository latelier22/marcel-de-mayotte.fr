// TW Elements is free under AGPL, with commercial license required for specific uses. See more details: https://tw-elements.com/license/ and contact us for queries at tailwind@mdbootstrap.com 
"use client";
import { useEffect } from "react";
import Image from "next/image";

const MyLightBox = ({ photos }) => {
  useEffect(() => {
    const init = async () => {
      const { Lightbox, initTE } = await import("tw-elements");
      initTE({ Lightbox });
    };
    init();
  }, []);

  return (


<div className="flex items-center justify-center mx-auto">
  <div
    data-te-lightbox-init
    className="flex flex-col lg:flex-row flex-wrap lg:space-x-2 lg:space-y-2 justify-center"
  >
    {photos.map((photo, index) => (
      <div
        key={index}
        className="flex mx-auto w-full h-auto lg:w-1/5 "
      >
        <Image
          src={`/images/${photo.url}`}
          alt= {photo.alt}
          data-te-img={`/images/${photo.url}`}
          className={`mb-5 w-72 h-72  object-cover object-center cursor-zoom-in hover:object-contain data-[te-lightbox-disabled]:cursor-auto`}
          loading="lazy"
          width="300"
          height="300"
        />

         
    
      
      </div>
    ))}
  </div>
</div>


  );
};

export default MyLightBox;