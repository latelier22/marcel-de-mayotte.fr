import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";
import { Pages, site } from "../../site";
import getImages from "../../components/getImages";
import getTags from "../../components/getTags";
import getImagesbyTag from "../../components/getImagesbyTag";
import getProgressionsTags from "../../components/getProgressionsTags";
import Cards from "../../Cards";
import { authOptions } from "../../Auth";
import TagsAndGallery from "../../components/album/TagsAndGallery";
import { getServerSession } from 'next-auth';

async function Page({ params }) {
  // Récupérer la session de l'utilisateur
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;
  const isAdmin = session && session.user.role === 'admin';

  const page = Pages["catalogue"];
  const pageTitle = page.title;
  const pageDescription = page.description;
  const tagSlug = params.tagSlug;

  const allPhotos = await getImages();
  const allTags = await getTags(allPhotos);

  // Récupérer les photos en fonction du tag ou toutes les photos si tagSlug = "favoris"
  let listePhotos;
  if (tagSlug === 'favoris' || tagSlug === 'non-publiees') {
    const allCataloguePhotos = await getImagesbyTag("catalogue-complet", userId);

    if
      (tagSlug === 'favoris') {
      listePhotos = allCataloguePhotos.filter(photo => photo.isFavorite);
    }
    if
      (tagSlug === 'non-publiees') {
      listePhotos = allCataloguePhotos.filter(photo => !photo.published);
    }


  }

  else {

    listePhotos = await getImagesbyTag(tagSlug, userId);
  }


const photos = listePhotos.map(photo => {
  const baseURL = photo.url.startsWith('/uploads')
    ? process.env.NEXT_PUBLIC_STRAPI_URL
    : `${site.vpsServer}/images/`;

  const imageUrl = `${baseURL}${photo.url}`;

  return {
    src: imageUrl,
    width: photo.width,
    height: photo.height,
    id: photo.id,
    tags: photo.tags,
    name: photo.name,
    dimensions: photo.dimensions,
    published: photo.published,
    isFavorite: photo.isFavorite,
    title: photo.title,
    description: photo.description
  };
});

const progressionsTags = await getProgressionsTags(listePhotos);

const tagCards = progressionsTags.slice(1).map(tag => ({
  title: tag.name.replace("Progression ", ""),
  text: "",
  button: "",
  buttonColor: "bg-gold-500",
  link: `/catalogue/${tag.slug}`,
  url: tag.url,
  alt: tag.name,
}));

// Marquer les tags présents dans listeTags
allTags.forEach(tag => {
  tag.present = listePhotos.some(photo => photo.tags.some(t => t.name === tag.name));
});

return (
  <main>
    <Navbar />
    <TagsAndGallery
      tagSlug={tagSlug}
      photos={photos}
      allTags={allTags}
      progressionsTags={progressionsTags}
      listeTags={allTags}
      tagCards={tagCards}
    />
    <Footer />
  </main>
);
}

export default Page;
