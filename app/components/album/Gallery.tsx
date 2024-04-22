"use client";

import { useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const Gallery = ({ photos, mysize }) => {
  const [index, setIndex] = useState(-1);

  return (
    <div className="">
      <PhotoAlbum
        photos={photos}
        spacing={50}
        layout="rows"
        targetRowHeight={350}
        renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => {
          // Vérifier si la photo a le tag "NOIR ET BLANC"
          const hasBlackAndWhiteTag = photo.tags.includes("NOIR ET BLANC");
          
          // Définir le style de la bordure
          const borderStyle = hasBlackAndWhiteTag ? "1px solid white" : "none";

          // Combinez le style existant avec le nouveau style de la bordure
          const updatedWrapperStyle = {
            ...wrapperStyle,
            border: borderStyle
          };

          return (
            <div style={updatedWrapperStyle}>
              {renderDefaultPhoto({})}
            </div>
          );
        }}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails]}
      />
    </div>
  );
};

export default Gallery;
