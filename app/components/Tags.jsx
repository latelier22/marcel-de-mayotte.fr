import Link from "next/link";

const Tags = ({ tags }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <h2 className="col-span-1 mb-4 text-bold text-black">Liste des tags :</h2>
      {tags.map((tag, index) => (
        <Link href={`/catalogue/${tag.slug}`} key={index}>
          <div className={`text-base  text-black ${tag.present ? "border-gold-500 border-solid border-2" : ""} mr-2 px-2 rounded-sm inline-block mb-2`}>
            {tag.name} ({tag.count})
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Tags;
