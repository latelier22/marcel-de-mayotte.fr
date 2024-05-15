"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import '../styles/quill.snow.css'
import parse from 'html-react-parser';

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

export default function Home() {
  const [content, setContent] = useState("");

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
  };

  return (
    <>
      <div className="pt-64 marker:h-screen w-screen flex items-start justify-center flex-row">
        <div className="h-[40vw] w-[50vw]">
               
          <QuillEditor
            value={content}
            onChange={handleEditorChange}
            modules={quillModules}
            formats={quillFormats}
            className="w-full h-[70%] mt-10 bg-black"
          />
        </div>

        <div className="ml-48 bg-pink-500 text-white w-[40vw] h-[50vw]">
          <h6>Output is {content}</h6>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <div>{parse(content)}</div>
        </div>
      </div>
    </>
  );
}
