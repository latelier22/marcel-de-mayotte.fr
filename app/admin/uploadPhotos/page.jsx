import React, { Suspense } from "react";
import ListFiles from "./ListFiles";
import TitleLine from "../../TitleLine";
import fetchFiles from "../../components/fetchFiles";
import fetchPosts from "../../components/fetchPosts";
import fetchPictures from "../../components/fetchPictures";
import DotLoaderSpinner from "../../components/spinners/DotLoaderSpinner";

async function Page() {
  const files = await fetchFiles();
  const pictures = await fetchPictures();
  const posts = await fetchPosts();

  const fetchPhotoTags = async (photoId) => {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/getPhoto/${photoId}`);
      
      const photo = await response.json()
      console.log(photo)

      if (photo.success) {
        return photo.tags || [];
      } else {
        console.error(`Failed to fetch tags for photoId ${photoId}: ${photo.error}`);
        return [];
      }
    } catch (error) {
      console.error(`Failed to fetch tags for photoId ${photoId}: ${error.message}`);
      return [];
    }
  };

  const updatedFiles = await Promise.all(
    files.map(async (file) => {
      const picture = pictures.find((p) => p.fileId === file.id);
      let tags = [];
      if (picture && picture.imported && picture.photoId) {
        tags = await fetchPhotoTags(picture.photoId);
      }

      return {
        ...file,
        tags, // Ensure tags are resolved
        published: false,
        photoId: picture ? picture.photoId : null,
        imported: picture ? picture.imported : false,
        importedAt: picture ? picture.importedAt : null,
        uploadedAt: new Date(file.updatedAt),
        posts: [], // Initialize posts as an empty array
      };
    })
  );

  const fetchPostsForFiles = async (updatedFiles) => {
    return updatedFiles.map((file) => {
      const postsUsingFile = posts.filter(
        (post) =>
          post.medias.data &&
          post.medias.data.some((media) => media.id === file.id)
      );
      const postTitles = postsUsingFile.map((post) => post.title);
      return { ...file, posts: postTitles };
    });
  };

  const myFiles = await fetchPostsForFiles(updatedFiles);

  console.log(myFiles.slice(0, 5));

  return (
    <>
      <div className="pt-64">
        <TitleLine title="GESTION DES FICHIERS" />
      </div>
      <Suspense fallback={<div className="flex justify-center items-center"><DotLoaderSpinner isLoading={true} /></div>}>
        {/* Liste des fichiers */}
        <div className="container mx-auto my-8 p-4 shadow-lg rounded">
          <ListFiles allFiles={myFiles.filter(file => file.mime.startsWith("image/"))} allPictures={pictures} allPosts={posts} />
        </div>
      </Suspense>
    </>
  );
}

export default Page;
