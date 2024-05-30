"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import myFetch from "../../components/myFetch";
import DotLoaderSpinner from "../../components/spinners/DotLoaderSpinner";

function ListFiles({ allFiles, allPictures, allPosts }) {
  const [files, setFiles] = useState([]);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [titles, setTitles] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [importedFilesCount, setImportedFilesCount] = useState(0);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    initializeFiles();
  }, [allPictures, allFiles]);

  const initializeFiles = () => {
    const updatedFiles = allFiles.map((file) => {
      const picture = allPictures.find((p) => p.fileId === file.id);
      return {
        ...file,
        tags: ["IMPORT", "CATALOGUE COMPLET"],
        published: false,
        imported: picture ? picture.imported : false,
        importedAt: picture ? picture.importedAt : null,
        uploadedAt: new Date(file.updatedAt),
        posts: [], // Initialize posts as an empty array
      };
    });
    setFiles(updatedFiles);
    fetchPostsForFiles(updatedFiles);
  };

  const fetchPostsForFiles = async (updatedFiles) => {
    const filesWithPosts = updatedFiles.map((file) => {
      const postsUsingFile = allPosts.filter(
        (post) =>
          post.medias.data &&
          post.medias.data.some((media) => media.id === file.id)
      );
      const postTitles = postsUsingFile.map((post) => post.title);
      return { ...file, posts: postTitles };
    });
    setFiles(filesWithPosts);
  };

  const handleFileClick = (fileId) => {
    setSelectedFileIds((prev) => {
      if (prev.includes(fileId)) {
        return prev.filter((id) => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedFileIds.length === files.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(files.map((file) => file.id));
    }
  };

  const handleNameCheckboxChange = (fileId, isChecked) => {
    const file = files.find((f) => f.id === fileId);
    if (isChecked) {
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      setTitles((prevTitles) => ({
        ...prevTitles,
        [fileId]: fileNameWithoutExtension,
      }));
    } else {
      setTitles((prevTitles) => ({ ...prevTitles, [fileId]: "" }));
    }
  };

  const handleBulkNameCheckboxChange = (isChecked) => {
    const updatedTitles = {};
    selectedFileIds.forEach((fileId) => {
      const file = files.find((f) => f.id === fileId);
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      updatedTitles[fileId] = isChecked ? fileNameWithoutExtension : "";
    });
    setTitles((prevTitles) => ({ ...prevTitles, ...updatedTitles }));
  };

  const handleBulkPublishedCheckboxChange = (isChecked) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => ({
        ...file,
        published: selectedFileIds.includes(file.id)
          ? isChecked
          : file.published,
      }))
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSelectedFileIds([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShowImported = () => {
    // Get the photoIds of the selected files
    const selectedPhotoIds = selectedFileIds.map((fileId) => {
      const picture = allPictures.find((p) => p.fileId === fileId);
      return picture ? picture.photoId : null;
    }).filter(photoId => photoId !== null); // Filter out null values

    // Save selected photo IDs to local storage
    localStorage.setItem('selectedPhotoIds', JSON.stringify(selectedPhotoIds));

    const storedPhotoIds = localStorage.getItem('selectedPhotoIds');
  if (storedPhotoIds) {
    console.log(storedPhotoIds);
  }

    // Navigate to the /catalogue/import page
    router.push('/catalogue/import');
  };

  const handleUploadImage = async (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      setIsUploading(true);
      const response = await myFetch(
        "/api/upload",
        "POST",
        formData,
        "image upload"
      );
      if (response) {
        const newFiles = response.map((file) => ({
          ...file,
          tags: [],
          published: false,
          imported: false,
          uploadedAt: new Date(file.updatedAt),
          posts: [], // Initialize posts as an empty array for new files
        }));
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

      // Find associated pictures and delete them first
      for (const fileId of fileIds) {
        const pictureResponse = await myFetch(
          `/api/pictures?filters[fileId][$eq]=${fileId}`,
          "GET",
          null,
          "fetch picture"
        );

        if (pictureResponse.data.length > 0) {
          const pictureId = pictureResponse.data[0].id;

          await myFetch(
            `/api/pictures/${pictureId}`,
            "DELETE",
            null,
            "delete picture"
          );
        }
      }

      // Then delete the files
      const deletePromises = fileIds.map((fileId) =>
        myFetch(
          `/api/upload/files/${fileId}`,
          "DELETE",
          null,
          "image delete from upload folder"
        )
      );

      const responses = await Promise.all(deletePromises);
      const successfulDeletes = responses.filter((response) => response);

      if (successfulDeletes.length) {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => !fileIds.includes(file.id))
        );
      }

      setIsUploading(false);
    } catch (error) {
      console.error("Delete failed:", error);
      setIsUploading(false);
    }
  };

  const handleDeleteButtonClick = async (fileId) => {
    try {
      // Vérifier si le fichier est utilisé dans des posts
      const response = await myFetch(
        `/api/posts?filters[medias][id][$eq]=${fileId}`,
        "GET",
        null,
        "fetch posts using media"
      );

      if (response.data.length > 0) {
        const postsUsingFile = response.data.map((post) => post.title);
        alert(
          `Cannot delete file. It is used in the following posts: ${postsUsingFile.join(
            ", "
          )}`
        );
        return;
      }

      // Supprimer le fichier
      await handleDeleteImages([fileId]);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete file");
    }
  };

  const handleImportImage = async (selectedFileIds) => {
    const selectedFiles = files.filter((file) =>
      selectedFileIds.includes(file.id)
    );
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
      const photosData = selectedFiles.map((file) => ({
        numero: file.id,
        name: file.name,
        dimensions: `${file.width}x${file.height}`,
        url: `${file.url}?format=webp&width=800`,
        width: file.width,
        height: file.height,
        title: titles[file.id],
        description: file.description || "",
        published: file.published || false,
        tags: [...file.tags, "CATALOGUE COMPLET"],
      }));

      // Make sure this is only called once per import action
      const response = await fetch("/api/importPhotos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photos: photosData }),
      });

      if (!response.ok) {
        throw new Error("Failed to import images");
      }

      const result = await response.json();
      const photoIds = result.photoIds;

      // Ensure the following loop does not create duplicates
      for (const [index, photoId] of photoIds.entries()) {
        const fileId = selectedFiles[index].id;

        await myFetch(
          "/api/pictures",
          "POST",
          {
            data: {
              imported: true,
              photoId: photoId,
              fileId: fileId,
              importedAt: new Date().toISOString(),
              uploadedAt:
                selectedFiles[index].uploadedAt || new Date().toISOString(),
            },
          },
          "import pictures"
        );
      }

      const tagResponse1 = await fetch("/api/updateTagInBulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addTag: true,
          selectedPhotoIds: photoIds,
          selectedTag: "IMPORT",
        }),
      });

      const resultTag1 = await tagResponse1.json();
      console.log("Photos added and tagged successfully:", result, resultTag1);
      const tagResponse2 = await fetch("/api/updateTagInBulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addTag: true,
          selectedPhotoIds: photoIds,
          selectedTag: "CATALOGUE COMPLET",
        }),
      });

      const resultTag2 = await tagResponse2.json();
      console.log("Photos added and tagged successfully:", result, resultTag2);

      // Update local state to reflect imported status
      setFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (selectedFileIds.includes(file.id)) {
            return { ...file, imported: true, importedAt: new Date() };
          }
          return file;
        })
      );

      // Update importedFilesCount
      setImportedFilesCount(selectedFileIds.length);
    } catch (error) {
      console.error("Failed to import images:", error);
    }
  };

  const handleCancelImport = async (fileId) => {
    try {
      // Trouver l'image correspondante dans allPictures
      const picture = allPictures.find((p) => p.fileId === fileId);
      if (!picture) {
        console.error(`No picture found for file ID ${fileId}`);
        return;
      }

      // Mettre à jour l'état imported à false dans Strapi
      await myFetch(
        `/api/pictures/${picture.id}`,
        "PUT",
        {
          data: {
            imported: false,
            importedAt: null,
          },
        },
        "cancel import"
      );

      // Supprimer l'entrée de photo dans Prisma
      const response = await fetch("/api/deletePhoto", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoId: picture.photoId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }

      // Mettre à jour l'état local pour refléter l'annulation de l'importation
      setFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (file.id === fileId) {
            return { ...file, imported: false, importedAt: null };
          }
          return file;
        })
      );
    } catch (error) {
      console.error("Failed to cancel import:", error);
    }
  };

  const handleEditImage = (fileId) => {
    const file = files.find((f) => f.id === fileId);
    console.log(`Editing image with ID: ${fileId}`, file);
    // Add your edit logic here
  };

  const renderPostsTitles = (file) => {
    return file.posts.join(", ");
  };

  const ImageWithFallback = ({ file }) => {
    const thumbnailUrl =
      file.formats && file.formats.thumbnail
        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${file.formats.thumbnail.url}`
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${file.url}`;

    return (
      <img
        src={thumbnailUrl}
        alt={file.name}
        style={{ width: 100, height: "auto" }}
      />
    );
  };

  const isMultiImportEnabled = () => {
    return !selectedFileIds.some((fileId) => {
      const file = files.find((file) => file.id === fileId);
      return file ? file.imported : false;
    });
  };


  return (
    <div
      ref={containerRef}
      className="container mx-auto my-8 p-4 shadow-lg rounded"
    >
      <DotLoaderSpinner isLoading={isUploading} />
      <div className="flex flex-row justify-start items-center my-8 p-4 gap-2">
        <div className="bg-green-500 text-white px-4 py-2 rounded">
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Upload Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleUploadImage}
            multiple
          />
        </div>
        <button onClick={handleShowImported} className="bg-orange-500 text-white px-4 py-2 rounded">
          SHOW IMPORTED
        </button>
        <button
          onClick={handleSelectAll}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {selectedFileIds.length === files.length
            ? "Deselect All"
            : "Select All"}
        </button>
        {selectedFileIds.length >= 2 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleImportImage(selectedFileIds);
              }}
              disabled={!isMultiImportEnabled()}
              className={`bg-green-500 text-white px-4 py-2 rounded ${
                !isMultiImportEnabled() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Import
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImages(selectedFileIds);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
              disabled={selectedFileIds.some((fileId) => {
                const file = files.find((file) => file.id === fileId);
                return file ? file.imported : false;
              })}
            >
              Delete
            </button>
          </>
        )}
        <input
          type="checkbox"
          className="ml-4"
          onChange={(e) => handleBulkPublishedCheckboxChange(e.target.checked)}
        />{" "}
        Publish All Selected
      </div>
      {importedFilesCount > 0 && (
        <div className="bg-green-200 text-green-800 text-center p-2 my-4 rounded">
          {importedFilesCount} fichiers ont bien été importés
        </div>
      )}
      <table className="w-full">
        <thead className="bg-red-900">
          <tr className="text-center">
            <th className="py-2">ID</th>
            <th className="py-2">Image</th>
            <th className="py-2 w-1/5">
              Name
              <input
                className="ml-8"
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
            <th className="py-2">Posts</th> {/* New Column */}
            <th className="py-2">Actions</th>
            <th className="py-2">Imported</th>
          </tr>
        </thead>
        <tbody>
          {files
            .slice()
            .reverse()
            .map((file) => (
              <tr
                key={file.id}
                className={`${
                  selectedFileIds.includes(file.id)
                    ? "border-green-500 border-solid border-2 rounded-md"
                    : ""
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
                    className="ml-8"
                    type="checkbox"
                    checked={
                      titles[file.id] === file.name.replace(/\.[^/.]+$/, "")
                    }
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleNameCheckboxChange(file.id, e.target.checked)
                    }
                  />
                </td>
                <td className="py-2 w-1/5">
                  <input
                    type="text"
                    value={titles[file.id] || ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setTitles({ ...titles, [file.id]: e.target.value })
                    }
                    placeholder="Enter title"
                    className="w-full px-2 py-1 border rounded border-gold-700 bg-black text-gold-400"
                  />
                </td>
                <td className="py-2 w-1/5">
                  {file.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-bold mr-1"
                    >
                      {tag}
                    </span>
                  ))}
                </td>
                <td className="py-2">
                  <input
                    type="checkbox"
                    checked={file.published}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const updatedFiles = files.map((f) =>
                        f.id === file.id
                          ? { ...f, published: e.target.checked }
                          : f
                      );
                      setFiles(updatedFiles);
                    }}
                  />
                </td>
                <td className="py-2">{file.width}</td>
                <td className="py-2">{file.height}</td>
                <td className="py-2">{file.size} ko</td>
                <td className="py-2">{renderPostsTitles(file)}</td>{" "}
                {/* New Column Data */}
                <td className="py-2">
                  {selectedFileIds.length === 1 &&
                    selectedFileIds.includes(file.id) && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImportImage([file.id]);
                          }}
                          disabled={!titles[file.id] || file.imported}
                          className={`bg-green-500 text-white px-4 py-2 rounded ${
                            !titles[file.id]
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Import
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteButtonClick(file.id);
                          }}
                          className={`bg-red-500 text-white px-4 py-2 rounded ${
                            file.imported
                              ? "opacity-50 cursor-not-allowed "
                              : ""
                          }`}
                          disabled={file.imported}
                        >
                          Delete
                        </button>
                        {file.imported && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelImport(file.id);
                            }}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                          >
                            Cancel Import
                          </button>
                        )}
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
