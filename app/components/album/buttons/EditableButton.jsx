"use client"

import React, { useState, useRef } from 'react';
import { Pen, Save } from '../icons';

function EditableButton({ text, onChange, onSave, isEditable }) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleSave = () => {
    onSave();
    setIsEditing(false);
  };

  const handleBlur = (e) => {
    if (e.relatedTarget && e.relatedTarget.dataset && e.relatedTarget.dataset.noDnd) {
      return;
    }
    handleSave();
  };

  return (
    <div data-no-dnd="true">
      {isEditable ? (
        isEditing ? (
          <div className="flex items-center justify-center mt-2">
            <input
              className="text-white bg-transparent text-center w-full absolute -bottom-7"
              type="text"
              value={text}
              ref={inputRef}
               onChange={onChange}
              onBlur={handleBlur}
              
              onFocus={(e) => e.stopPropagation()} // Empêche le DnD
              data-no-dnd="true"
            />
            <button
              onClick={handleSave}
              className="ml-2 bg-blue-500 text-white font-bold py-1 px-2 rounded"
              data-no-dnd="true"
            >SAVE
              <Save />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <span className="text-white text-center -bottom-8 flex-1">{text}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-lg"
              data-no-dnd="true"
            >
              <Pen />
            </button>
          </div>
        )
      ) : (
        <div className="text-white bg-transparent text-center w-full absolute -bottom-5">{text}</div>
      )}
    </div>
  );
}

export default EditableButton;
