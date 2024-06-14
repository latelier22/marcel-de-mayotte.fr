"use client"
import { useSearchParams } from "next/navigation";

import React from 'react';
import Tags from "../Tags";
import GalleryTri from "./GalleryTri";
import Cards from "../../Cards";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";

const TagsAndGallery = ({ params, photos, allTags, progressionsTags, listeTags, tagCards, tagSlug, tagId }) => {

    //     const storedPhotoIds = localStorage.getItem('selectedPhotoIds');
    //   if (storedPhotoIds) {
    //     console.log(JSON.parse(storedPhotoIds));
    //     // Clear the local storage after reading
    //     localStorage.removeItem('selectedPhotoIds');
    //   }

    const searchParams = useSearchParams();
    const pageSlug = params.pageSlug;
    const photosPerPage = parseInt(searchParams.get("photosPerPage"), 10); // Assurez-vous de spécifier la base 10 pour la conversion en nombre entier
    const currentPage = parseInt(searchParams.get("currentPage"), 10); // Utilisez parseInt pour convertir la largeur en nombre entier

    const isShowAdmin = useSelector((state) => state.showAdmin.isShowAdmin);
    const { data: session } = useSession(); // Récupérer les données de session

    const isAdmin = session && session.user.role === 'admin';

    // Détermine si les tags doivent être affichés en mode lecture seule
    const isReadOnly = !isAdmin || !isShowAdmin;

    return (
        <div className="grid grid-cols-12 justify-center items-start" style={{ scrollbarWidth: "thin", scrollbarColor: "brown black" }}>
            {isReadOnly && (
                <div className="col-span-2 pt-16 px-16 sticky text-white bg-yellow-200 top-0 h-screen max-h-full overflow-y-auto">
                    {tagSlug.startsWith("progression") ? (
                        <Tags className="text-center" tags={progressionsTags} />
                    ) : (
                        <Tags className="text-center" tags={listeTags} />
                    )}
                </div>
            )}
            <div className={`${isShowAdmin && isAdmin ? "col-span-12" : "col-span-10"} z-1 mt-28`}>
                {tagSlug === "progressions" ? (
                    <Cards cards={tagCards} syliusCard={true} label={"Voir les étapes..."} />
                ) : (
                    <GalleryTri photos={photos} allTags={allTags} tagSlug={tagSlug} tagId={tagId} queryPhotosPerPage={photosPerPage}
                        queryCurrentPage={currentPage} />
                )}
            </div>
        </div>
    );
}

export default TagsAndGallery;
