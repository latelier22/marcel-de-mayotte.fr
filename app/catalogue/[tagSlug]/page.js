import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";
import { Pages, site } from "../../site";
import getImages from "../../components/getImages";
import getTags from "../../components/getTags";
import Tags from "../../components/Tags";
import getImagesbyTag from "../../components/getImagesbyTag";
import Gallery from "../../components/album/Gallery";
import TitleLine from "../../TitleLine";
import getProgressionsTags from "../../components/getProgressionsTags";
import Cards from "../../Cards";

async function Page({ params }) {
  // const searchParams = useSearchParams();
  const page = Pages["catalogue"];
  const pageTitle = page.title;
  const pageDescription = page.description;

  const tagSlug = params.tagSlug;

  const allPhotos = await getImages();
  const allTags = await getTags(allPhotos);
  const listePhotos = await getImagesbyTag(tagSlug);
  const listeAllTags = await getTags(listePhotos);

const listeTags = listeAllTags.filter(tag => !tag.name.toLowerCase().startsWith("progression") && tag.name.toLowerCase() !== "progressions");

  // Marquez les tags présents dans listeTags
  allTags.forEach((tag) => {
    tag.present = listeTags.some((listeTag) => listeTag.name === tag.name);
  });

  const photos = listePhotos.map((photo) => {
    // Vérifier si photo.dimensions est défini et n'est pas null
    if (photo.dimensions && photo.dimensions.length >= 2) {
      return {
        src: `${site.vpsServer}/images/${photo.url}`,
        width: photo.dimensions[0],
        height: photo.dimensions[1],
        id: photo.numero,
        tags : photo.tags,
        name: photo.name
      };
    } else {
      // Gérer le cas où photo.dimensions est null ou n'a pas au moins deux éléments
      // Par exemple, vous pouvez retourner un objet par défaut ou ignorer cette photo
      return {
        src: `${site.vpsServer}/images/${photo.url}`,
        width: 0, // Valeur par défaut pour la largeur
        height: 0, // Valeur par défaut pour la hauteur
        id: photo.numero,
        name: photo.name
      };
    }
  });

  const progressionsTags = await getProgressionsTags(listePhotos);
  // console.log(progressionsTags.slice(1,progressionsTags.length));

  const tagCards = progressionsTags.slice(1,progressionsTags.length).map((tag) => ({
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

      <div
        className="grid flexflex-row grid-cols-12 justify-center items-start"
        style={{ scrollbarWidth: "thin", scrollbarColor: "brown black" }}
      >
        <div className="col-span-2 pt-16 px-16 sticky  text-white bg-yellow-200  top-0 h-screen max-h-full overflow-y-auto">
          {tagSlug.startsWith("progression") ? (
            // Si tagSlug commence par "progressions", afficher progressionsTags
            <Tags className="text-center" tags={[...progressionsTags]} />
          ) : (
            // Sinon, afficher allTags
            <Tags className="text-center" tags={listeTags} />
          )}
        </div>
        <div className="col-span-10  mt-28">
          {tagSlug === "progressions" ? (
            // Si tagSlug commence par "progressions", afficher progressionsTags
            <Cards cards={tagCards} syliusCard={true} label={"Voir les étapes..."}/>
          ) : (
            // Sinon, afficher allTags
            <Gallery photos={photos} />
          )}
        </div>
      </div>

      <Footer />
    </RootLayout>
  );
}

export default Page;
