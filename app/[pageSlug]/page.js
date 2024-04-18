
import React from "react";
import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import HeaderSimple from "../headerSimple";
import Section from "../Section";
import Cards from "../Cards";
import MyLightBox from "../MyLightBox";
import { Pages, site } from "../site";
import { permanentRedirect } from 'next/navigation';

const MyPage = ({ params }) => {
  const pageSlug = params.pageSlug;
  const page = Pages[pageSlug];

  // Check if the pageSlug is 'boutique' and redirect to 'boutique.marcel-de-mayotte.fr'
  if (pageSlug === "boutique") {
    permanentRedirect("https://boutique.marcel-de-mayotte.fr");
    return null; // Return null as we don't need to render anything in this case
  }

  if (!page) {
    return (
      <RootLayout>
        <div className="min-h-screen flex flex-col justify-center items-center">
          <h1>Page non trouvée</h1>
        </div>
      </RootLayout>
    );
  }
  
  return (
    <RootLayout pageTitle={page.title} pageDescription={page.description}>
      <Navbar />
      <HeaderSimple photos={page.photos} siteTitle={site.title} title={page.title}/>
      <MyLightBox photos={page.photos} />
      <div className="">
        <Cards cards={page.cards} />
      </div>
      <Footer />
    </RootLayout>
  );
};

export default MyPage;
