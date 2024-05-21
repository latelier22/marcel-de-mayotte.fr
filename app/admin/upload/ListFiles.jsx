"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import myFetch from '../../components/myFetch';
import DotLoaderSpinner from '../../components/spinners/DotLoaderSpinner';

function ListFiles({ allFiles, allPictures }) {
    const [files, setFiles] = useState(allFiles.map(file => ({ ...file, tags: ["IMPORT", "CATALOGUE COMPLET"], published: false, imported: false, importedAt: null })));
    const [selectedFileIds, setSelectedFileIds] = useState([]);
    const [titles, setTitles] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        markImportedFiles();
    }, [allPictures]);

    const markImportedFiles = () => {
        setFiles(prevFiles => prevFiles.map(file => {
            const picture = allPictures.find(p => p.fileId === file.id);
            if (picture) {
                return { ...file, imported: true, importedAt: picture.importedAt };
            }
            return file;
        }));
    };

    const handleFileClick = (fileId) => {
        setSelectedFileIds((prev) => {
            if (prev.includes(fileId)) {
                return prev.filter(id => id !== fileId);
            } else {
                return [...prev, fileId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedFileIds.length === files.length) {
            setSelectedFileIds([]);
        } else {
            setSelectedFileIds(files.map(file => file.id));
        }
    };

    const handleNameCheckboxChange = (fileId, isChecked) => {
        const file = files.find(f => f.id === fileId);
        if (isChecked) {
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
            setTitles(prevTitles => ({ ...prevTitles, [fileId]: fileNameWithoutExtension }));
        } else {
            setTitles(prevTitles => ({ ...prevTitles, [fileId]: '' }));
        }
    };

    const handleBulkNameCheckboxChange = (isChecked) => {
        const updatedTitles = {};
        selectedFileIds.forEach(fileId => {
            const file = files.find(f => f.id === fileId);
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
            updatedTitles[fileId] = isChecked ? fileNameWithoutExtension : "";
        });
        setTitles(prevTitles => ({ ...prevTitles, ...updatedTitles }));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSelectedFileIds([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleUploadImage = async (event) => {
        const selectedFiles = event.target.files;
        if (selectedFiles.length === 0) return;

        const formData = new FormData();
        for (const file of selectedFiles) {
            formData.append('files', file);
        }

        try {
            setIsUploading(true);
            const response = await myFetch('/api/upload', 'POST', formData, 'image upload');
            if (response) {
                const newFiles = response.map(file => ({ ...file, tags: [], published: false, imported: false }));
                setFiles((prevFiles) => [...newFiles, ...prevFiles]);
                setIsUploading(false);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setIsUploading(false);
        }
    };

    const handleDeleteImages = async (fileIds) => {
        try {
            setIsUploading(true);
            const deletePromises = fileIds.map(fileId =>
                myFetch(`/api/upload/files/${fileId}`, 'DELETE', null, 'image delete from upload folder')
            );

            const responses = await Promise.all(deletePromises);
            const successfulDeletes = responses.filter(response => response);

            if (successfulDeletes.length) {
                setFiles((prevFiles) => prevFiles.filter(file => !fileIds.includes(file.id)));
            }

            setIsUploading(false);
        } catch (error) {
            console.error("Delete failed:", error);
            setIsUploading(false);
        }
    };

    const handleImportImage = async (selectedFileIds) => {
        const selectedFiles = files.filter(file => selectedFileIds.includes(file.id));
        if (selectedFiles.length === 0) {
          console.error("No files selected");
          return;
        }
      
        for (const fileId of selectedFileIds) {
          if (!titles[fileId]) {
            console.error(`Title for file ID ${fileId} is not filled`);
            return;
          }
        }
      
        try {
          const photosData = selectedFiles.map(file => ({
            numero: file.id,
            name: file.name,
            dimensions: `${file.width}x${file.height}`,
            url: `${file.url}?format=webp&width=800`,
            width: file.width,
            height: file.height,
            title: titles[file.id],
            description: file.description || '',
            published: file.published || false,
            tags: [...file.tags, 'CATALOGUE COMPLET']
          }));
      
          const response = await fetch('/api/importPhotos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photos: photosData })
          });
      
          if (!response.ok) {
            throw new Error("Failed to import images");
          }
      
          const result = await response.json();
          const photoIds = result.photoIds;
      
          // Update pictures in Strapi with the imported status and photoId from Prisma
          for (const [index, photoId] of photoIds.entries()) {
            const fileId = selectedFiles[index].id;
      
            await myFetch('/api/pictures', 'POST', {
              data: {
                imported: true,
                photoId: photoId,
                fileId: fileId,
                importedAt: new Date().toISOString(),
                uploadedAt: selectedFiles[index].uploadedAt || new Date().toISOString()
              }
            }, 'import pictures');
          }
      
          const tagResponse1 = await fetch('/api/updateTagInBulk', {
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
      
          const resultTag1 = await tagResponse1.json();
          console.log('Photos added and tagged successfully:', result, resultTag1);
          const tagResponse2 = await fetch('/api/updateTagInBulk', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              addTag: true,
              selectedPhotoIds: photoIds,
              selectedTag: 'CATALOGUE COMPLET'
            })
          });
      
          const resultTag2 = await tagResponse2.json();
          console.log('Photos added and tagged successfully:', result, resultTag2);
        } catch (error) {
          console.error("Failed to import images:", error);
        }
      };
      
    const handleEditImage = (fileId) => {
        const file = files.find(f => f.id === fileId);
        console.log(`Editing image with ID: ${fileId}`, file);
        // Add your edit logic here
    };

    const ImageWithFallback = ({ file }) => {
        const thumbnailUrl = file.formats && file.formats.thumbnail ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${file.formats.thumbnail.url}` : `${process.env.NEXT_PUBLIC_STRAPI_URL}${file.url}`;
      
        return (
          <img src={thumbnailUrl} alt={file.name} style={{ width: 100, height: 'auto' }} />
        );
      };
      

    return (
        <div ref={containerRef} className="container mx-auto my-8 p-4 shadow-lg rounded">
            <DotLoaderSpinner isLoading={isUploading} />
            <div className="flex flex-row justify-start items-center my-8 p-4 gap-2">
                <div className="bg-green-500 text-white px-4 py-2 rounded">
                    <button onClick={() => fileInputRef.current.click()} className="bg-green-500 text-white px-4 py-2 rounded">
                        Upload Image
                    </button>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadImage} multiple />
                </div>
                <Link href="/catalogue/import" className="bg-orange-500 text-white px-4 py-2 rounded">
                    SHOW IMPORTED
                </Link>
                <button onClick={handleSelectAll} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {selectedFileIds.length === files.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedFileIds.length >= 2 && (
                    <>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            handleImportImage(selectedFileIds);
                        }} className="bg-green-500 text-white px-4 py-2 rounded">
                            Import
                        </button>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImages(selectedFileIds);
                        }} className="bg-red-500 text-white px-4 py-2 rounded">
                            Delete
                        </button>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            handleEditImage(selectedFileIds);
                        }} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Edit
                        </button>
                    </>
                )}
            </div>
            <table className="w-full">
                <thead className="bg-red-900">
                    <tr className="text-center">
                        <th className="py-2">ID</th>
                        <th className="py-2">Image</th>
                        <th className="py-2 w-1/5">
                            Name
                            <input
                                className='ml-8'
                                type="checkbox"
                                onChange={(e) => handleBulkNameCheckboxChange(e.target.checked)}
                            />
                        </th>
                        <th className="py-2 w-1/5">Title</th>
                        <th className="py-2 w-1/5">Tags</th>
                        <th className="py-2">Published</th>
                        <th className="py-2">Width (px)</th>
                        <th className="py-2">Height (px)</th>
                        <th className="py-2">Size </th>
                        <th className="py-2">Actions</th>
                        <th className="py-2">Imported</th>

                    </tr>
                </thead>
                <tbody>
                    {files.slice().reverse().map(file => (
                        <tr key={file.id}
                            className={`${selectedFileIds.includes(file.id) ? 'border-green-500 border-solid border-2 rounded-md' : ''
                                } text-center cursor-pointer hover:bg-gray-800`}
                            onClick={() => handleFileClick(file.id)}
                        >
                            <td className="py-2">{file.id}</td>
                            <td className="py-2">
                            <ImageWithFallback key={file.id} file={file} />

                            </td>
                            <td className="py-2 w-1/5">
                                {file.name}
                                <input
                                    className='ml-8'
                                    type="checkbox"
                                    checked={titles[file.id] === file.name.replace(/\.[^/.]+$/, "")}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleNameCheckboxChange(file.id, e.target.checked)}
                                />
                            </td>
                            <td className="py-2 w-1/5">
                                <input
                                    type="text"
                                    value={titles[file.id] || ''}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => setTitles({ ...titles, [file.id]: e.target.value })}
                                    placeholder="Enter title"
                                    className="w-full px-2 py-1 border rounded border-gold-700 bg-black text-gold-400"
                                />
                            </td>
                            <td className="py-2 w-1/5">
                                {file.tags.map(tag => (
                                    <span key={tag} className="inline-block bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-bold mr-1">{tag}</span>
                                ))}
                            </td>
                            <td className="py-2">
                                <input
                                    type="checkbox"
                                    checked={file.published}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                        const updatedFiles = files.map(f =>
                                            f.id === file.id ? { ...f, published: e.target.checked } : f
                                        );
                                        setFiles(updatedFiles);
                                    }}
                                />
                            </td>
                            <td className="py-2">{file.width}</td>
                            <td className="py-2">{file.height}</td>
                            <td className="py-2">{file.size} ko</td>
                            <td className="py-2">
                                {selectedFileIds.length === 1 && selectedFileIds.includes(file.id) && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleImportImage([file.id]);
                                            }}
                                            disabled={!titles[file.id]}
                                            className={`bg-green-500 text-white px-4 py-2 rounded ${!titles[file.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            Import
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteImages([file.id]);
                                            }}
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditImage(file.id);
                                            }}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
                            </td>
                            <td className="py-2">
                                {file.imported ? (
                                    <span className="text-green-500 font-bold">Imported</span>
                                ) : (
                                    <span className="text-red-500 font-bold">Non Imported</span>
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
