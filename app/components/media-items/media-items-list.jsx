"use client"

import Image from 'next/image';
import {useEffect, useState } from 'react';
import justifyLayout from 'justified-layout';

// import styles from './media-item-list.module.scss';

const MediaItemList = ({
  mediaItems,
}) => {
  const photoAspectRatios = [];

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    function adjustBoxSizes() {
      setContainerWidth(
        Math.min(
          document.body.clientWidth ? document.body.clientWidth : 0,
          1920
        )
      );
    }

    adjustBoxSizes();
    window.addEventListener('resize', adjustBoxSizes);

    return () => window.removeEventListener('resize', adjustBoxSizes);
  }, []);

  mediaItems.forEach(({ mediaMetadata }) => {
    const ratio = Number(mediaMetadata.width) / Number(mediaMetadata.height)
    photoAspectRatios.push(
      Number(ratio)
    );
    console.log(ratio)
  });

  const layoutGeometry = justifyLayout(photoAspectRatios, {
    containerWidth: containerWidth,
    containerPadding: { top: 0, right: 0, left: 0, bottom: 0 },
    targetRowHeight: 240,
    boxSpacing: {
      horizontal: 4,
      vertical: 4,
    },
    showWidows: false,
  });

  return (
    <div className="flex flex-wrap justify-between gap-2 mx-auto">
  {mediaItems.map((item, index) => (
    <Image
      key={index} // Ajoutez une clé unique pour chaque élément dans le tableau map()
      src={item.baseUrl}
      alt={item.filename}
      title={new Date(item.mediaMetadata.creationTime).toLocaleString()}
      width={300*photoAspectRatios[index]}
      height={300}
      unoptimized
    />
  ))}
</div>

  );
};

export default MediaItemList;
