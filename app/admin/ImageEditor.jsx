"use client"

import Cropper from 'react-easy-crop';
import { useState, useCallback } from 'react';

const ImageEditor = ({ src }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveImage = async () => {
    const response = await fetch('/api/edit-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ crop, rotation, zoom, croppedAreaPixels }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <Cropper
        image={src}
        crop={crop}
        rotation={rotation}
        zoom={zoom}
        aspect={4 / 3}
        onCropChange={setCrop}
        onRotationChange={setRotation}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
      <button onClick={saveImage}>Save Image</button>
    </div>
  );
};

export default ImageEditor;