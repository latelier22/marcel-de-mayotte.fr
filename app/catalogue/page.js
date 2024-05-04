import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";

import { Pages, site } from "../site";

import getImages from "../components/getImages";
// import GalleryPrivate from "../components/album/GalleryPrivate";
import Gallery from "../components/album//Gallery";

import {authOptions} from "../Auth"
import { getServerSession } from 'next-auth';

async function Page() {

  const session = await getServerSession(authOptions);

  if (session) {
    // La session existe, vous pouvez accéder à `session.user`, `session.expires`, etc.
    console.log("connecté", session);
   
    
} else {
  
  console.log("non connecté");
}
  
const userId = session?.user?.id || null;

  const page = Pages["catalogue"];
  const pageTitle = page.title;
  const pageDescription = page.description;
  // Définissez les tags à exclure
  const noSlugTags = ["PROGRESSIONS"];

  const allPhotos = await getImages(noSlugTags,userId);

  const photos = allPhotos.map((photo) => {
    return {
        src: `${site.vpsServer}/images/${photo.url}`,
        width: photo.width,
        height: photo.height,
        id: photo.id,
        tags: photo.tags,
        name: photo.name,
        dimensions : photo.dimensions,
        published: photo.published, 
        isFavorite : photo.isFavorite,
        title : photo.title,
        description : photo.description
      };

  });

  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      {/* <GalleryPrivate photos={photos} />
       */}
        <Gallery photos={photos} />
      <Footer />
    </RootLayout>
  );
};

export default Page;
