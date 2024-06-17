
"use client"

import React from "react";
import PhotoAlbum from "react-photo-album";
import NextJsImage from "./NextJsImage";

export default function Gallery({ photos }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Galerie 1 */}
      <div className="col-span-1 row-span-1">
        <PhotoAlbum
          layout="rows"
          targetRowHeight={50}
          photos={photos}
          renderPhoto={NextJsImage}
          defaultContainerWidth={1200}
          sizes={{ size: "calc(100vw - 240px)" }}
        />
      </div>

      {/* Galerie 2 */}
      <div className="col-span-2 row-span-2">
        <PhotoAlbum
          layout="rows"
          targetRowHeight={100}
          photos={photos}
          renderPhoto={NextJsImage}
          defaultContainerWidth={1200}
          sizes={{ size: "calc(100vw - 240px)" }}
        />
      </div>

      {/* Autres galeries */}
      <div className="col-span-1">
        <PhotoAlbum
          layout="rows"
          targetRowHeight={50}
          photos={photos}
          renderPhoto={NextJsImage}
          defaultContainerWidth={1200}
          sizes={{ size: "calc(100vw - 240px)" }}
        />
      </div>

      <div className="col-span-1">
        <PhotoAlbum
          layout="rows"
          targetRowHeight={50}
          photos={photos}
          renderPhoto={NextJsImage}
          defaultContainerWidth={1200}
          sizes={{ size: "calc(100vw - 240px)" }}
        />
      </div>

      {/* Ajoutez d'autres galeries ici */}
    </div>
  );
}
