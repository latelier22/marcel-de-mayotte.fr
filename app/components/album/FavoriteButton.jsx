// FavoriteButton.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from '../../a';

const FavoriteButton = ({ photoId }) => {
    const favorites = useSelector(state => state.favorites);
    const dispatch = useDispatch();
    
    const isFavorited = favorites.has(photoId);
    const handleClick = () => {
        if (isFavorited) {
            dispatch(removeFavorite(photoId));
        } else {
            dispatch(addFavorite(photoId));
        }
    };

    return (
        <button onClick={handleClick}>
            {isFavorited ? '♥' : '♡'}
        </button>
    );
};

export default FavoriteButton;
