"use client";
import { Provider } from "react-redux"
import reduxStore from "./store";

export default function ReduxProvider({ children }) {
  return <Provider store={reduxStore}>{children}</Provider>;
};