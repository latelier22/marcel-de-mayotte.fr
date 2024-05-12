import React from "react";
import ListCitations from "./ListCitations";
import TitleLine from "../../TitleLine";
import Link from "next/link";
import myFetch from "../../components/myFech"; // Importer la fonction myFetch
import fetchCitations from "../../components/fetchCitations";

async function Page() {
    
        
    const citations = await fetchCitations();
            
    return (
        <>
            <div className="pt-64">
                <TitleLine title="GESTION DES CITATIONS" />
            </div>

            {/* Liste des citations */}
            <div className="container mx-auto my-8 p-4 shadow-lg rounded">
                <ListCitations allCitations={citations}/>
            </div>
        </>
    );
}

export default Page;