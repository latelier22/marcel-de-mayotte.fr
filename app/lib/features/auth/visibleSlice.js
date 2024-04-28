import { createSlice } from "@reduxjs/toolkit";

// Définissez l'état initial de votre slice.
const initialState = {
  isVisible: true,
};

const visibleSlice = createSlice({
  name: "visible",
  initialState,
  reducers: {
    // Action pour basculer la visibilité
    toggleVisibility: state => {
      state.isVisible = !state.isVisible;
    },
  },
});

export const { toggleVisibility } = visibleSlice.actions;
export default visibleSlice.reducer;
