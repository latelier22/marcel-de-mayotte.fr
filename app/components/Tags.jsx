import Link from "next/link";

const Tags = ({ tags }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <h2 className="col-span-2 mb-4">Liste des tags :</h2>
      {tags.map((tag, index) => (
        <Link href={`/catalogue/${tag.slug}`} key={index}>
          <div className={`text-base ${tag.present ? "bg-red-500" : "bg-blue-500"} py-1 px-2 rounded-lg inline-block mb-2`}>
            {tag.name} ({tag.count})
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Tags;
