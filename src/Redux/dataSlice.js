import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Define the initial state
const initialState = {
  data: [],
  loading: false,
  error: null,
};
const SuccessToast = (message) => {
  toast.success(message, {
    autoClose: 1000,
    position: toast.POSITION.TOP_RIGHT,
    hideProgressBar: true,
    transition: Slide,
    autoClose: 1000,
    theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
  });
};
const ErrorToast = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    hideProgressBar: true,
    transition: Slide,
    autoClose: 1000,
    theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
  });
};
// Create an asynchronous thunk to fetch the API data
const baseUrl = process.env.REACT_APP_BASE_URL;
export const fetchData = createAsyncThunk(
  "data/fetchData",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    try {
      const response = await axios.get(`${baseUrl}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (data) {
        localStorage.setItem("superiorId", data?.data?.superiorId);
        localStorage.setItem("superiorRole", data?.data?.superiorRole);
        localStorage.setItem("role", data?.data?.role);
      }

      // Check the structure of the data
      return data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { response } = error;

        if (response) {
          if (response.status === 401) {
            // Unauthorized access
            // navigate("/login");
            ErrorToast("Invalid access token");
            localStorage.clear();
          } else if (response.status === 403) {
            // Forbidden
            // navigate("/errorpage403");
          } else if (response.data && response.data.message) {
            // Other error message
            const errorMessage = Array.isArray(response.data.message)
              ? response.data.message.join(" ")
              : response.data.message;

            if (errorMessage) {
              ErrorToast(errorMessage);
            }
          } else {
            // Unknown error
            ErrorToast("An error occurred.");
          }
        } else {
          // Network error or other issues
          ErrorToast("Failed to fetch data from API.");
        }
      } else {
        // Non-Axios error
        throw new Error("An error occurred.");
      }
    }
  }
);

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
