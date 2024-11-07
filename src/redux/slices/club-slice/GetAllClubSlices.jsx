// redux/slices/club-slice/GetAllClubSlice.jsx

import { createSlice } from "@reduxjs/toolkit";

const GetAllClubSlice = createSlice({
  name: "allclubs",
  initialState: {
    allclubs: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchAllClubsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAllClubsSuccess: (state, action) => {
      state.allclubs = action.payload;
      state.loading = false;
    },
    fetchAllClubsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchAllClubsRequest, fetchAllClubsSuccess, fetchAllClubsFailure } =
  GetAllClubSlice.actions;

export default GetAllClubSlice.reducer;
