import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";
import { Pages, site } from "../../site";
import getImages from "../../components/getImages";
import getTags from "../../components/getTags";
import getImagesbyTag from "../../components/getImagesbyTag";
import getProgressionsTags from "../../components/getProgressionsTags";
import TagsAndGallery from "../../components/album/TagsAndGallery";
import { authOptions } from "../../Auth";
import { getServerSession } from 'next-auth';
import fetchOrders from "../../components/fetchPhotoTagOrders";

async function Page({ params }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;
  const isAdmin = session && session.user.role === 'admin';

  const page = Pages["catalogue"];
  const tagSlug = params.tagSlug;

  const allPhotos = await getImages();
  const allTags = await getTags(allPhotos);

  let listePhotos = [];
  let photoTagOrders = [];

  if (tagSlug === 'favoris' || tagSlug === 'non-publiees') {
    const allCataloguePhotos = await getImagesbyTag("catalogue-complet", userId);

    if (tagSlug === 'favoris') {
      listePhotos = allCataloguePhotos.filter(photo => photo.isFavorite);
    }
    if (tagSlug === 'non-publiees') {
      listePhotos = allCataloguePhotos.filter(photo => !photo.published);
    }
  } else {
    const apiBaseUrl = process.env.NEXTAUTH_URL;

    const tagIdResponse = await fetch(`${apiBaseUrl}/api/getTagIdBySlug/${tagSlug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const tag = await tagIdResponse.json();

    photoTagOrders = await fetchOrders(tag.id);

    listePhotos = await getImagesbyTag(tagSlug, userId);

    // Apply custom order if available
    if (photoTagOrders.length > 0) {
      const orderedPhotoIds = photoTagOrders.map(order => order.photoId);
      listePhotos = listePhotos.sort((a, b) => {
        return orderedPhotoIds.indexOf(a.id) - orderedPhotoIds.indexOf(b.id);
      });
    }
  }

  // Fallback to default sorting by favorite, title, and name
  if (listePhotos.length > 0 && photoTagOrders.length === 0) {
    listePhotos.sort((a, b) => {
      const aFavorite = a.isFavorite ? 1 : 0;
      const bFavorite = b.isFavorite ? 1 : 0;
      if (aFavorite !== bFavorite) {
        return bFavorite - aFavorite;
      }

      const aTitle = a.title || "";
      const bTitle = b.title || "";

      if (aTitle && bTitle) {
        return aTitle.localeCompare(bTitle);
      }

      if (aTitle && !bTitle) {
        return -1;
      }

      if (!aTitle && bTitle) {
        return 1;
      }

      const aName = a.name || "";
      const bName = b.name || "";
      return aName.localeCompare(bName);
    });
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
