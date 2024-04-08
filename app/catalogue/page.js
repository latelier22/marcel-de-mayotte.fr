

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

async function Page  () {
  const listePhotos = await getImages();

  const page= Pages["catalogue"];

  const pageTitle = page.title;
  const pageDescription = page.description;

  
  console.log(listePhotos);

  const listeTags = await getTags(listePhotos)

  console.log(listeTags)



  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      {/* <HeaderSimple  siteTitle ={site.title} title={pageTitle}/> */}

      <div className="pt-24 grid grid-cols-[auto,1fr] gap-8">
  {/* Tags sur la gauche avec une marge */}
  <div className="flex flex-col justify-start h-full">
    <Tags tags={listeTags} />
  </div>

  {/* Images à droite */}
  <div>
    <MyLightBox photos={listePhotos} />
  </div>
</div>

      <Footer />
    </RootLayout>
  );
};

export default Page;
