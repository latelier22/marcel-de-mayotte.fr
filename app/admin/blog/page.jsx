import React from "react";
import TitleLine from "../../TitleLine";
// import RichTextEditor from "../../components/blog/RichTextEditor";
import ReactQuillEditor from "./ReactRichEditor"
import 'react-quill/dist/quill.snow.css'; // Import the CSS file for the Quill editor

// import myFetch from "../../components/myFetch"; // Importer la fonction myFetch

const content = [
  {
    "type": "heading",
    "children": [
      {
        "type": "text",
        "text": "Très lourdement trompé."
      }
    ],
    "level": 3
  },
  {
    "type": "paragraph",
    "children": [
      {
        "type": "text",
        "text": "« Lourdement » signifiant soit qu’il y a eu erreur totale d’appréciation, comme confondre le blanc et le noir par exemple, ou le haut et le bas, ou un feu vert avec un feu rouge, ou que l’erreur en question, même minime en apparence a causé un dommage considérable. Aucun dommage irréversible ne m’a été causé. L’erreur dont je parle ne m’a pas façonné, ni modifié ni transformé ; elle m’aura juste accompagné ; mais elle l’aura fait pendant trente ans."
      }
    ]
  },
  // Ajoutez le reste du contenu initial ici
];

const Page = async () => {
  const post = {
    id: 1,
    content: "salut",
    auteur: 'Auteur Exemple', // Remplacez par l'auteur réel
    etat: 'brouillon' // Ou 'publiée'
  };

  

  return (
    <>
      <div className="pt-64">
        <TitleLine title="GESTION DU BLOG" />
      </div>

      <div className="container mx-auto mb-48 text-2xl h-96">
        <ReactQuillEditor
          initialValue={post}
          className="mx-auto"
        />
      </div>

      <div className="container h-screen mx-auto my-8 p-4 shadow-lg rounded">
        <h1>Liste des articles</h1>
        <div key={post.id} className="p-4 border-b border-gray-300">
          <h2>{post.auteur}</h2>
          <div 
          className="text-2xl text-pink"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.content) }} />
        </div>
      </div>
    </>
  );
};

export default Page;
