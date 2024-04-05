// components/FlipBook.js
import React from 'react';
import PageFlip from 'react-pageflip';
import FlipPage from 'react-flip-page';

function FlipBook( {livre, nbPages}) {
    // Récupérer les images du flip book depuis le dossier public/flipbook
    const images = [...Array(nbPages+1).keys()].map(index => `/livres/livre-${livre}/image_${index}.png`);

    return (
        <header>
            <div className="container mx-auto mt-16 md:py-8 md:px-12 lg:px-20 lg:py-12 animate-appear">
               
                <PageFlip width={512} height={661}>
                    {images.map((image, index) => (
                        <div key={index} className="page">
                            <img src={image} alt={`Page ${index + 1}`} />
                        </div>
                    ))}
                </PageFlip>
            </div>
        </header>
    );
}

export default FlipBook;
