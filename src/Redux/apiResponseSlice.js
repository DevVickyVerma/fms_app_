import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchApiResponse = createAsyncThunk(
  "apiResponse/fetch",
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const api = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL, // Replace with your environment variable name
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    try {
      dispatch(fetchStart());
      const response = await api.get("/detail");
      dispatch(fetchSuccess(response.data));

      // Handle the response data
      // Print the API response data

      // You can also perform additional actions based on the response data
      if (response.data) {
        console.log(response.data, "redux data");
      } else {
        console.log(response.data, "else data");
      }
    } catch (error) {
      dispatch(fetchFailure(error.message));
      return rejectWithValue(error.message);
    }
  }
);

const apiResponseSlice = createSlice({
  name: "apiResponse",
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    fetchStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    fetchFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure } =
  apiResponseSlice.actions;

export default apiResponseSlice.reducer;
