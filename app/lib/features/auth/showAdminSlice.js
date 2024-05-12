import { createSlice } from "@reduxjs/toolkit";

// Définissez l'état initial de votre slice.
const initialState = {
  isShowAdmin: true,
};

const showAdminSlice = createSlice({
  name: "admin",
  initialState ,
  reducers: {
    // Action pour basculer la visibilité
    toggleShowAdmin: state => {
      state.isShowAdmin = !state.isShowAdmin;
    },
  },
});

export const { toggleShowAdmin } = showAdminSlice.actions;
export default showAdminSlice.reducer;
