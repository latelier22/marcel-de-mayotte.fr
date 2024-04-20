import React from 'react';
import citations from './citations.json'; // Assurez-vous que votre fichier JSON existe dans le dossier data
import getImages from './components/getImages';
import { site } from "./site"
import Image from 'next/image';

async function Citation() {

  const randomIndex = Math.floor(Math.random() * citations.length);
  const randomCitation = citations[randomIndex];
  const photos = await getImages();
  const photoindex = Math.floor(Math.random() * photos.length);
  const photo = photos[photoindex];

  console.log(photo);
  return (



    <section className="container mx-auto my-8 p-4 flex flex-row first-line:rounded-md dark:bg-black border-gold-500 border-solid border-2">
      <div className=''>
        <Image
          style={{
            width: '50%',
            height: 'auto',
          }}
          src={`${site.vpsServer}/images/${photo.url}`}
          alt="Citation Image"
          width={photo.dimensions[0]}
          height={photo.dimensions[1]}
        />
      </div>
      <div className="p-8 flex flex-col items-end  justify-end">
        <p className="italic text-white text-3xl">"{randomCitation.texte}"</p>
        <p className="text-right text-gray-200">{randomCitation.auteur}</p>
      </div>
    </section>


  );
};

export default Citation;




