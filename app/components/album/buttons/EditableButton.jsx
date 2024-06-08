"use client"

import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { toggleVisibility } from '../../../lib/features/auth/visibleSlice'; // Assurez-vous que le chemin d'importation est correct
import {Pen} from '../icons';

function EditableButton({ text, onChange, onBlur, isEditable, inputRef }) {
    return (
      isEditable ? (
        <>
        <input
          className="text-white bg-transparent text-center w-full absolute -bottom-7"
          type="text"
          value={text}
          ref={inputRef}
          onChange={onChange}
          onBlur={onBlur}
        />
      
        </>
      ) : (
        <div className="text-white bg-transparent text-center w-full absolute -bottom-5">
          {text}
        </div>
      )
    );
  }

  export  default EditableButton;
