import React from "react";
import RootLayout from "../layout";
import Navbar from "../NavBar";
import HeaderSimple from "../headerSimple";
import Footer from "../Footer";
import Cards from "../Cards";
import Section from "../Section";
import Banner from "../Banner";
import {cards, sections, site, photos} from "../site"
import Citation from "../Citation";
import getCitations from "../components/getCitations";
import Anim from "../Anim/Anim1"


async function Accueil () {
  // Dynamic metadata for the home page
  const pageTitle = "Accueil";
  const pageDescription = "Bienvenue sur le site de Marcel Séjour";

  const backgroundColor = "bg-teal-500";

  const citations = await getCitations()

  return (
   <main>
      <Navbar />
   <Anim/>
      </main>
  );
};

export default Accueil;
