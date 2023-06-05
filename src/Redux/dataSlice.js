import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  data: [],
  loading: false,
  error: null,
};

// Create an asynchronous thunk to fetch the API data
// `${process.env.REACT_APP_BASE_URL}/reset/password`,
const baseUrl = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem("token");
export const fetchData = createAsyncThunk("data/fetchData", async () => {
  try {
    const response = await fetch(`${baseUrl}/detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
     // Check the structure of the data
    return data.data;
  } catch (error) {
    throw new Error("Failed to fetch data from API.");
  }
});


// Create the data slice
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the action and reducer
export const dataActions = dataSlice.actions;
export default dataSlice.reducer;
