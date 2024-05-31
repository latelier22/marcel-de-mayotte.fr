"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import myFetch from "../../components/myFetch";

function UploadVideo() {
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
    } else {
      alert("Please upload a video file.");
      event.target.value = null; // Clear the input if the file is not a video
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a video file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
     
      const response = await myFetch(
        "/api/upload",
        "POST",
        formData,
        "image upload"
      );

      if (response.ok) {
        alert("File uploaded successfully.");
        router.reload();
      } else {
        alert("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during file upload.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button type="submit">Upload Video</button>
    </form>
  );
}

export default UploadVideo;
