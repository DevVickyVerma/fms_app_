import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userDataSlice";



export const store = configureStore({
  reducer: {
    userData: userReducer,
  },
});



// import { configureStore } from "@reduxjs/toolkit";
// import catDataReducer from "./catDataSlice";

// export const store = configureStore({
//   reducer: {
//     catData: catDataReducer,
//   },
// });

