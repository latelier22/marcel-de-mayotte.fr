// components/FlipBook.js
import React from 'react';
import PageFlip from 'react-pageflip';

function FlipBook( {livre, nbPages,bookWidth,bookHeight}) {
    // Récupérer les images du flip book depuis le dossier public/flipbook
    const images = [...Array(nbPages+1).keys()].map(index => `/livres/livre-${livre}/image_${index}.png`);

    console.log ( nbPages,bookWidth,bookHeight)
    console.log(images)

    return (
        <header>
            <div className="container mx-auto mt-16 md:py-8 md:px-12 lg:px-20 lg:py-12 animate-appear bg-black">
               
                <PageFlip width={bookWidth} height={bookHeight}>
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
