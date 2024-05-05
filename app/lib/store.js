import { configureStore } from "@reduxjs/toolkit";
import visibleReducer from "../lib/features/auth/visibleSlice";
import showAdminReducer from "../lib/features/auth/showAdminSlice";


export const store = configureStore({
    reducer: {
      visible: visibleReducer , // This key must match what you use in useSelector
      showAdmin : showAdminReducer
    }
  });