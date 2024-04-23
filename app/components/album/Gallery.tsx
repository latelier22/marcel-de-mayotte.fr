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

  // Fonction pour générer les URLs des images avec différentes tailles
  const generateImageURLs = (src, width, height) => {
    const imageSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    const nextImageUrl = (src, size) => `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=75`;

    return {
      src: nextImageUrl(src, width),
      srcSet: imageSizes
        .concat(...deviceSizes)
        .filter((size) => size <= width)
        .map((size) => ({
          src: nextImageUrl(src, size),
          width: size,
          height: Math.round((height / width) * size),
        })),
    };
  };

  // Mapper les photos pour ajouter les propriétés src et srcSet
  const mappedPhotos = photos.map(({ src, width, height, ...rest }) => ({
    ...rest,
    src,
    ...generateImageURLs(src, width, height),
  }));

  mappedPhotos[0].srcSet.map((s)=>console.log(s));

  return (
    <div className="">
      <PhotoAlbum 
        photos={photos}
        spacing={50}
        layout="rows"
        targetRowHeight={350}
        onClick={({ index }) => setIndex(index)} 
        renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => {

            // @ts-ignore
          const hasBlackAndWhiteTag = photo.tags?.includes("NOIR ET BLANC");
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
        }}
      />

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={mappedPhotos}
        render={{ slide: NextJsImage }}
        plugins={[Fullscreen, Slideshow, Zoom]}
        zoom={{
          scrollToZoom:true,
          maxZoomPixelRatio:5
        }}
      />
    </div>
  );
}

export default Gallery;
