import React, { useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { RenderPhotoProps } from "react-photo-album";

export default function NextJsImage({
  photo,
  imageProps: { alt, title, sizes, className, onClick },
  wrapperStyle,
}: RenderPhotoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openCarousel = () => {
    setIsOpen(true);
  };

  const closeCarousel = () => {
    setIsOpen(false);
  };

  return (
    <div style={{ ...wrapperStyle, position: "relative" }}>
      <div onClick={openCarousel}>
        <Image
          fill
          src={photo}
          placeholder={"blurDataURL" in photo ? "blur" : undefined}
          {...{ alt, title, sizes, className }}
        />
      </div>
      {isOpen && (
        <div className="carousel-overlay">
          <div className="carousel-close" onClick={closeCarousel}>
            Close
          </div>
          <Slider>
            {/* Ajoutez ici les autres images à afficher dans le carrousel */}
            {/* Exemple :
            <div>
              <Image src="url_de_l_image" />
            </div>
            */}
          </Slider>
        </div>
      )}
    </div>
  );
}
