

import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import Cards from "../Cards";
import HeaderSimple from "../headerSimple";
import { Pages, site } from "../site";

import getImages from "../components/getImages"
import getTags from "../components/getTags"
import Tags from "../components/Tags"
import listePhotos from "../components/catalogue.json"

import Gallery from "../components/album/Gallery"

import styles from '../page.module.css'; // Importez votre fichier CSS

async function Page() {



  const page = Pages["catalogue"];
  const pageTitle = page.title;
  const pageDescription = page.description;

  const listePhotos = await getImages();
  const listeTags = await getTags(listePhotos)
  console.log(listeTags);

  const tagCards = listeTags.map(tag => ({
    title: tag.name,
    text: "",
    button: "",
    buttonColor: "bg-gold-500",
    link: `/catalogue/${tag.slug}`, // Utilisez le slug du tag comme lien
    url: tag.url, // Remplacez ceci par l'URL de l'image associée au tag si nécessaire
    alt: tag.name, // Remplacez ceci par la description de l'image associée au tag si nécessaire
  }));

  const photos = listePhotos.map((photo) => {
    // Vérifier si photo.dimensions est défini et n'est pas null
    if (photo.dimensions && photo.dimensions.length >= 2) {
      return {
        "src": `/images/${photo.url}`,
        "width": photo.dimensions[0],
        "height": photo.dimensions[1]
      };
    } else {
      // Gérer le cas où photo.dimensions est null ou n'a pas au moins deux éléments
      // Par exemple, vous pouvez retourner un objet par défaut ou ignorer cette photo
      return {
        "src": `/images/${photo.url}`,
        "width": 0, // Valeur par défaut pour la largeur
        "height": 0 // Valeur par défaut pour la hauteur
      };
    }
  });

  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <div className="grid flexflex-row grid-cols-12 justify-center items-start"
      style={{scrollbarWidth: 'thin', scrollbarColor: 'brown black'}} >  
        <div className="col-span-2 pt-16 px-16 sticky  text-white bg-yellow-200  top-0 h-screen max-h-full overflow-y-auto"> <Tags className="text-center " tags={listeTags}/>  </div>

        <div className="col-span-10 ">
          <Gallery photos={photos} />
        </div>
      </div>

      <Footer />
    </RootLayout>
  );
};

export default Page;
