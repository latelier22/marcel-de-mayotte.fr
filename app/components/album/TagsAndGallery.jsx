"use client"
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from 'react';
import Tags from "../../components/Tags";
import Gallery from "../../components/album/Gallery";
import Cards from "../../Cards";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";

const TagsAndGallery = ({ params, photos, allTags, progressionsTags, listeTags, tagCards, tagSlug, tagId }) => {
    const searchParams = useSearchParams();
    const pageSlug = params.pageSlug;
    const photosPerPage = parseInt(searchParams.get("photosPerPage"), 10);
    const currentPage = parseInt(searchParams.get("currentPage"), 10);

    const isShowAdmin = useSelector((state) => state.showAdmin.isShowAdmin);
    const { data: session } = useSession();

    const isAdmin = session && session.user.role === 'admin';
    const isReadOnly = !isAdmin || !isShowAdmin;

    const [showTags, setShowTags] = useState(false);

    const handleToggleTags = () => {
        setShowTags(!showTags);
    };

    // Use effect to hide tags on initial render for small screens
    useEffect(() => {
        if (window.innerWidth < 768) {
            setShowTags(false);
        }
    }, []);

    return (
        <div className="flex flex-col md:grid md:grid-cols-12 md:justify-center items-start" style={{ scrollbarWidth: "thin", scrollbarColor: "brown black" }}>
            {isReadOnly && (
                <div className="w-full md:col-span-2 md:pt-16 text-white bg-yellow-200 top-0 md:h-screen md:max-h-full overflow-y-auto">
                    <button
                        className="md:hidden w-full bg-yellow-500 text-black p-2 flex justify-between items-center"
                        onClick={handleToggleTags}
                    >
                        <span>Voir les catégories</span>
                        <span>{showTags ? '▲' : '▼'}</span>
                    </button>
                    {(showTags || window.innerWidth >= 768) && (
                        <div className={`mt-4 md:mt-0 ${showTags ? 'block' : 'hidden md:block'}`}>
                            {tagSlug.startsWith("progression") ? (
                                <Tags className="text-center" tags={progressionsTags} />
                            ) : (
                                <Tags className="text-center" tags={listeTags} />
                            )}
                        </div>
                    )}
                </div>
            )}
            <div className={`${isShowAdmin && isAdmin ? "col-span-12" : "w-full md:col-span-10"} z-1 mt-4 md:mt-28`}>
                {tagSlug === "progressions" ? (
                    <Cards cards={tagCards} syliusCard={true} label={"Voir les étapes..."} />
                ) : (
                    <Gallery photos={photos} allTags={allTags} tagSlug={tagSlug} tagId={tagId} queryPhotosPerPage={photosPerPage} queryCurrentPage={currentPage} />
                )}
            </div>
        </div>
    );
}

export default TagsAndGallery;
