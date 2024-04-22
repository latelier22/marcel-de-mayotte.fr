import React from "react";
import citations from "./citations.json"; // Assurez-vous que votre fichier JSON existe dans le dossier data
import getImages from "./components/getImages";
import { site } from "./site";
import Image from "next/image";

async function Citation() {
  const randomIndex = Math.floor(Math.random() * citations.length);
  const randomCitation = citations[randomIndex];
  const photos = await getImages();
  const photoindex = Math.floor(Math.random() * photos.length);
  const photo = photos[photoindex];
  const gauche = Math.random() >= 0.5;

  const citationsElements = () => {
    if (Array.isArray(randomCitation)) {
      // Si l'élément est un tableau, afficher les citations l'une après l'autre
      return (
        <div>
          <div
            className={`container mx-auto my-8 p-4 flex justify-center items-stretch flex-row rounded-md dark:bg-black border-gold-500 border-solid border-2 ${
              gauche ? "animate-slideLeft" : "animate-slideRight"
            }`}
          >

            <div className="flex flex-col items-end  justify-end">
              {randomCitation.map((citation, i) => (
                <div
                  className="p-8 flex flex-col items-end  justify-end"
                  key={i}
                >
                  <p className="italic my-12 text-white text-3xl">
                    &quot;{citation.texte}&quot;
                  </p>
                  <p className="text-right text-gray-200">{citation.auteur}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <section
          key={randomIndex}
          className={`container mx-auto my-8 p-4 flex flex-row justify-center items-stretch rounded-md dark:bg-black border-gold-500 border-solid border-2 ${
            gauche ? "animate-slideLeft" : "animate-slideRight"
          }`}
        >
          

          <div className="mx-12  flex flex-col justify-center items-end">
            <p className="italic my-12 text-white text-3xl">
              &quot;{randomCitation.texte}&quot;
            </p>
            <p className="text-right text-gray-200">{randomCitation.auteur}</p>
          </div>
        </section>
      );
    }
  };

  return <>{citationsElements()}</>;
}

export default Citation;
