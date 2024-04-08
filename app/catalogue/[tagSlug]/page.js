import { useSearchParams } from "next/navigation";
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";

import getTags from "../../components/getTags"
import Tags from "../../components/Tags"
import MyCatalog from "../../MyCatalog"
import { Pages, site } from "../../site";
import getImagesbyTag  from "../../components/getImagesbyTag"


async function Page  ({ params }) {
  // const searchParams = useSearchParams();
  const tagSlug = params.tagSlug;
  // const nbPages = parseInt(searchParams.get("n"), 10); // Assurez-vous de spécifier la base 10 pour la conversion en nombre entier
  // const bookWidth = parseInt(searchParams.get("w"), 10); // Utilisez parseInt pour convertir la largeur en nombre entier
  // const bookHeight = parseInt(searchParams.get("h"), 10); // Utilisez parseInt pour convertir la hauteur en nombre entier

  const listePhotos = await getImagesbyTag(tagSlug);

  const page= Pages["catalogue"];

  const pageTitle = page.title;
  const pageDescription = page.description;

  // console.log(listePhotos);
  const listeTags = await getTags(listePhotos)
  // console.log(listeTags)

  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <div className="pt-24 pl-8 ml-8 grid grid-cols-[auto,1fr] gap-8">
        {/* Tags sur la gauche avec une marge */}
        <div className="flex mt-36 flex-col fixed top-0 h-screen max-h-full overflow-y-auto">
          <Tags tags={listeTags} />
        </div>

        {/* Images à droite */}
        <div className="ml-20">
          <MyCatalog photos={listePhotos} />
        </div>
      </div>
      <Footer />
    </RootLayout>
  );
};

export default Page;