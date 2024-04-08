"use client";

const Tags = ({tags}) => {

    const total = tags[0].count
  
    return (
     
      
        <div className="">
        <h2>Liste des tags :</h2>
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>{tag.name} ({tag.count} / {total})</li>
          ))}
        </ul>
      </div>
      
  
    );
  };
  
  export default Tags;
  
  
  
  
  