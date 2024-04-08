"use client";


import Link from "next/link";

const Tags = ({tags}) => {

    const total = 1700;
  
    return (
     
      
        <div className="">
        <h2>Liste des tags :</h2>
        <ul>
          {tags.map((tag, index) => (
             <Link href={`/catalogue/${tag.slug}`} key={index}>
            <li>{tag.name} ({tag.count} / {total})</li>
            </Link>
          ))}
        </ul>
      </div>
      
  
    );
  };
  
  export default Tags;
  
  
  
  
  