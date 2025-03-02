import React from "react";
import Navbar from "../NavBar";
import HeaderSimple from "../headerSimple";
import Footer from "../Footer";
import Section from "../Section";
import Banner from "../Banner";
import { sections, site, photos } from "../site";
import Citation from "../Citation";
import getCitations from "../components/getCitations";
import ImageSlider from "../components/sliders/ImageSlider";  // 👈 Import du composant

async function Accueil() {
  const pageTitle = "Accueil";
  const pageDescription = "Bienvenue sur le site de Marcel Séjour";

  const onlyPublished = true;
  const citations = await getCitations({ onlyPublished });

  return (
    <main>
      <Navbar />
      <HeaderSimple photos={photos} siteTitle={site.title} title={pageTitle} />

      <Citation citations={citations} section={sections[0]} />

      <ImageSlider /> {/* 👈 Ajout du slider ici */}

      <Banner photo={photos[0]} />
      <Section section={sections[0]} />

      <Footer />
    </main>
  );
}

export default Accueil;
