

import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import Cards from "../Cards";
import HeaderSimple from "../headerSimple";
import { Pages, site } from "../site";
import ArticleList from "../components/getPostsSlugs";
import TitleLine from "../TitleLine"


const Page = () => {

  const page= Pages["blog"];

  const pageTitle = page.title;
  const pageDescription = page.description;
  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <HeaderSimple  siteTitle ={site.title} title={pageTitle}/>

      <TitleLine  title ={"PAGE 1"}/>
      <ArticleList url="https://liberteegalitemagnegne.fr/index.php/author/marcelsejour/" />
      <TitleLine  title ={"PAGE 2"}/>
      <ArticleList url="https://liberteegalitemagnegne.fr/index.php/author/marcelsejour/page/2/" />



      {/* <Cards className="mb-24" cards = {page.cards} label={"FEUILLETER LE LIVRE"} /> */}



      <Footer />
    </RootLayout>
  );
};

export default Page;
