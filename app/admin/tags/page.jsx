import React from "react";
import TitleLine from "../../TitleLine";
import "react-quill/dist/quill.snow.css"; // Import the CSS file for the Quill editor

import TagsTree from "./TagsTree";

async function Page() {
  return (
    <>
      <div className="pt-64">
        <TitleLine title="GESTION DES MENUS ET TAGS" />
      </div>

      <div className="container mx-auto my-8 p-4 shadow-lg rounded">
        <div className="w-1/2 mx-auto">
          <TagsTree />
        </div>
      </div>
    </>
  );
}

export default Page;
