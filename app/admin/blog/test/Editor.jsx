"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

const EditorClient = ({ initialContent, onContentChange }) => {
  const [content, setContent] = useState(initialContent || "");

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }],
      ["code-block"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "align",
    "color",
    "code-block",
  ];

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    onContentChange(newContent);
  };

  return (
    <div className="w-full">
      <QuillEditor
        value={content}
        onChange={handleEditorChange}
        modules={quillModules}
        formats={quillFormats}
        className="w-full h-64 bg-white"
      />
    </div>
  );
};

export default EditorClient;
