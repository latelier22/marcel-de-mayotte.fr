"use client";

import { useState } from "react";

import PhotoAlbum from "react-photo-album";
import NextJsImage from "./NextJsImage";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { Photo as BasePhoto } from 'react-photo-album';

interface Photo extends BasePhoto {
    tags?: string[]; // Ajoutez la propriété tags à l'interface Photo
}



// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const Gallery = ({ photos, mysize }) => {
  const [index, setIndex] = useState(-1);
  return (
    <div className="">
      
      <PhotoAlbum 
       
        photos={photos}
        spacing={50}
        // padding={20}
        layout="rows"
        targetRowHeight={350}
        onClick={({ index }) => setIndex(index)} 
        renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => {

          // @ts-ignore
          const hasBlackAndWhiteTag = photo.tags?.includes("NOIR ET BLANC");
      
          // Définir le style de la bordure
          const borderStyle = hasBlackAndWhiteTag ? "4px solid white" : "4px solid black";
      
          return (
            <div
              style={{ ...wrapperStyle, border: borderStyle }}
              rel="noreferrer noopener"
              title={photo.alt} 
            >
              {renderDefaultPhoto({ wrapped: true })}
            </div>
          );
        }}/>


<Lightbox
    open={index >= 0}
    index={index}
    close={() => setIndex(-1)}
    slides={photos}
    render={{ slide: NextJsImage }}
    plugins={[Fullscreen, Slideshow, Thumbnails]}
  />
    </div>

  );
}

export default Gallery;