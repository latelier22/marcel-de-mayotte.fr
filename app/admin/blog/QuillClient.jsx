"use client"

import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default ReactQuill