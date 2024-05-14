import React, { Suspense} from "react";
import ListFiles from "./ListFiles";
import TitleLine from "../../TitleLine";
import fetchFiles from "../../components/fetchFiles";
import DotLoaderSpinner from "../../components/spinners/DotLoaderSpinner";


async function Page() {
    
        
    const files = await fetchFiles();

    // console.log("Page files", files)
    return (
        <>
            <div className="pt-64">
                <TitleLine title="GESTION DES FICHIERS" />
            </div>
            <Suspense fallback={<div className="flex justify-center items-center"><DotLoaderSpinner isLoading={true}/></div>}>
                {/* Liste des fichiers */}
                <div className="container mx-auto my-8 p-4 shadow-lg rounded">
                    <ListFiles allFiles={files} />
                </div>
            </Suspense>
        </>
    );
}

export default Page;