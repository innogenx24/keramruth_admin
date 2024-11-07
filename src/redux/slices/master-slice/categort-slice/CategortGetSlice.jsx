import { createSlice } from "@reduxjs/toolkit";

const CategoryGetSlice = createSlice({
  name: "categorys",
  initialState: {
    categorys: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchCategorysRequest: (state) => {
      state.loading = true;
      state.error = null;
    //   state.roleId = action.payload.roleId; 
    },
    fetchCategorysSuccess: (state, action) => {
      state.categorys = action.payload;
      state.loading = false;
    },
    fetchCategorysFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchCategorysRequest, fetchCategorysSuccess, fetchCategorysFailure } =
CategoryGetSlice.actions;

export default CategoryGetSlice.reducer;