"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const TagsDisplay = ({ tags }) => {
  const [visibleTags, setVisibleTags] = useState([]);
  const router = useRouter();





  useEffect(() => {
    const addTag = () => {
      const tagIndex = Math.floor(Math.random() * tags.length);
      const newTag = {
        ...tags[tagIndex],
        id: Math.random(), // Clé unique pour différencier les tags
        style: {
          left: `${Math.random() * 90}%`,
          top: `${Math.random() * 90}%`,
          fontSize: `${30 + tags[tagIndex].count / 10}px`,
          opacity: 1
        }
      };

      setVisibleTags(currentTags => [...currentTags, newTag]);

      // Planifie la diminution de l'opacité du tag après 3 secondes
      setTimeout(() => {
        setVisibleTags(currentTags => currentTags.map(tag =>
          tag.id === newTag.id ? { ...tag, style: { ...tag.style, opacity: 0 } } : tag
        ));
      }, 3000);

      // Continuation dans useEffect


    };

    const interval = setInterval(addTag, 1000); // Ajoute un tag chaque seconde

    return () => clearInterval(interval);
  }, [tags]);

  const handleTagClick = (slug) => {
    router.replace(`/catalogue/${slug}`); // Navigation vers la page du tag
  };

  return (
    <div>
      {visibleTags.map(tag => (
        <div
          key={tag.id}
          style={tag.style}
        //   onClick={() => handleTagClick(tag.slug)}
          className="absolute transition-opacity duration-3000 tag-container"
        >
            <span className="tag-text" onClick={() => handleTagClick(tag.slug)}>
          {tag.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TagsDisplay;
