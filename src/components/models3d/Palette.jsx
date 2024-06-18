import React, { useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial } from 'three'

const lighterColors = {
  'palette_2': '#FFCC66',  // Jaune clair
  'palette_3': '#FF9966',  // Orange clair
  'palette_4': '#FF6666',  // Rouge clair
  'palette_5': '#CC99FF',  // Violet clair
  'palette_6': '#66CCFF',  // Bleu clair
  'palette_7': '#66FF99',  // Vert clair
  // Ajoutez les autres couleurs claires si nécessaire
}

const baseColors = {
  'palette_2': '#FF8800',  // Jaune foncé
  'palette_3': '#FF5500',  // Orange foncé
  'palette_4': '#CC0000',  // Rouge foncé
  'palette_5': '#660099',  // Violet foncé
  'palette_6': '#003399',  // Bleu foncé
  'palette_7': '#006600',  // Vert foncé
  // Ajoutez les autres couleurs foncées si nécessaire
}

export function Palette(props) {
  const { nodes, materials } = useGLTF('/Palette.glb')
  const [hovered, setHovered] = useState(null)

  // Créer un nouveau matériau pour palette_1
  const palette1Material = useRef(new MeshStandardMaterial({ color: '#8B4513' })).current

  const handlePointerOver = (event) => {
    if (event.object.name !== 'palette_1') {
      const materialName = event.object.name
      
      // Vérifier si materialName est défini et s'il existe dans lighterColors ou baseColors
      const colorToSet = lighterColors[materialName] || baseColors[materialName] || '#ffffff' // Couleur par défaut si aucune correspondance
      event.object.material.color.set(colorToSet)
      
      setHovered(event.object)
      event.object.scale.set(1.05, 1.05, 1.05)  // Augmenter l'échelle lorsque survolé
    }
  }
  
  const handlePointerOut = (event) => {
    if (event.object.name !== 'palette_1') {
      const materialName = event.object.name
      
      // Vérifier si materialName est défini et s'il existe dans baseColors
      const colorToSet = baseColors[materialName] || '#ffffff' // Couleur par défaut si aucune correspondance
      event.object.material.color.set(colorToSet)
      
      setHovered(null)
      event.object.scale.set(1, 1, 1)  // Revenir à l'échelle normale lorsque la souris sort
    }
  }

  return (
    <group {...props} dispose={null}>
      <group name="palette" rotation={[Math.PI / 2, 0, 0]}>
        <mesh
          name="palette_1"
          castShadow
          receiveShadow
          geometry={nodes.palette_1.geometry}
          material={palette1Material}
          scale={[1, 1, 1]}
        />
        <mesh
          name="palette_2"
          castShadow
          receiveShadow
          geometry={nodes.palette_2.geometry}
          material={materials['02___Default']}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          scale={hovered === nodes.palette_2 ? [1.05, 1.05, 1.05] : [1, 1, 1]}
        />
        <mesh
          name="palette_3"
          castShadow
          receiveShadow
          geometry={nodes.palette_3.geometry}
          material={materials['03___Default']}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          scale={hovered === nodes.palette_3 ? [1.05, 1.05, 1.05] : [1, 1, 1]}
        />
        <mesh
          name="palette_4"
          castShadow
          receiveShadow
          geometry={nodes.palette_4.geometry}
          material={materials['11___Default']}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          scale={hovered === nodes.palette_4 ? [1.05, 1.05, 1.05] : [1, 1, 1]}
        />
        <mesh
          name="palette_5"
          castShadow
          receiveShadow
          geometry={nodes.palette_5.geometry}
          material={materials['02___Default']}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          scale={hovered === nodes.palette_5 ? [1.05, 1.05, 1.05] : [1, 1, 1]}
        />
        <mesh
          name="palette_6"
          castShadow
          receiveShadow
          geometry={nodes.palette_6.geometry}
          material={materials['05___Default']}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          scale={hovered === nodes.palette_6 ? [1.05, 1.05, 1.05] : [1, 1, 1]}
        />
        <mesh
          name="palette_7"
          castShadow
          receiveShadow
          geometry={nodes.palette_7.geometry}
          material={materials['10___Default']}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          scale={hovered === nodes.palette_7 ? [1.05, 1.05, 1.05] : [1, 1, 1]}
        />
      </group>
    </group>
  )
}

export default Palette


useGLTF.preload('/Palette.glb')