import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const CategoryDeleteSlice = createSlice({
  name: 'categoryDelete',
  initialState,
  reducers: {
    deleteCategoryRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    deleteCategorySuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    deleteCategoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
  },
});

export const {
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailure,
} = CategoryDeleteSlice.actions;

export default CategoryDeleteSlice.reducer;