"use client"

import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import FlipBook from "../components/FlipBook"

const Page = () => {
  const pageTitle = 'Contact';
  const pageDescription = 'Restons en contact, telephone, email, réseaux sociaux';
  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <div>
            <h1>Mon Flip Book</h1>
            <FlipBook />
        </div>
      <Footer />
    </RootLayout>
  );
};

export default Page;
