"use client"

import myFetch from '../../components/myFech';
import React, { useState, useEffect, useRef } from 'react';

// pages/ListFiles.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import myFetch from '../../components/myFetch';

function ListFiles({ allFiles }) {
    const [files, setFiles] = useState(allFiles);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const fileInputRef = useRef(null);
    const [editing, setEditing] = useState(false);
    const [creatingNew, setCreatingNew] = useState(false);
    const containerRef = useRef(null);
    // Utilisez un état pour gérer les fichiers sélectionnés
    const [selectedFileIds, setSelectedFileIds] = useState([]);

    // Gérer le clic sur une ligne pour sélectionner/désélectionner des fichiers
    const handleFileClick = (fileId) => {
        setSelectedFileIds(prev => {

            if (prev.includes(fileId)) {
                return prev.filter(id => id !== fileId); // Désélectionner le fichier
            } else {
                return [...prev, fileId]; // Sélectionner le fichier
            }
        });

    };

    // Afficher en console la liste des IDs des fichiers sélectionnés chaque fois que celle-ci change
    useEffect(() => {
        console.log("Selected File IDs:", selectedFileIds);
    }, [selectedFileIds]);  // Ajoutez selectedFileIds comme dépendance de cet effet

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSelectedFileIds([]);
                setEditing(false);
                setCreatingNew(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // const handleImportImage = (fileId) => {
    //     const file = files.find(f => f.id === fileId);
    //     console.log(`Importing image with ID: ${fileId}`, file);
    //     // Ajouter ici la logique d'importation
    // };


    const handleImportImage = async (selectedFileIds) => {
        // Recherche des fichiers sélectionnés
        const selectedFiles = files.filter(file => selectedFileIds.includes(file.id));
    
        if (selectedFiles.length === 0) {
            console.error("No files selected");
            return;
        }
    
        console.log("Importing images:", selectedFiles);
    
        try {
            // Préparation des données à envoyer au backend
            const photosData = selectedFiles.map(file => ({
                numero: file.id,
                name: file.name,
                dimensions: `${file.width}x${file.height}`,
                url: file.url,
                width: file.width,
                height: file.height,
                title: file.title || 'Default Title',
                description: file.description || ''
            }));
    
            const response = await fetch('/api/importPhotos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    photos: photosData
                })
            });
    
            if (!response.ok) {
                throw new Error("Failed to import images");
            }

            const result = await response.json()

            const photoIds = result.photoIds

            console.log("reponse importPhoto", photoIds)

             // Appel de l'API pour ajouter le tag 'IMPORT'
        const tagResponse = await fetch('/api/updateTagInBulk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                addTag: true,
                selectedPhotoIds: photoIds,
                selectedTag: 'IMPORT'
            })
        });

    const resultTag = await tagResponse.json()
            
            console.log('Photos added and tagged successfully:', result, resultTag);
        } catch (error) {
            console.error("Failed to import images:", error);
        }
    };
    




    // Chargez les fichiers initiaux et mettez-les dans l'ordre inverse pour que les plus récents soient en haut

    const handleUploadImage = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('files', file);

        try {
            const response = await myFetch('/api/upload', 'POST', formData, 'image upload');
            if (response) {
                const newFile = response[0]
                console.log("File received by fetch:", newFile);
                setFiles([...files, newFile]); // Ajoutez les nouveaux fichiers en haut de la liste
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };


    const handleDeleteImage = (fileId) => {
        const file = files.find(f => f.id === fileId);
        console.log(`Deletind image with ID: ${fileId}`, file);
        // Ajouter ici la logique d'importation
    };
    const handleEditImage = (fileId) => {
        const file = files.find(f => f.id === fileId);
        console.log(`Editing image with ID: ${fileId}`, file);
        // Ajouter ici la logique d'importation
    };

    return (
        <div ref={containerRef} className="container mx-auto my-8 p-4 shadow-lg rounded">
            <div className="flex flex-row justify-start items-center gap 2"></div>
            <button onClick={() => fileInputRef.current.click()} disable={selectedFileId} className={`${selectedFileId ? 'hidden' : ''} bg-green-500 text-white px-4 py-2 rounded mb-4 `}>
                Upload Image
            </button>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadImage} />
            {selectedFileIds.length >= 2 && (
                <>
                    <button onClick={(e) => {
                        e.stopPropagation(); // Prévenir l'événement onClick de la ligne
                        handleImportImage(selectedFileIds);
                    }} className="bg-green-500 text-white px-4 py-2 rounded">
                        Import
                    </button>
                    <button onClick={(e) => {
                        e.stopPropagation(); // Prévenir l'événement onClick de la ligne
                        handleDeleteImage(selectedFileIds);
                    }} className="bg-red-500 text-white px-4 py-2 rounded">
                        Delete
                    </button>
                    <button onClick={(e) => {
                        e.stopPropagation(); // Prévenir l'événement onClick de la ligne
                        handleEditImage(selectedFileIds);
                    }} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Edit
                    </button>
                </>
            )}


            <table className="w-full">
                <thead className="bg-red-900">
                    <tr className="text-center">
                        <th className="py-2">ID</th>
                        <th className="py-2">Image</th>
                        <th className="py-2 w-1/5">Name</th>
                        <th className="py-2 w-1/5">Title</th>
                        <th className="py-2 w-1/5">Tags</th>
                        <th className="py-2">Width (px)</th>
                        <th className="py-2">Height (px)</th>
                        <th className="py-2">Size </th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {files.slice().reverse().map(file => (
                        <tr key={file.id} onClick={() => handleFileClick(file.id)}
                            className={`${selectedFileIds.includes(file.id) ? 'border-green-500 border-solid border-2 rounded-md' : ''
                                } text-center cursor-pointer hover:bg-gray-800`}
                        >
                            <td className="py-2">{file.id}</td>
                            <td className="py-2">
                                <img src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${file.url}`} alt={file.name} style={{ width: 100, height: 'auto' }} />
                            </td>
                            <td className="py-2 w-1/5">{file.name}</td>
                            <td className="py-2 w-1/5">{file.title}</td>
                            <td className="py-2 w-1/5">{file.tags}</td>
                            <td className="py-2">{file.width}</td>
                            <td className="py-2">{file.height}</td>
                            <td className="py-2">{file.size} ko</td>
                            <td className="py-2">
                                {(selectedFileIds.length === 1) && selectedFileIds.includes(file.id) && (
                                    <>
                                        <button onClick={(e) => {
                                            e.stopPropagation(); // Prévenir l'événement onClick de la ligne
                                            handleImportImage(selectedFileIds);
                                        }} className="bg-green-500 text-white px-4 py-2 rounded">
                                            Import
                                        </button>
                                        <button onClick={(e) => {
                                            e.stopPropagation(); // Prévenir l'événement onClick de la ligne
                                            handleDeleteImage(selectedFileIds);
                                        }} className="bg-red-500 text-white px-4 py-2 rounded">
                                            Delete
                                        </button>
                                        <button onClick={(e) => {
                                            e.stopPropagation(); // Prévenir l'événement onClick de la ligne
                                            handleEditImage(selectedFileIds);
                                        }} className="bg-blue-500 text-white px-4 py-2 rounded">
                                            Edit
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

export default ListFiles;
