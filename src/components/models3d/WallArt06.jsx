import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'  // Importer Three.js

export function WallArt06(props) {
  const { nodes, materials } = useGLTF('/WallArt06.glb')

  // Charger l'image pour le matériau du Node-Mesh_16
  const textureLoader = new THREE.TextureLoader()  // Utilisation de THREE.TextureLoader
  const texture = textureLoader.load('rouge.jpg')  // Remplacez par le chemin de votre image
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping  // Options de répétition de la texture si nécessaire
  texture.repeat.set(1, 1)  // Paramètres de répétition de la texture si nécessaire

  // Créer un matériau avec la texture chargée
  // Créer un matériau avec la texture chargée
  const customMaterial = useRef(new THREE.MeshStandardMaterial({
    map: texture,
    transparent: false,  // Rend le matériau non transparent
    opacity: 1,          // Opacité maximale (complètement opaque)
  })).current

  return (
    <group {...props} dispose={null} position-y={0.9} position-z={0.3} rotation-x={-0.05*Math.PI} rotation-y={0.92*Math.PI} rotation-z={0.015*Math.PI} scale={3}>
        {/* cadre */}
      {/* <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh'].geometry}
        material={materials.mat23}
      /> */}
      {/* passe-partout */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_1'].geometry}
        material={customMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_2'].geometry}
        material={customMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_3'].geometry}
        material={customMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_4'].geometry}
        material={customMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_5'].geometry}
        material={materials.mat13}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_6'].geometry}
        material={materials.mat12}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_7'].geometry}
        material={materials.mat4}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_8'].geometry}
        material={materials.mat16}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_9'].geometry}
        material={materials.mat14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_10'].geometry}
        material={materials.mat1}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_11'].geometry}
        material={materials.mat5}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_12'].geometry}
        material={materials.mat8}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_13'].geometry}
        material={materials.mat7}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_14'].geometry}
        material={materials.mat15}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_15'].geometry}
        material={materials.mat10}
      />
         <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_16'].geometry}
        material={customMaterial}  // Utilisation du matériau personnalisé avec la texture
      />
      {/* <mesh
        castShadow
        receiveShadow
        geometry={nodes['Node-Mesh_17'].geometry}
        material={materials.mat25}
      /> */}
    </group>
  )
}

export default WallArt06

useGLTF.preload('/WallArt06.glb')

