import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setuser: (state, { payload }) => {
      const parsedPayload = JSON.parse(payload);
      const newState = { ...state };
      newState.data = parsedPayload;
      return newState;
    },
  },
});

export const { setuser } = userDataSlice.actions;

export default userDataSlice.reducer;





