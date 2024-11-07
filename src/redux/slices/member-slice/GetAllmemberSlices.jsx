//slices/memebr-slece/GetAllMemberSlices.jsx

import { createSlice } from "@reduxjs/toolkit";

const GetAllMemberSlices = createSlice({
  name: "allmembers",
  initialState: {
    allmembers: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchAllMembersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAllMembersSuccess: (state, action) => {
      state.allmembers = action.payload;
      state.loading = false;
    },
    fetchAllMembersFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchAllMembersRequest, fetchAllMembersSuccess, fetchAllMembersFailure } =
GetAllMemberSlices.actions;

export default GetAllMemberSlices.reducer;
