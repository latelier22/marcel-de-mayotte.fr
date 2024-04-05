"use client";
import { useEffect } from "react";

const ListeActionsGauche = ({
  actions,
  listeTitle,
  listeSubTitle,
  photo,
  gauche,
  children,
  bgColor
}) => {
  useEffect(() => {
    const init = async () => {
      const { Tooltip, initTE } = await import("tw-elements");
      initTE({ Tooltip });
    };
    init();
  }, []);


  return (
<div className={`container mx-auto px-5 py-2 lg:px-32 lg:pt-12 ${gauche ? "animate-slideLeft" : "animate-slideRight"}`}>
  <div className={`flex flex-col items-center ${gauche ? bgColor : ""}`}>
    <div className="flex flex-col md:flex-row align-middle items-center">
      <img
        alt={photo.alt}
        className={
          gauche
            ? "hidden"
            : "block md:h-1/3 md:w-1/3 object-cover rounded-lg"
        }
        src={`images/${photo.url}`}
      />
          <section className="container mx-auto mt-8 p-4">
            <h1
              className="text-4xl font-bold text-center mb-4"
              style={{ fontFamily: "knicknack-font" }}
            >
              {listeTitle}
            </h1>
            <h2 className="text-2xl font-bold mb-2">{listeSubTitle}</h2>
            {actions.length > 0 && (
              <ul className="list-disc ml-8">
                {actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            )}
            {children}
          </section>
          <img
            alt={photo.alt}
            className={
              !gauche
                ? "hidden"
                : "block md:h-1/3 md:w-1/3 object-cover rounded-lg"
            }
            src={`images/${photo.url}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ListeActionsGauche;
