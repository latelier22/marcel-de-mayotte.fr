
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";

import { Pages, site } from "../../site";

import getImages from "../../components/getImages"
import getTags from "../../components/getTags"
import Tags from "../../components/Tags"
import getImagesbyTag  from "../../components/getImagesbyTag"
import listePhotos from "../../components/catalogue.json"

import Gallery from "../../components/album/Gallery"


async function Page  ({ params }) {
  // const searchParams = useSearchParams();
  const page= Pages["catalogue"];
  const pageTitle = page.title;
  const pageDescription = page.description;

  const tagSlug = params.tagSlug;


  const allPhotos = await getImages();
  const allTags = await getTags(allPhotos);
  const listePhotos = await getImagesbyTag(tagSlug);
  const listeTags = await getTags(listePhotos)
  
// Marquez les tags présents dans listeTags
allTags.forEach(tag => {
  tag.present = listeTags.some(listeTag => listeTag.name === tag.name);
});



  console.log(listePhotos.slice(0,9));

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

  console.log(photos);



 
  //  console.log(allTags)

  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <div className="grid flexflex-row grid-cols-12 justify-center items-start"
      style={{scrollbarWidth: 'thin', scrollbarColor: 'brown black'}} >  
        <div className="col-span-2 pt-16 px-16 sticky  text-white bg-yellow-200  top-0 h-screen max-h-full overflow-y-auto"> <Tags className="text-center " tags={allTags}/>  </div>

        <div className="col-span-10 ">
          <Gallery photos={photos} mysize={400}/>
        </div>
      </div>

      <Footer />
    </RootLayout>
  );
};

export default Page;