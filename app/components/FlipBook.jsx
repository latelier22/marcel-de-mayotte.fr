// components/FlipBook.js
import React from 'react';
import PageFlip from 'react-pageflip';

function FlipBook() {
    // Récupérer les images du flip book depuis le dossier public/flipbook
    const images = [...Array(10).keys()].map(index => `/flipbook/image_${index + 1}.png`);

    return (
        <PageFlip width={600} height={400}>
            {images.map((image, index) => (
                <div key={index} className="page">
                    <img src={image} alt={`Page ${index + 1}`} />
                </div>
            ))}
        </PageFlip>
    );
}

export default FlipBook;
