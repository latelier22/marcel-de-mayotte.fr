import Navbar from "../NavBar";
import Footer from "../Footer";
import Cards from "../Cards";
import HeaderSimple from "../headerSimple";
import { Pages, site } from "../site";


const Page = () => {

  const page= Pages["videos"];

  const pageTitle = page.title;
  const pageDescription = page.description;
  return (
   <>
      <Navbar />
      <HeaderSimple  siteTitle ={site.title} title={pageTitle}/>

      <Cards className="mb-24" cards = {page.cards} label={"LIRE LA VIDEO"}/>



      <Footer />
      </>
  );
};

export default Page;
