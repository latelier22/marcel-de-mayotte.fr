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



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSelectedFileId(null);
                setEditing(false);
                setCreatingNew(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);




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

    const handleImportImage = (fileId) => {
        const file = files.find(f => f.id === fileId);
        console.log(`Importing image with ID: ${fileId}`, file);
        // Ajouter ici la logique d'importation
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
            <button onClick={() => fileInputRef.current.click()} disable={selectedFileId} className={`${selectedFileId ? 'hidden' : ''} bg-green-500 text-white px-4 py-2 rounded mb-4 `}>
                Upload Image
            </button>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadImage} />

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
                        <tr key={file.id} onClick={() => setSelectedFileId(file.id)}
                            className={`${selectedFileId === file.id ? 'border-green-500 border-solid border-2 rounded-md' : ''
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
                                {selectedFileId === file.id && (
                                    <>
                                        <button onClick={(e) => {
                                            e.stopPropagation(); // Prévenir l'événement onClick de la ligne
                                            handleImportImage(file.id);
                                        }} className="bg-green-500 text-white px-4 py-2 rounded">
                                            Import
                                        </button>
                                        <button onClick={(e) => {
                                            e.stopPropagation(); // Prévenir l'événement onClick de la ligne
                                            handleDeleteImage(file.id);
                                        }} className="bg-red-500 text-white px-4 py-2 rounded">
                                            Delete
                                        </button>
                                        <button onClick={(e) => {
                                            e.stopPropagation(); // Prévenir l'événement onClick de la ligne
                                            handleEditImage(file.id);
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
