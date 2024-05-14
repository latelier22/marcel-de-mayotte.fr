import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";
import { Pages, site } from "../../site";
import getImages from "../../components/getImages";
import getTags from "../../components/getTags";
// import Tags from "../../components/Tags";
import getImagesbyTag from "../../components/getImagesbyTag";
// import Gallery from "../../components/album/Gallery";
import getProgressionsTags from "../../components/getProgressionsTags";
import Cards from "../../Cards";
import { authOptions } from "../../Auth"

import TagsAndGallery from "../../components/album/TagsAndGallery"


import { getServerSession } from 'next-auth';

async function Page({ params }) {
  // const searchParams = useSearchParams();

  const session = await getServerSession(authOptions);

  //   if (session) {
  //     // La session existe, vous pouvez accéder à `session.user`, `session.expires`, etc.
  //     console.log("connecté", session);


  // } else {

  //   console.log("non connecté");
  // }

  const userId = session?.user?.id || null;

  const isAdmin = session && session.user.role === 'admin';

  console.log("isAdmin", isAdmin)

  const page = Pages["catalogue"];
  const pageTitle = page.title;
  const pageDescription = page.description;

  const tagSlug = params.tagSlug;

  const allPhotos = await getImages();
  const allTags = await getTags(allPhotos);
  const listePhotos = await getImagesbyTag(tagSlug, userId);
  const listeAllTags = await getTags(listePhotos);

  // const listeTags = listeAllTags.filter(tag => !tag.name.toLowerCase().startsWith("progression") && tag.name.toLowerCase() !== "progressions");

  const listeTags = allTags;

  // Marquez les tags présents dans listeTags
  allTags.forEach((tag) => {
    tag.present = listeTags.some((listeTag) => listeTag.name === tag.name);
  });


  const photos = listePhotos.map((photo) => {
    // Vérifier si photo.dimensions est défini et n'est pas null
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

  }
  );

  const progressionsTags = await getProgressionsTags(listePhotos);


  const tagCards = progressionsTags.slice(1, progressionsTags.length).map((tag) => ({
    title: tag.name,
    text: "",
    button: "",
    buttonColor: "bg-gold-500",
    link: `/catalogue/${tag.slug}`, // Utilisez le slug du tag comme lien
    url: tag.url, // Remplacez ceci par l'URL de l'image associée au tag si nécessaire
    alt: tag.name, // Remplacez ceci par la description de l'image associée au tag si nécessaire
  }));


  return (
    <main>
      <Navbar />
      <TagsAndGallery
        tagSlug={tagSlug}
        photos={photos}
        allTags={allTags}
        progressionsTags={progressionsTags}
        listeTags={listeTags}
        tagCards={tagCards}
      />



      <Footer />
    </main>
  );
}

export default Page;
