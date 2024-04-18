"use client";

import PhotoAlbum from "react-photo-album";
import NextJsImage from "./NextJsImage";

const Gallery = ({photos}) => {
  return (
    <PhotoAlbum
      layout="rows"
      photos={photos}
      renderPhoto={NextJsImage}
      defaultContainerWidth={1200}
      sizes={{ size: "calc(100vw - 240px)" }}
    />
  );
}

export default Gallery;