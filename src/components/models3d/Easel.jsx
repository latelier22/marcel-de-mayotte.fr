import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Easel(props) {
  const { nodes, materials } = useGLTF('/easel.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.group1441049998.geometry}
        material={materials.mat21}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.group1958263894.geometry}
        material={materials.mat20}
      />
    </group>
  )
}
export default Easel

useGLTF.preload('/easel.glb')