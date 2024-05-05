"use client"

import React from 'react';

import Tags from "../../components/Tags";
import Gallery from "../../components/album/Gallery";
import Cards from "../../Cards";

import { useSelector, useDispatch } from "react-redux";



const TagsAndGallery = ({ photos, allTags, progressionsTags, listeTags, tagCards, tagSlug }) => {


    const isShowAdmin = useSelector((state) => state.showAdmin.isShowAdmin);


    // Ensure tagSlug is included in the props if it's needed in this component.
    return (
        <div
    className="grid flexflex-row grid-cols-12 justify-center items-start"
    style={{ scrollbarWidth: "thin", scrollbarColor: "brown black" }}
>
    {!isShowAdmin && (
    <div className="col-span-2 pt-16 px-16 sticky  text-white bg-yellow-200  top-0 h-screen max-h-full overflow-y-auto">
        {tagSlug.startsWith("progression") ? (
            // Si tagSlug commence par "progressions", afficher progressionsTags
            <Tags className="text-center" tags={[...progressionsTags]} />
        ) : (
            // Sinon, afficher allTags
            <Tags className="text-center" tags={listeTags} />
        )}
    </div>)}
    <div className={`${isShowAdmin ? `col-span-12`:`col-span-10 `}   z-1 mt-28`}>
        {tagSlug === "progressions" ? (
            // Si tagSlug commence par "progressions", afficher progressionsTags
            <Cards cards={tagCards} syliusCard={true} label={"Voir les étapes..."} />
        ) : (
            // Sinon, afficher allTags
            <Gallery photos={photos} allTags={allTags} />
        )}
    </div>
</div>
    );
}

export default TagsAndGallery;
