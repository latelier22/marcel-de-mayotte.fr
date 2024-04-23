import React from "react";
import RootLayout from "../app/layout";
import Navbar from "./NavBar";
import HeaderSimple from "./headerSimple";
import Footer from "./Footer";
import Cards from "./Cards";
import Section from "./Section";
import Banner from "./Banner";
import {cards, sections, site, photos} from "./site"
import Citation from "./Citation";

const Home = () => {
  // Dynamic metadata for the home page
  const pageTitle = "Accueil";
  const pageDescription = "Bienvenue sur le site de Marcel Séjour";

  // DÃ©clarer les photos dans un tableau d&apos;objets
  // console.log(photos);

  const backgroundColor = "bg-teal-500";

  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <HeaderSimple photos={photos} siteTitle ={site.title} title={pageTitle}/>
      {/* <Picto
      s /> */}
       <Citation section={sections[0]} />
      <Banner photo = {photos[0]} />
      <Section section={sections[0]} />

      

      <Footer />
    </RootLayout>
  );
};

export default Home;
