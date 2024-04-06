// MyPage.js

import React from "react";
import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import HeaderSimple from "../headerSimple";
import Section from "../Section";
import Cards from "../Cards";
import MyLightBox from "../MyLightBox"
import { Pages, site } from "../site";

const MyPage = ({ params }) => {
  const pageSlug = params.pageSlug;
  const page = Pages[pageSlug];
  if (!page) {
    return (
      <RootLayout >
        <div className="min-h-screen flex flex-col justify-center items-center">
          <h1>Page non trouvée</h1>
        </div>
      </RootLayout>
    );
  }
  return (
    <RootLayout pageTitle={page.title} pageDescription={page.description}>

      <Navbar />

      <HeaderSimple photos={page.photos} siteTitle = {site.title} title={page.title}/>

      {/* <ImagesBar photos={page.photos} /> */}
      <MyLightBox photos={page.photos} />

      {/* {page.sections.map((section, index) => (
        <Section key={index} section={section} />
      ))} */}
     

      <div className="">
        <Cards cards={page.cards}  />
      </div>

      <Footer />
    </RootLayout>
  );
};

export default MyPage;
