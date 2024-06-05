import Navbar from "../../NavBar";
import Footer from "../../Footer";
import fetchPosts from "../../components/fetchPosts";
import fetchPostBySlug from "../../components/fetchPostBySlug";
import fetchComments from "../../components/fetchComments";
import TitleLine from "../../TitleLine";
import { site } from "site";
import ListComments from "./ListComments";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

async function Page({ params }) {
  let postId = params.pageSlug;

  // Attempt to fetch the post by slug
  let postBySlug = await fetchPostBySlug(postId);

  // If post is found by slug, extract the ID
  if (postBySlug.length > 0) {
    postId = postBySlug[0].id;
  }

  // Fetch the full post details using the post ID
  const posts = await fetchPosts(postId);

  // If no post is found, return a 404 or similar page
  if (posts.length === 0) {
    return (
      <main>
        <Navbar />
        <div className="pt-64">
          <TitleLine title="Post Not Found" />
        </div>
        <Footer />
      </main>
    );
  }

  const post = posts[0];
  const comments = await fetchComments(post.id);
  const baseURL =
    post.imageUrl && post.imageUrl.startsWith("/uploads")
      ? process.env.NEXT_PUBLIC_STRAPI_URL
      : `${site.vpsServer}/images/`;

  const formattedCreatedAt = format(new Date(post.createdAt), "EEEE dd MMM. yyyy 'à' HH'h'mm", { locale: fr });
  const formattedUpdatedAt = format(new Date(post.updatedAt), "EEEE dd MMM. yyyy 'à' HH'h'mm", { locale: fr });

  return (
    <main>
      <Navbar />
      <div className="pt-64">
        <TitleLine title={post.title} />
      </div>

      <div className="container mx-auto my-8 p-4 shadow-lg rounded-2xl">
        {post.imageUrl ? (
          <img
            src={`${baseURL}${post.imageUrl}`}
            alt={post.title}
            className="w-1/3 h-auto object-cover mx-auto mb-4"
          />
        ) : (
          <div className="w-full h-auto flex items-center justify-center">
            <span>No Image Available</span>
          </div>
        )}
        <div className="p-4 mx-auto w-full prose prose-xl max-w-none bg-neutral-50">
          <h2 className="text-center my-4">{post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <p className="text-right">- {post.auteur}</p>
          <p className="text-sm text-right text-black rigth-4">Créé le : {formattedCreatedAt}</p>
          <p className="text-sm text-right text-black">(modifié le : {formattedUpdatedAt})</p>

          {post.comments.length <= 1 ? (
            <p className="text-right font-bold">
              {" "}
              ({post.comments.length}) commentaire
            </p>
          ) : (
            <p className="text-right font-bold">
              {" "}
              ({post.comments.length}) commentaires
            </p>
          )}
        </div>
      </div>
      <div className="container mx-auto p-4">
        <ListComments post={post} postComments={comments} />
      </div>

      <Footer />
    </main>
  );
}

export default Page;
