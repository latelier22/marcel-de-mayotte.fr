
import Navbar from "../NavBar";
import Footer from "../Footer";

import { Pages, site } from "../site";

import TitleLine from "../TitleLine";
import 'react-quill/dist/quill.snow.css'; // Import the CSS file for the Quill editor
import ListPosts from "./ListPosts"
import fetchPosts from "../components/fetchPosts";
import fetchComments from "../components/fetchComments";


async function Page  () {

  const page= Pages["blog"];
  const pageTitle = page.title;
  const pageDescription = page.description;

  const allPosts = await fetchPosts();


  return (
    <main>
     <Navbar />
      <div className="pt-64">
        <TitleLine title="GESTION DU BLOG" />
      </div>

      {/* Liste des citations */}
      <div className="container mx-auto my-8 p-4 shadow-lg rounded">
          <ListPosts allPosts={allPosts.filter((p) => p.etat ==="publiée")} />
      </div>

      <Footer />
    </main>
  );
};

export default Page;

        
