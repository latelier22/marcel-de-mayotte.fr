import React, { useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { fabric } from 'fabric'
import * as THREE from 'three'

function CadreModel(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/cadrePP.gltf')
  const { gl } = useThree()
  let canvas = Array.from(document.getElementsByTagName('canvas'))[1],
    ctx,
    texture
  ctx = canvas.getContext('2d')
  texture = new THREE.CanvasTexture(ctx.canvas)
  texture.flipY = false // Vous pouvez essayer true si nécessaire.

  texture.anisotropy = gl.capabilities.getMaxAnisotropy()
  texture.needsUpdate = true
  /* ANIMATION */

  useFrame((state, delta) => {
    if (props.animation) {
      group.current.rotation.z += 0.01 * 3 // Vitesse de rotation
    }
    texture.needsUpdate = true
  })

  return (
    // DESCRIPTION DU MODELE
    <>
      <group {...props} dispose={null}>
        <group ref={group} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} scale={0.05}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.group_0.geometry}
            material={materials.Matière}
            position={[-0.654, -0.208, -0.679]}
            scale={1.181}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.group_2.geometry}
            material={materials.Color_D06}
            position={[-0.654, -0.208, -0.679]}
            scale={1.181}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.group_2001.geometry}
            material={materials.Color_D06}
            position={[-0.654, -0.208, -0.679]}
            scale={1.181}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.group_3.geometry}
            material={materials.Color_A05}
            position={[-0.654, -0.208, -0.679]}
            scale={[1.181, 0.236, 1.181]}
          >
            <group scale={[0.847, 4.233, 0.847]}>
              <mesh castShadow receiveShadow geometry={nodes.ID43.geometry} material={materials.Color_I03} />
              <mesh castShadow receiveShadow geometry={nodes.ID43_1.geometry} material={materials.Color_A05} />
            </group>
          </mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.IMPRESSION.geometry}
            material={materials['map-material']}
            position={[-0.654, -0.208, -0.679]}
            scale={[1.181, 0.236, 1.181]}
          >
            <meshStandardMaterial attach="material" map={texture}>
              <canvasTexture attach="map" image={canvas} />
            </meshStandardMaterial>
          </mesh>
        </group>
      </group>
    </>
  )
}

useGLTF.preload('/cadrePP.gltf')

export default CadreModel
