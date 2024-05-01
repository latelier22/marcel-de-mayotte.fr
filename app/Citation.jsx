"use client"

import React, { useState, useEffect } from "react";
import citations from "./citations.json"; // Assurez-vous que votre fichier JSON existe dans le dossier data

function Citation() {
  const [currentCitation, setCurrentCitation] = useState(null);
  const [gauche, setGauche] = useState(false);

  useEffect(() => {
    // Sélectionner une citation initiale au montage du composant
    const randomIndex = Math.floor(Math.random() * citations.length);
    const initialCitation = citations[randomIndex];
    setCurrentCitation(initialCitation);

    // Mettre à jour la citation toutes les 30 secondes
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * citations.length);
      const randomCitation = citations[randomIndex];
      setCurrentCitation(randomCitation);

      // Changer la direction de l'animation
      setGauche(Math.random() >= 0.5);
    }, 20000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, []); // Le tableau vide assure que cet effet ne s'exécutera qu'une fois après le montage du composant

  return (
    <>
      {currentCitation && (
        <div className={`container mx-auto my-8 p-4 flex justify-center items-stretch flex-row rounded-md dark:bg-black border-gold-500 border-solid border-2 ${gauche ? "animate-slideLeft" : "animate-slideRight"}`}>
          <div className="flex flex-col items-end justify-end">
            {Array.isArray(currentCitation) ? (
              currentCitation.map((citation, i) => (
                <div className="p-8 flex flex-col items-end justify-end" key={i}>
                  <p className="italic my-12 text-white text-3xl">&quot;{citation.texte}&quot;</p>
                  <p className="text-right text-gray-200">{citation.auteur}</p>
                </div>
              ))
            ) : (
              <div className="mx-12 flex flex-col justify-center items-end">
                <p className="italic my-12 text-white text-3xl">&quot;{currentCitation.texte}&quot;</p>
                <p className="text-right text-gray-200">{currentCitation.auteur}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Citation;
