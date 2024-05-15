"use client"

import { useState } from "react";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';

function ReactQuillEditor({initialValue}) {
    const [value, setValue] = useState(initialValue)
    return(
        <>
       <ReactQuill theme="snow" value={value} onChange={setValue}/>
       <h1>Prévisualisation de l&apos;article</h1>
      <div className="text-white p-4 border-b border-gray-300">
        <h2>{initialValue.auteur}</h2>
        <div dangerouslySetInnerHTML={{ __html: value }} />
      </div>
      </>
    )
}

export default ReactQuillEditor;