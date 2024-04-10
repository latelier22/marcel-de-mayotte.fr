"use client";
import { useEffect } from "react";
import MyModal from "./MyModal";
import { site } from "./site";
import Image from "next/image";

const Card = ({ index, card, buttonColor, children, syliusCard, label }) => {
  useEffect(() => {
    const init = async () => {
      const { Ripple, initTE } = await import("tw-elements");
      initTE({ Ripple });
    };
    init();
  }, []);

  buttonColor = "bg-gradient-to-br from-gold-900 via-gold-500 to-gold-800"

  return (
    <header>
      <div className=" md:mx-10 rounded-lg border-4 border-gold-700 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
        <a
          href="#!"
          className="relative rounded-t-lg  w-full h-0"
          style={{ paddingTop: "100%" }}
        >
          <div className="flew flex-row justify-center items-start">
         
      

<Image
          src= {syliusCard ? `${site.vpsServer}/images/${card.url}` : `images/${card.url}`}
          alt= {card.title}
          className={`mb-5 w-72 h-72  object-cover object-center cursor-zoom-in hover:object-contain data-[te-lightbox-disabled]:cursor-auto`}
          loading="lazy"
          width="300"
          height="300"
        />
          </div>
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
            <a href={`${card.link}?n=${card.nbPages}&w=${card.bookWidth}&h=${card.bookHeight}`}>
              <button
                type="button"
                className={`${buttonColor}  items-center rounded-2xl px-6 m-5 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-gold-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]`}
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                {/* {card.button} */} {label}
              </button>
            </a>
            <MyModal
              index={index}
              card={card}
              src= {syliusCard ? `${site.vpsServer}/images/${card.url}` : `images/${card.url}`}
              className={`${buttonColor}  items-center rounded-2xl px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]`}
            >
            </MyModal>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Card;
