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
import getImagesbyTag from "components/getImagesbyTag";
import Book3d from "Iframe/Book3d"
import getTaxons from "../shop/getTaxons";
import Taxons from "../shop/components/Taxons";
import getProductVariantsFront from "../shop/getProductVariantsFront"; // 👈 Import de la fonction
import ProductCards from "../shop/components/ProductCards";


async function Accueil() {
  const pageTitle = "Accueil";
  const pageDescription = "Bienvenue sur le site de Marcel Séjour";

  const onlyPublished = true;
  const citations = await getCitations({ onlyPublished });
  const expoImages = await getImagesbyTag("expo-2025",null);

  const prepaImages = await getImagesbyTag("sallertaine-preparation",null);

  const taxons = await getTaxons(); // 👈 fetch server-side depuis /shop
  // const productVariantsFront = await getProductVariantsFront(); // 👈 fetch server-side depuis /shop


  // console.log("taxons", taxons)

  return (
    <main>
      <Navbar />
      <HeaderSimple photos={photos} siteTitle={site.title} title={pageTitle} />
      
      <ImageSlider images={expoImages} title={"Tableaux exposés en 2025..."} slug={"expo-2025"}/> {/* 👈 Ajout du slider ici */}

      <Citation citations={citations} section={sections[0]} />
      
      {/* <Taxons taxons={taxons} />  */}
      {/* 👈 Ajout de la liste des taxons */}
      {/* <ProductCards products={productVariantsFront} /> */}

      <Book3d />

      <ImageSlider images={prepaImages} title={"Préparatifs de l'exposition à Sallertaine, du 4 au 6 avril 2025"} slug={"sallertaine-preparation"}/> 


      <Banner photo={photos[0]} />
      <Section section={sections[0]} />

      <Footer />
    </main>
  );
}

export default Accueil;
