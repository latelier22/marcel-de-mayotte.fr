"use client";
import React from 'react';

const FileTagsClient = ({ fileTags }) => {
   
  return (
    <div>
      {fileTags && fileTags.map(tag => (
        <div key={tag.id} className="text-white">
          {tag.name}
        </div>
      ))}
    </div>
  );
};

export default FileTagsClient;
