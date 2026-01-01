"use client";
import { useEffect } from "react";
import Image from "next/image";
import MyModal from "./MyModal";

const Card = ({ index, card, buttonColor, children, syliusCard }) => {
  useEffect(() => {
    const init = async () => {
      const { Ripple, initTE } = await import("tw-elements");
      initTE({ Ripple });
    };
    init();
  }, []);

  buttonColor = "bg-gradient-to-br from-gold-900 via-gold-500 to-gold-800";

  const src = syliusCard ? card.url : `/images/${card.url}`; // <-- note le / au début

  return (
    <header>
      <div className="block md:mx-10 rounded-lg border-4 border-gold-700 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
        <a
          href="#!"
          className="block relative rounded-t-lg overflow-hidden w-full"
          style={{ aspectRatio: "1 / 1" }} // équivalent propre à ton paddingTop:100%
        >
          <Image
            src={src}
            alt={card.title || "image"}
            fill
            sizes="(min-width: 768px) 420px, 100vw"
            className="object-cover object-center"
            data-te-toggle="modal"
            data-te-target={`#myModal2-${index}`}
            priority={index < 2}
          />
        </a>

        <div className="p-6">
          <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
            {card.title}
          </h5>
          <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
            {card.text}
          </p>

          {children}

          <div className="flex flex-col items-center ">
            <a href={card.link}>
              <button
                type="button"
                className={`${buttonColor} items-center rounded-2xl px-6 m-5 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-gold-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0`}
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                DETAILS
              </button>
            </a>

            <MyModal
              index={index}
              card={card}
              image={src}
              className={`${buttonColor} items-center rounded-2xl px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out`}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Card;
