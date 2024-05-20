
import Link from "next/link";

import getBaseUrl from "../components/getBaseUrl";

const PostCard = ({ post }) => {
    console.log("card post", post)

    function formatContent(content, maxLength) {
        if (!content) return '';
        const words = content.split(' ');
        if (words.length > maxLength) {
            return words.slice(0, maxLength).join(' ') + '...';
        }
        return content;
    }

    const baseURL = post.imageUrl && getBaseUrl(post.imageUrl);

    return (
        <div className="card shadow-lg rounded overflow-hidden">
            {post.imageUrl ? (
                <img src={`${baseURL}${post.imageUrl}`} alt={post.title} className="w-full h-auto object-cover" />
            ) : (
                <div className="w-full h-auto flex items-center justify-center">
                    <span>No Image Available</span>
                </div>
            )}
            <div className="p-4 mx-auto w-full prose max-w-none bg-yellow-200">
                <h2 className="text-center my-4">{post.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: formatContent(post.content, 200) }} />
                <p className="text-right">- {post.auteur}</p>
                {/* <p className="text-right font-bold">{post.etat}</p> */}
                
                {post.comments.length <=1 ? (
                <p className="text-right font-bold"> ({post.comments.length}) commentaire</p> ): <p className="text-right font-bold"> ({post.comments.length}) commentaires</p>}
                <Link href={`/blog/${post.id}`} className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
                    Lire la suite...
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
