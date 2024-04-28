

import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import { Pages, site } from "../site";
import photos from "../../public/photos.json"

import GalleryRecent from "../components/album/GalleryRecent"
// import Gallery from "../components/album/Gallery"
import TitleLine from "../TitleLine"

import styles from '../page.module.css'; // Importez votre fichier CSS

async function Page() {

  const page = Pages["galerie"];
  const pageTitle = page.title;
  const pageDescription = page.description;

  const photosWithAlt = photos.map(photo => ({
    ...photo,
    alt: photo.src // Utiliser la source de l'image comme valeur pour l'attribut "alt"
  }));


  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <TitleLine titel = {"GALERIE"} />
          <GalleryRecent className="relative mt-36"  photos={photosWithAlt} />
         
      <Footer />
    </RootLayout>
  );
};

export default Page;
