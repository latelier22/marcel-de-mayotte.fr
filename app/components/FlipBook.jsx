"use client";

import dynamic from 'next/dynamic';
import Image from 'next/image';


// components/FlipBook.js
import React from 'react';
import PageFlip from 'react-pageflip';
const FlipPage = dynamic(() => import('react-flip-page'), { ssr: false });

function FlipBook( {livre, nbPages,bookWidth,bookHeight}) {
    // Récupérer les images du flip book depuis le dossier public/flipbook
    const images = [...Array(nbPages+1).keys()].map(index => `/livres/livre-${livre}/image_${index}.png`);

    return (
        <header>
            <div className="container flex flex-roww mx-auto mt-16 md:py-8 md:px-12 lg:px-20 lg:py-12 animate-appear rounded-3xl bg-black">
               
                <PageFlip className="mx-auto" width={bookWidth} height={bookHeight}>
                    {images.map((image, index) => (
                        <div key={index} className="page">
                            <Image 
                            src={image}
                            alt={`Page ${index + 1}`}
                            layout="fill" 
                            objectFit="contain"
                            className="rounded-lg shadow-lg"/>
                        </div>
                    ))}
                </PageFlip>
            </div>
        </header>
    );
}

export default FlipBook;
