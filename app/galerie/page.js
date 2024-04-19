

import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import { Pages, site } from "../site";
import photos from "../../public/photos.json"

import Gallery from "../components/album/Gallery"

import styles from '../page.module.css'; // Importez votre fichier CSS

async function Page() {

  const page = Pages["galerie"];
  const pageTitle = page.title;
  const pageDescription = page.description;

  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      
          <Gallery photos={photos} />
         
      <Footer />
    </RootLayout>
  );
};

export default Page;
