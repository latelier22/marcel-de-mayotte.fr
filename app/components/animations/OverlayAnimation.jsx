// components/OverlayAnimation.js
import React from 'react';
import AnimatedImage from './AnimatedImage';
import TextAudioAnimation from './TextAudioAnimation';
import TagsDisplay from "./TagsDisplay"

import { useRouter } from 'next/navigation';

// import getImages from "../getImages";
// import getTags from "../getTags"


// const allPhotos = await getImages();
// const allTags = await getTags(allPhotos);
// const listeTags = allTags.filter(tag => !tag.name.toLowerCase().startsWith("progression") && tag.name.toLowerCase() !== "progressions");

// const tags =listeTags.map((tag) => {
// return {
//    name:  tag.name,
//    count: tag.count,
//    slug : tag.slug
// }
// })
const tags1 = [
    { name: 'LIBERTE', count: 800, slug: '' },
    { name: 'EGALITE', count: 500, slug: '' },
    {
      name: 'MAGNEGNE',
      count: 1000,
      slug: ''
    }]




const tags = [
    { name: 'PERSONNAGES', count: 321, slug: 'personnages' },
    { name: 'PORTRAITS', count: 413, slug: 'portraits' },
    {
      name: 'TABLEAUX PLUS ANCIENS',
      count: 1012,
      slug: 'tableaux-plus-anciens'
    },
    {
      name: 'PAYSAGES SOUS-MARINS',
      count: 60,
      slug: 'paysages-sous-marins'
    },
    { name: 'ANJOU ET AILLEURS', count: 47, slug: 'anjou-et-ailleurs' },
    {
      name: 'SCENES ET PAYSAGES',
      count: 277,
      slug: 'scenes-et-paysages'
    },
    { name: 'COULEUR', count: 210, slug: 'couleur' },
    { name: 'NOIR ET BLANC', count: 346, slug: 'noir-et-blanc' },
    { name: 'NATURE MORTE', count: 12, slug: 'nature-morte' },
    { name: 'DESSINS', count: 353, slug: 'dessins' },
    { name: 'PAYSAGES', count: 67, slug: 'paysages' },
    { name: 'MUSIQUE', count: 3, slug: 'musique' },
    { name: 'AUTOPORTRAITS', count: 15, slug: 'autoportraits' },
    { name: 'BARGE', count: 3, slug: 'barge' },
    { name: 'GRANDS FORMATS', count: 5, slug: 'grands-formats' },
    { name: 'COMORES', count: 51, slug: 'comores' },
    { name: 'FRUITS', count: 6, slug: 'fruits' },
    { name: 'COURSE DE PNEUX', count: 2, slug: 'course-de-pneux' },
    { name: 'PLAGE', count: 3, slug: 'plage' },
    { name: 'COPIES', count: 1, slug: 'copies' },
    { name: 'ANIMAUX', count: 15, slug: 'animaux' },
    { name: 'OISEAUX', count: 6, slug: 'oiseaux' },
    { name: 'FLEURS', count: 2, slug: 'fleurs' },
    { name: 'PIROGueS', count: 4, slug: 'pirogues' },
    { name: 'ZEBU', count: 17, slug: 'zebu' },
    { name: 'Progressioin HENRI', count: 3, slug: 'progressioin-henri' },
    { name: 'BANANE', count: 4, slug: 'banane' },
    { name: 'COUCHER DE SOLEIL', count: 2, slug: 'coucher-de-soleil' },
    { name: 'CUISINE', count: 6, slug: 'cuisine' },
    { name: 'VOITURES', count: 1, slug: 'voitures' },
    { name: 'FEMMES', count: 1, slug: 'femmes' },
    { name: 'HOMMES', count: 2, slug: 'hommes' },
    { name: 'PAYSAGE', count: 1, slug: 'paysage' },
    { name: 'TABLEAUX RECENTS', count: 63, slug: 'tableaux-recents' },
    { name: 'RECENTS1', count: 41, slug: 'recents1' }
  ]



const textData = [
    "LIBERTE",
    "EGALITE",
    "MAGNEGNE"
  ];

const OverlayAnimation = () => {

    console.log(tags)

    const router = useRouter();
    const handleClick = () => {
        router.replace(`/`); // Navigation vers la page du tag
      };



  return (
    <div 
    onClick={ handleClick}
    className="relative h-screen w-screen overflow-hidden">
      {/* Animated image with a lower z-index */}
      <div className="absolute inset-0">
        <AnimatedImage />
      </div>

      <div className="absolute inset-0 z-10">
      <TagsDisplay tags={tags1} />
      </div>

      <div className="absolute inset-0 z-10">
      <TagsDisplay tags={tags} />
      </div>

      {/* Text and audio animation with a higher z-index */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
      <TextAudioAnimation textData={textData} audioUrl="/sons/extrait-son-video6-magnegne.mp3"/>
      </div>
    </div>
  );
};

export default OverlayAnimation;