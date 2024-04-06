"use client";
import { useEffect } from "react";
import { menuItems, site } from "./site";
import Title from "./TitleLine";
import Image from 'next/image';
import Link from "next/link";

const Footer = () => {
  useEffect(() => {
    const init = async () => {
      const { Tooltip, initTE } = await import("tw-elements");
      initTE({ Tooltip });
    };
    init();
  }, []);


  // Définir un tableau d'objets pour les photos du footer
  const photoFooter = [
   
  ];

  return (
    <footer className="bg-neutral-200 text-center text-black dark:bg-neutral-900 dark:text-gold-400">
      <div className="flex items-center justify-center border-neutral-200 p-6 dark:border-neutral-500 lg:justify-end">
        <div className="mr-12 hidden md:block">
          {/* <span>Restons en contact sur les réseaux sociaux</span> */}
        </div>
        
      </div>

      <div className="mx-6 pt-8 pb-4 text-center">
        <div className="mb-6">
          <Title title = "***" />
          {/* <p className="mb-4 text-white">Contactez-moi!</p> */}
          <p className="mb-4 text-white">
           
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 mb-4">
          <div className="mb-6">
            <h5 className="mb-2.5 font-bold text-gold-800 dark:text-gold-800">
              Contact
            </h5>

            <ul className="mb-0 list-none text-black dark:text-gold-200">
              {/* <li>{site.societe}</li> */}
              <li>{site.contact}</li>
              <li>{site.adresse}</li>
              <li>{site.adresse2}</li>
              <li>{site.codePostal} {site.ville}</li>
              {/* <li>{site.telephone}</li> */}
              <a href="/contact">
              <li>{site.email}</li>
              </a>
              <br/>
              {/* <li className=" text-gold-800">N° de SIRET {site.SIRET}</li> */}
            </ul>
            <div className="flex justify-center items-center">
          <a href={site.facebook} className="flex flex-row mr-6 text-sky-700  dark:text-sky-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
            <p className="pl-4">La page facebook de Marcel Séjour !</p>
          </a>
          
        </div>
          </div>

          <div className="mb-6 flex-col flex items-center">
            <h5 className="mb-2.5 font-bold text-black dark:text-neutral-200">
              {/* DEVIS GRATUIT ! */}
            </h5>
            <img src="/images/logo-banniere.png" className="h-60  " alt="..." />
          </div>

          <div className="mb-6">
            <h5 className="mb-2.5 font-bold  text-gold-800  dark:text-gold-800">
              Nos services
            </h5>

            <ul className="mb-0 list-none">
              {menuItems.map((menuItem, index) => (
                <li key={index}>
                  <a
                    href={menuItem.route}
                    className=" text-black hover:dark:text-gold-800 dark:text-gold-200"
                  >
                    {menuItem.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      <div className="bg-neutral-200 p-6 text-center dark:bg-neutral-700 flex justify-center items-center">
        <span>&copy; 2023 Copyright: </span>

        <a className="mx-3" href="#">
          <img
            src="https://tecdn.b-cdn.net/img/logo/te-transparent-noshadows.webp"
            className="h-5"
            alt="TE Logo"
            loading="lazy"
          />
        </a>

        <a
          className="font-semibold text-neutral-600 dark:text-neutral-400"
          href="www.latelier22.fr"
        >
          L&apos;Atelier - Webdesign
        </a>
      </div>
    </footer>
  );
};

export default Footer;
