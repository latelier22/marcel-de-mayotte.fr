"use client";

import "./puzzle.css";
import {JigsawPuzzle} from "react-jigsaw-puzzle/lib";
import "react-jigsaw-puzzle/lib/jigsaw-puzzle.css";

import React from 'react';
import img from "../../public/images/galerie-01-1-sd.jpg"

function Puzzle( {livre, nbPages,bookWidth,bookHeight}) {
    // Récupérer les images du flip book depuis le dossier public/flipbook
    const set = () => {
        setText("Félicitations!!");
    };

    return (
        <header>
            <div className="container flex- flex-roww mx-auto mt-16 md:py-8 md:px-12 lg:px-20 lg:py-12 animate-appear rounded-3xl bg-black">
            <JigsawPuzzle
                imageSrc={img}
                rows={3}
                columns={3}
                onSolved={set}
                className="jigsaw-puzzle"
            />
            </div>
        </header>
    );
}

export default Puzzle;
