// actions.js
export const addFavorite = (photoId) => ({
    type: 'ADD_FAVORITE',
    payload: photoId
});

export const removeFavorite = (photoId) => ({
    type: 'REMOVE_FAVORITE',
    payload: photoId
});

// reducers.js
const favoritesReducer = (state = new Set(), action) => {
    switch (action.type) {
        case 'ADD_FAVORITE':
            return new Set([...state, action.payload]);
        case 'REMOVE_FAVORITE':
            const newState = new Set(state);
            newState.delete(action.payload);
            return newState;
        default:
            return state;
    }
};

export default favoritesReducer;
