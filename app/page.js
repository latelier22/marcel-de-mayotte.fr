"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import MugModel from "@/components/models3d/MugModel";
import Palette from "@/components/models3d/Palette";
import Easel from "@/components/models3d/Easel";
import Easel1 from "@/components/models3d/Easel1";
import WallArt06 from "@/src/components/models3d/WallArt06";
import CadrePP from "@/src/components/models3d/CadrePP";
import ImagePlane from "@/src/components/models3d/ImagePlane";
import { Plane } from "@react-three/drei";

const Logo = dynamic(
  () => import("@/components/canvas/Examples").then((mod) => mod.Logo),
  { ssr: false }
);
const Dog = dynamic(
  () => import("@/components/canvas/Examples").then((mod) => mod.Dog),
  { ssr: false }
);
const Duck = dynamic(
  () => import("@/components/canvas/Examples").then((mod) => mod.Duck),
  { ssr: false }
);
// const Mug = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Mug), { ssr: false })

const View = dynamic(
  () => import("@/components/canvas/View").then((mod) => mod.View),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 w-full flex-col items-center justify-center">
        <svg
          className="-ml-1 mr-3 h-5 w-5 animate-spin text-black"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    ),
  }
);
const Common = dynamic(
  () => import("@/components/canvas/View").then((mod) => mod.Common),
  { ssr: false }
);

export default function Page() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col flex-wrap items-center md:flex-row  lg:w-4/5">
        {/* jumbo */}
        <div className="flex w-full flex-col items-start justify-center p-12 text-center md:w-2/5 md:text-left">
          <p className="w-full uppercase">Next + React Three Fiber</p>
          <h1 className="my-4 text-5xl font-bold leading-tight">
            C&apos;est mon mug
          </h1>
          <p className="mb-8 text-2xl leading-normal">
            A minimalist starter for React, React-three-fiber and Threejs.
          </p>
        </div>

        {/* <div className='w-full text-center '>
          <View orbit className='absolute top-0 flex h-1/2 w-full flex-col items-center justify-center'>
            <Suspense fallback={null}>
              <Palette scale={[0.1,0.1,0.1]}/>
              <Common />
            </Suspense>
          </View>
        </div> */}
      </div>
      <div className="mx-auto flex w-full flex-col flex-wrap items-center md:flex-row  lg:w-4/5">
        {/* jumbo */}
        <div className="flex w-full flex-col items-start justify-center p-12 text-center md:w-2/5 md:text-left">
          <p className="w-full uppercase">Next + React Three Fiber</p>
          <h1 className="my-4 text-5xl font-bold leading-tight">
            C&apos;est mon mug
          </h1>
          <p className="mb-8 text-2xl leading-normal">
            A minimalist starter for React, React-three-fiber and Threejs.
          </p>
        </div>

        <div className="w-full text-center ">
          <View
            orbit
            className="absolute top-0 flex h-1/2 w-full flex-col items-center justify-center"
          >
            <Suspense fallback={null}>
              {/* <CadrePP /> */}
              <ImagePlane
                imageUrl="images/voule-sur-la-plage.webp"
                position={[0, 0, -50]}
                width={8}
                height={5}
              />
              {/* <Plane args={[2, 2]} position-z={2} /> */}
              <Common />
            </Suspense>
          </View>
        </div>
      </div>

      {/* <div className='mx-auto flex w-full flex-col flex-wrap items-center md:flex-row  lg:w-4/5'>
        {/* jumbo */}
      {/* <div className='flex w-full flex-col items-start justify-center p-12 text-center md:w-2/5 md:text-left'>
          <p className='w-full uppercase'>Next + React Three Fiber</p>
          <h1 className='my-4 text-5xl font-bold leading-tight'>Next 3D Starter</h1>
          <p className='mb-8 text-2xl leading-normal'>A minimalist starter for React, React-three-fiber and Threejs.</p>
        </div> */}

      {/* <div className='w-full text-center md:w-3/5'>
          <View className='flex h-96 w-full flex-col items-center justify-center'>
            <Suspense fallback={null}>
              <MugModel />
              {/* <MyBoxes /> */}
      {/* <Common color={'lightblue'} />
            </Suspense>
          </View>
        </div>  */}
      {/* </div> */}

      <div className="mx-auto flex w-full flex-row flex-wrap items-center p-12 md:flex-row  lg:w-4/5">
        {/* first row */}
        <div className="relative h-screen w-1/2 py-6">
          {" "}
          {/* Ajustement de la hauteur ici */}
          <h2 className="mb-3 text-3xl font-bold leading-none text-gray-800">
            MUGd
          </h2>
          <p className="mb-8 text-gray-600">
            Drag, scroll, pinch, and rotate the canvas to explore the 3D scene.
          </p>
        </div>
        <div className="relative my-12 h-1/2 w-1/3 py-6">
          <View orbit className="relative h-screen ">
            <Suspense fallback={null}>
              {/* <MugModel postion ={[[0, 10, -5]]} scale={[10,10,10]}/> */}
              <Easel1 />
              {/* <WallArt06/> */}
              <CadrePP
                position-x={-0.4}
                position-y={-0.1}
                position-z={1}
                rotation-x={-0.01 * Math.PI}
                rotation-y={1.41 * Math.PI}
                rotation-z={0.04 * Math.PI}
                scale={5}
              />
              <Common color={"lightpink"} />
            </Suspense>
          </View>
        </div>
      </div>
    </>
  );
}
