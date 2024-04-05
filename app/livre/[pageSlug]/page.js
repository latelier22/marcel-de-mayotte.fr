"use client"

import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";
import FlipBook from "../../components/FlipBook"

const Page = ({ params }) => {
  const pageSlug = params.pageSlug;
  const pageTitle = 'Contact';
  const pageDescription = 'Restons en contact, telephone, email, réseaux sociaux';
  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <div className="container mx-auto py-2 md:py-8 md:px-12 lg:px-20 lg:py-12 animate-appear">
            <FlipBook livre={pageSlug} nbPages={10}/>
        </div>
      <Footer />
    </RootLayout>
  );
};

export default Page;
