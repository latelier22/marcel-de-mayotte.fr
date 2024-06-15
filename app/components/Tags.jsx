import Link from "next/link";

const Tags = ({ tags, slug }) => {
  // Filtrer les tags selon le slug
  const filteredTags = tags.filter(tag => !(slug === "progressions" && tag.name.toLowerCase().startsWith("progression")));

  // Séparer le tag "tableaux-recents" des autres tags
  const recentTag = filteredTags.find(tag => tag.slug === "tableaux-recents");
  const otherTags = filteredTags.filter(tag => tag.slug !== "tableaux-recents");

  return (
    <div className="grid grid-cols-1 md:gap-4 mt-8">
      <h2 className="col-span-1 mb-4 text-xl font-extrabold text-black">Liste des tags :</h2>
      {/* Afficher le tag "tableaux-recents" en premier */}
      {recentTag && (
        <Link href={`/catalogue/${recentTag.slug}`} key={recentTag.slug}>
          <div className={`text-base text-black ${recentTag.present ? "border-gold-500 border-solid border-2" : ""} mr-2 px-2 rounded-sm inline-block mb-2`}>
            {recentTag.name} ★ ({recentTag.count})
          </div>
        </Link>
      )}
      {/* Afficher les autres tags après */}
      {otherTags.map((tag, index) => (
        <Link href={`/catalogue/${tag.slug}`} key={index}>
          <div className={`text-base text-black ${tag.present ? "border-gold-500 border-solid border-2" : ""} mr-2 px-2 rounded-sm inline-block mb-2`}>
            {tag.name} ({tag.count})
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Tags;
