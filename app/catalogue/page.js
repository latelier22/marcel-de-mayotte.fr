

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

  

  const listeTags = await getTags(listePhotos)

  // console.log(listeTags)

  const tagCards = listeTags.map(tag => ({
    title: tag.name,
    text: "",
    button: "",
    buttonColor: "bg-gold-500",
    link: `/catalogue/${tag.slug}`, // Utilisez le slug du tag comme lien
    url: tag.url, // Remplacez ceci par l'URL de l'image associée au tag si nécessaire
    alt: tag.name, // Remplacez ceci par la description de l'image associée au tag si nécessaire
  }));

  


  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <div className="pt-24 pl-8 ml-8 grid grid-cols-12 gap-8">
        {/* Tags sur la gauche avec une marge */}
        <div className="flex mt-36 flex-col fixed top-0 h-screen max-h-full overflow-y-auto col-span-1">
          <Tags tags={listeTags} />
        </div>
        <div className=" col-span-2">
          
        </div>

        {/* Images à droite */}
        <div className="col-span-9 flex justify-center">
          {/* <MyCatalog photos={listePhotos} /> */}
          <Cards className="mb-24" cards = {tagCards} label={"PARCOURIR"} syliusCard={true}/>
        </div>
      </div>
      <Footer />
    </RootLayout>
  );
};

export default Page;
