"use client"

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleVisibility } from '../../../lib/features/auth/visibleSlice'; // Assurez-vous que le chemin d'importation est correct
import {Eye} from "./index"

function VisibilityToggleButton( {isAmin}) {
  const isVisible = useSelector((state) => state.visible.isVisible);
  const dispatch = useDispatch();

  const handleToggleVisibility = () => {
    dispatch(toggleVisibility());
  };

  return (
    <li className="lg:mb-0 lg:pr-2">
      <button onClick={handleToggleVisibility}>
        <Eye isOpen={isVisible} />
      </button>
    </li>
  );
}

export default VisibilityToggleButton;
