import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userDataSlice";



export const store = configureStore({
  reducer: {
    userData: userReducer,
  },
});





