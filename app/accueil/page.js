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


async function Accueil () {
  // Dynamic metadata for the home page
  const pageTitle = "Accueil";
  const pageDescription = "Bienvenue sur le site de Marcel Séjour";

  const backgroundColor = "bg-teal-500";

  const onlyPublished =true;

  const citations = await getCitations({onlyPublished});

  console.log(citations)

  // const publishedCitations = citations.filter(citation => citation.etat === "publiée")
  // console.log ("FILTER PUBLIEE", publishedCitations)

  return (
   <main>
      <Navbar />
      <HeaderSimple photos={photos} siteTitle ={site.title} title={pageTitle}/>
      {/* <Picto 
      s /> */}
      <Citation citations={citations} section={sections[0]} />

      <Banner photo = {photos[0]} />
      <Section section={sections[0]} />

      <Footer />
      </main>
  );
};

export default Accueil;
