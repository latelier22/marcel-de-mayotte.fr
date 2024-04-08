"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";
import MyLightBox from "../../MyLightBox"


const Page = ({ params }) => {
  const searchParams = useSearchParams();
  const pageSlug = params.pageSlug;
  const nbPages = parseInt(searchParams.get("n"), 10); // Assurez-vous de spécifier la base 10 pour la conversion en nombre entier
  const bookWidth = parseInt(searchParams.get("w"), 10); // Utilisez parseInt pour convertir la largeur en nombre entier
  const bookHeight = parseInt(searchParams.get("h"), 10); // Utilisez parseInt pour convertir la hauteur en nombre entier

  const pageTitle = "Contact";
  const pageDescription =
    "Restons en contact, telephone, email, réseaux sociaux";
  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <div className="container mx-auto py-2 md:py-8 md:px-12 lg:px-20 lg:py-12 animate-appear">
      <MyLightBox photos={page.photos} />
      </div>
      <Footer />
    </RootLayout>
  );
};

export default Page;
