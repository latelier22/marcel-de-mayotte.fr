// NextJsImage.js

import React from "react";
import Image from "next/image";

export default function NextJsImage({
  photo,
  wrapperStyle,
  alt,
  title,
  sizes,
  className,
  onClick, // Ajoutez onClick comme une prop
}) {
  return (
    <div style={{ ...wrapperStyle, position: "relative" }} onClick={onClick}>
      <Image
        fill
        src={photo.src}
        alt={photo.alt}
        title={photo.alt}
        sizes={sizes}
        className={className}
        placeholder={photo.blurDataURL ? "blur" : undefined}
        blurDataURL={photo.blurDataURL}
      />
    </div>
  );
}
