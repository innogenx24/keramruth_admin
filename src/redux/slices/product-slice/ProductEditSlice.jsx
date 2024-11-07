import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  success: false,
  error: null,
  product: null,
};

const productEditSlice = createSlice({
  name: 'productEdit',
  initialState,
  reducers: {
    makeEditProduct: (state, action) => {
      // Saga will handle the actual API call
      state.product = action.payload.product;
    },
    productEditRequest: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    productEditSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.product = action.payload;
    },
    productEditFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
  },
});

export const { productEditRequest, productEditSuccess, productEditFailure, makeEditProduct } = productEditSlice.actions;

export default productEditSlice.reducer;
