import React from "react";
import TitleLine from "../../TitleLine";
import 'react-quill/dist/quill.snow.css'; // Import the CSS file for the Quill editor
import fetchMenus from "../../components/getTags";

import getTags from "components/getTags";
import ManageTags from "./ManageTags";



async function Page () {

  const allTags = await getTags();
  const menuItems = await fetchMenus();


  console.log("allTags",allTags.slice(0,3))

  return (
    <>
      <div className="pt-64">
        <TitleLine title="GESTION DES MENUS ET TAGS" />
      </div>

      <div className="container mx-auto my-8 p-4 shadow-lg rounded">
          {/* <ManageTags allTags={allTags} /> */}
          <ManageTags allTags={allTags} menuItems={menuItems}/>
      </div>

    </>
  );
};

export default Page;