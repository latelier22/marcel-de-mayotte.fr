import Navbar from "../NavBar";
import Footer from "../Footer";

import { Pages, site } from "../site";

import TitleLine from "../TitleLine";
import AlertLoginRegister from "../AlertLoginRegister";
import "react-quill/dist/quill.snow.css"; // Import the CSS file for the Quill editor
import ListPosts from "./ListPosts";
import fetchPosts from "../components/fetchPosts";

import { authOptions } from "../Auth";
import { getServerSession } from "next-auth";

async function Page() {
  const session = await getServerSession(authOptions);
 

  const page = Pages["blog"];
  const pageTitle = page.title;
  const pageDescription = page.description;

  const allPosts = await fetchPosts();

  return (
    <main>
      <Navbar />
      <div className="pt-32">
        {!session && (<AlertLoginRegister />)}

        
        
        <TitleLine title="DERNIERS ARTICLES DU BLOG" />
      </div>

      <div className="container mx-auto my-8 p-4 shadow-lg rounded">
        <ListPosts
          allPosts={allPosts
            .slice()
            .reverse()
            .filter((p) => p.etat === "publiée")}
        />
      </div>
      {!session && (<AlertLoginRegister />)}
      <Footer />
    </main>
  );
}

export default Page;
