

import React from "react";
import Navbar from "../NavBar";
import HeaderSimple from "../headerSimple";
import Footer from "../Footer";
import Section from "../Section";
import Banner from "../Banner";
import {sections, site, photos} from "@/site"
import Citation from "../Citation";
import getCitations from "../components/getCitations";

import PageClient from "./PageClient"


async function Accueil () {
  // Dynamic metadata for the home page
  const pageTitle = "Accueil";
  const pageDescription = "Bienvenue sur le site de Marcel Séjour";

  const backgroundColor = "bg-teal-500";

  const onlyPublished =true;

  const citations = await getCitations({onlyPublished});


  return (
   <main>
      <Navbar />
      <HeaderSimple photos={photos} siteTitle ={site.title} title={pageTitle}/>
      {/* <Picto 
      s /> */}
      <Citation citations={citations} section={sections[0]} />
      <div className="h-96">

      <PageClient />
      </div>
{/* 
      <Banner photo = {photos[0]} /> */}
      <Section section={sections[0]} />

      <Footer />
      </main>
  );
};

export default Accueil;
