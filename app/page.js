"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import {
  Plane,
  CameraControls,
  Environment,
  Float,
  MeshReflectorMaterial,
  RenderTexture,
  Text,
  useFont,
} from "@react-three/drei";

import { degToRad, lerp } from "three/src/math/MathUtils";

import Ui from '@/components/UI/Ui'

import MugModel from "@/components/models3d/MugModel";
import Palette from "@/components/models3d/Palette";
import Easel from "@/components/models3d/Easel";
import Easel1 from "@/components/models3d/Easel1";
import WallArt06 from "@/src/components/models3d/WallArt06";
import CadrePP from "@/src/components/models3d/CadrePP";
import ImagePlane from "@/src/components/models3d/ImagePlane";

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

// const Ui = dynamic(() => import('@/components/UI/Ui').then((mod) => mod.UI), { ssr: false });

export default function Page() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col flex-wrap items-center md:flex-row">

        <View orbit className='flex h-screen w-full flex-col items-center justify-center'>
          <Suspense fallback={null}>
            <ImagePlane
              imageUrl="images/voule-sur-la-plage.webp"
              position={[0, 0, -50]}
              width={8}
              height={5}
            />
            <Common color={''} cameraPosition={[10, 2, 40]} />
            <Text
              font={"fonts/Poppins-Black.ttf"}
              position-x={-10}
              position-y={-2}
              position-z={1}
              lineHeight={0.8}
              textAlign="center"
              rotation-y={degToRad(15)}
              anchorY={"bottom"}
              color={'blue'}

            >
              Liberté
            </Text>
            <Text
              font={"fonts/Poppins-Black.ttf"}
              position-x={-5}
              position-y={-2}
              position-z={5}
              lineHeight={0.8}
              textAlign="center"
              rotation-y={degToRad(0)}
              anchorY={"bottom"}
              color={'white'}
            >
              Egalité
            </Text>
            <Text
              font={"fonts/Poppins-Black.ttf"}
              position-x={10}
              position-y={-2}
              position-z={10}
              lineHeight={0.8}
              textAlign="center"
              rotation-y={degToRad(-15)}
              rotation-z={degToRad(-30)}
              anchorY={"bottom"}
              color="#c85831"
            >
              Magnégné
            </Text>
          
          </Suspense>
        </View>
       <div className="absolute bottom-96 mx-auto w-full">
       <Ui/>
       </div>

       
      
      </div>

    </>
  );
}
