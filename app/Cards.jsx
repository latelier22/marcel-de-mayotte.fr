"use client";
import { useEffect } from "react";
import Card from "./Card";

const Cards = ({ cards, buttonColor , syliusCard}) => {
  useEffect(() => {
    const init = async () => {
      const { Tooltip, initTE } = await import("tw-elements");
      initTE({ Tooltip });
    };
    init();
  }, []);

  return (
    <header>
      <div>
        <div className="container mx-auto py-2 md:py-8 md:px-12 lg:px-20 lg:py-12 animate-appear">
          <div className="m-5 flex flex-wrap md:-m-2 h-1/2">
            {/* Utiliser une boucle pour générer les éléments d'image */}
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex md:mb-8 justify-center w-full md:w-1/2 lg:w-1/3 flex-wrap "
              >
                <div style={{ flex: "1" }}>
                  <Card
                    index ={index}
                    syliusCard={syliusCard}
                    card={card}
                    buttonColor={
                      card.buttonColor === "" ? buttonColor : card.buttonColor
                    }
                  >
                    
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Cards;
