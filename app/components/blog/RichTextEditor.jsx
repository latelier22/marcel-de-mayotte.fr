'use client';

import  RichTextEditor  from "./RichText"
import { useState, useEffect } from 'react';

import renderHTML from 'react-render-html';


const MantineRichTextEditor = ({ initialValue }) => {
  const [value, setValue] = useState(initialValue.content);


  const handleSave = async (updatedPost) => {
    
      const payload = {
        content: updatedPost.content,
        auteur: updatedPost.auteur,
        etat: updatedPost.etat}
     
      const response = payload
      console.log('Post saved successfully:', response);
    
    
  };


  useEffect(() => {
    console.log(value);
  }, [value]);

  useEffect(() => {
    setValue(initialValue.content);
  }, [initialValue]);

  return (
    <div className="my-64">
      <RichTextEditor value={value} onChange={setValue} />
      <button onClick={() => handleSave({ ...initialValue, content: value })} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Save</button>

      <h1>Prévisualisation de l'article</h1>
      <div className="text-white p-4 border-b border-gray-300">
        <h2>{initialValue.auteur}</h2>
        <div dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }} />
      </div>
    </div>

  );
};

export default MantineRichTextEditor;
