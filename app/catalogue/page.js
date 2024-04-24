import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";

import { Pages, site } from "../site";

import getImages from "../components/getImages";
import Gallery from "../components/album/Gallery";

async function Page() {


  const page = Pages["catalogue"];
  const pageTitle = page.title;
  const pageDescription = page.description;
  // Définissez les tags à exclure
  const noSlugTags = ["PROGRESSIONS"];

  const allPhotos = await getImages(noSlugTags);

  const photos = allPhotos.map((photo) => {
    // Vérifier si photo.dimensions est défini et n'est pas null

    return {
      src: `${site.vpsServer}/images/${photo.url}`,
      width: photo.width,
      height: photo.height,
      id: photo.id,
      tags: photo.tags,
      name: photo.name,
      dimensions : photo.dimensions
    };

  });

  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <Gallery photos={photos} />
      <Footer />
    </RootLayout>
  );
};

export default Page;
