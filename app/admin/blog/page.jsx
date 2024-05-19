import React from "react";
import TitleLine from "../../TitleLine";
import 'react-quill/dist/quill.snow.css'; // Import the CSS file for the Quill editor
import myFetch from '../../components/myFech';
import ListPosts from "./ListPosts"
import fetchPosts from "../../components/fetchPosts";
import fetchComments from "../../components/fetchComments";


    
        

 async function Page () {

  const allComments = await fetchComments();
  const allPosts = await fetchPosts();

  

  return (
    <>
      <div className="pt-64">
        <TitleLine title="GESTION DU BLOG" />
      </div>

      {/* Liste des citations */}
      <div className="container mx-auto my-8 p-4 shadow-lg rounded">
          <ListPosts allPosts={allPosts} allComments={allComments} />
      </div>
    </>
  );
};

export default Page;
