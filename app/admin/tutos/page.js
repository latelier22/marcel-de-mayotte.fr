import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";
import Cards from "../../Cards";
import HeaderSimple from "../../headerSimple";

import { Pages, site } from "../../site";

import React, { Suspense} from "react";
import ListVideos from "./ListVideos";
import TitleLine from "../../TitleLine";
import fetchFiles from "../../components/fetchFiles";
// import fetchPosts from "../../components/fetchPosts";
// import fetchPictures from "../../components/fetchPictures";
import DotLoaderSpinner from "../../components/spinners/DotLoaderSpinner";

async function Page  () {

  const page= Pages["tutos"];
  const pageTitle = page.title;
  const pageDescription = page.description;

  const files = await fetchFiles();

  return (
    <>
      
      {/* <Cards className="mb-24" cards = {page.cards} label={"LIRE LA VIDEO"}/> */}

      
            <div className="pt-64">
               <TitleLine title={pageTitle} />
          </div>
            <Suspense fallback={<div className="flex justify-center items-center"><DotLoaderSpinner isLoading={true}/></div>}>
               {/* Liste des fichiers */}
               <div className="container mx-auto my-8 p-4 shadow-lg rounded">
                   <ListVideos allFiles={files.filter(file => file.mime.startsWith("video/") && file.formats )} />
                </div>
            </Suspense>
        
    </>)

};

export default Page;
