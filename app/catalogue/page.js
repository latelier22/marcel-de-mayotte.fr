

import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import Cards from "../Cards";
import HeaderSimple from "../headerSimple";
import { Pages, site } from "../site";
import ArticleList from "../components/getPostsSlugs";
import TitleLine from "../TitleLine"
import MyLightBox from "../MyLightBox";
import getImages  from "../components/getImages"
import getTags from "../components/getTags"
import Tags from "../components/Tags"
import MyCatalog from "../MyCatalog"


async function Page  () {
  const listePhotos = await getImages();

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
