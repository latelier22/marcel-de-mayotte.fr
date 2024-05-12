import React from "react";
import ListFiles from "./ListFiles";
import TitleLine from "../../TitleLine";
import fetchFiles from "../../components/fetchFiles";

async function Page() {
    
        
    const files = await fetchFiles();

    console.log("Page files", files)
            
    return (
        <>
            <div className="pt-64">
                <TitleLine title="GESTION DES FICHIERS" />
            </div>

            {/* Liste des citations */}
            <div className="container mx-auto my-8 p-4 shadow-lg rounded">
                <ListFiles allFiles={files}/>
            </div>
        </>
    );
}

export default Page;