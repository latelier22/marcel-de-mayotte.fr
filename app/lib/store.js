import { configureStore } from "@reduxjs/toolkit";
import visibleReducer from "../lib/features/auth/visibleSlice";

export const store = configureStore({
    reducer: {
      visible: visibleReducer  // This key must match what you use in useSelector
    }
  });