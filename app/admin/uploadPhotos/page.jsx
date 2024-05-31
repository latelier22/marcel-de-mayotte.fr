import React, { Suspense} from "react";
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
    // console.log(files)
    console.log(pictures.slice(0,5))
    
    return (
        <>
            <div className="pt-64">
                <TitleLine title="GESTION DES FICHIERS" />
            </div>
            <Suspense fallback={<div className="flex justify-center items-center"><DotLoaderSpinner isLoading={true}/></div>}>
                {/* Liste des fichiers */}
                <div className="container mx-auto my-8 p-4 shadow-lg rounded">
                    <ListFiles allFiles={files} allPictures={pictures} allPosts={posts} />
                </div>
            </Suspense>
        </>
    );
}

export default Page;