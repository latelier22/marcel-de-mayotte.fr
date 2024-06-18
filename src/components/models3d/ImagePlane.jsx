import React from 'react';
import {  MeshReflectorMaterial } from "@react-three/drei"
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const ImagePlane = ({ imageUrl, width, height }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  // Créer un matériau avec MeshPhongMaterial et la texture chargée
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    shininess: 50,  // Ajuster la brillance du matériau
    specular: new THREE.Color(0x333333),  // Couleur spéculaire
    side: THREE.DoubleSide  // Afficher le matériau des deux côtés du plane
  });

  return (
    <group>

    <mesh>
      <planeGeometry args={[width, height]} />
      <meshPhongMaterial attach="material" {...material} />
      {/* Positionnement éventuel */}
    </mesh>
    <mesh position-y={-3} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[100, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={10}
          roughness={0.1}
          depthScale={1}
          opacity={0.9}
          transparent
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333"
          metalness={0.5}
        />
      </mesh>
    </group>
  );
};

export default ImagePlane;
