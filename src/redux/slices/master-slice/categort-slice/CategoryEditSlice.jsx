import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  success: false,
  error: null,
  category: null,
};

const categoryEditSlice = createSlice({
  name: "categoryEdit",
  initialState,
  reducers: {
    makeEditCategory: (state, action) => {
      // Saga will handle the actual API call
      state.category = action.payload.category;
    },
    categoryEditRequest: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    categoryEditSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.category = action.payload;
    },
    categoryEditFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
  },
});

export const {
  categoryEditRequest,
  categoryEditSuccess,
  categoryEditFailure,
  makeEditCategory,
} = categoryEditSlice.actions;

export default categoryEditSlice.reducer;
