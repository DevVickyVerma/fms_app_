
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk action to fetch data from the API
const baseUrl = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem("token");
export const fetchData = createAsyncThunk('data/fetchData', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${baseUrl}/detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch data from API.');
  }
});

// Data slice
const dataSlice = createSlice({
  name: 'data',
  initialState: {
    permissionsArray: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.permissionsArray = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { } = dataSlice.actions;

export default dataSlice.reducer;
