'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'

export const Common = ({ color , ...props}) => (
  <Suspense fallback={null}>
    {color && <color attach='background' args={[color]} />}
    <ambientLight intensity={0.3} />
    <directionalLight position={[1, 1, 3]} color='white' intensity={2} />
     {/* <pointLight position={[0, 0, 10]} color='white' intensity={1} decay={0.1} />  */}
     {/* <pointLight position={[20, 30, 10]} intensity={1} decay={0.1} /> */}
   {/* <pointLight position={[-10, -10, -10]} color='white' decay={0.1} />  */}
    <PerspectiveCamera makeDefault fov={props.fov ?props.fov :  40} position={props.cameraPosition ? props.cameraPosition :[10, 2, 10]} />
  </Suspense>
)

const View = forwardRef(({ children, orbit, ...props }, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
