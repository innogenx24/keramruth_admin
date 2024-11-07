import { createSlice } from "@reduxjs/toolkit";

const ClubGetSlice = createSlice({
  name: "clubs",
  initialState: {
    clubs: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchClubsRequest: (state) => {
      state.loading = true;
      state.error = null;
    //   state.roleId = action.payload.roleId; 
    },
    fetchClubsSuccess: (state, action) => {
      state.clubs = action.payload;
      state.loading = false;
    },
    fetchClubsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchClubsRequest, fetchClubsSuccess, fetchClubsFailure } =
ClubGetSlice.actions;

export default ClubGetSlice.reducer;