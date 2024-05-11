import React from "react";
import ListCitations from "../ListCitations";
import TitleLine from "../../../TitleLine";
import CreateCitationForm from "./createCitationForm";

const Page = () => {
   
    return (
        <>
            <div className="pt-64">
                <TitleLine title="GESTION DES CITATIONS" />
            </div>

            <CreateCitationForm />

            <ListCitations />

           

            {/* Menu avec les boutons CRUD */}
            



        </>
    );
};

export default Page;
