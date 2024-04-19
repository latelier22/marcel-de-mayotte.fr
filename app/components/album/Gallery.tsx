"use client";

import { useState } from "react";

import PhotoAlbum from "react-photo-album";
import NextJsImage from "./NextJsImage";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const Gallery = ({ photos }) => {
  const [index, setIndex] = useState(-1);
  return (
    <div className="-mt-96">
      
      <PhotoAlbum 
       
        photos={photos}
        spacing={50}
        padding={20}
        layout="rows"
        targetRowHeight={350}
        onClick={({ index }) => setIndex(index)} />

      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        // plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        plugins={[Fullscreen, Slideshow, Thumbnails
        ]}
      />
    </div>

  );
}

export default Gallery;