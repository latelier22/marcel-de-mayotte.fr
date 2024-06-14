import React, { useRef, useState } from 'react';
import myFetch from '../../components/myFetch';
import DotLoaderSpinner from '../../components/spinners/DotLoaderSpinner';

const UploadFileToPost = ({ onFileUpload }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleUploadImage = async (selectedFiles) => {
        if (selectedFiles.length === 0) return;

        const formData = new FormData();
        for (const file of selectedFiles) {
            formData.append('files', file);
        }

        try {
            setIsUploading(true);
            const response = await myFetch('/api/upload', 'POST', formData, 'image upload');
            if (response) {         
                const newFiles = response.map((file) => ({
                    ...file,
                    tags: [],
                    published: false,
                    imported: false,
                    uploadedAt: new Date(file.updatedAt),
                    posts: [],
                }));
                setIsUploading(false);
                onFileUpload(newFiles); // Pass new files to parent component
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setIsUploading(false);
        }
    };

    return (
        <div className="relative">
            <DotLoaderSpinner isLoading={isUploading} />
            <button
                onClick={() => fileInputRef.current.click()}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Upload Image
            </button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleUploadImage(e.target.files)}
                multiple
            />
        </div>
    );
};

export default UploadFileToPost;
