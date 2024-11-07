import { createSlice } from "@reduxjs/toolkit";

const MemberGetSlice = createSlice({
  name: "members",
  initialState: {
    members: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchMembersRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.roleId = action.payload.roleId; 
    },
    fetchMembersSuccess: (state, action) => {
      state.members = action.payload;
      state.loading = false;
    },
    fetchMembersFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchMembersRequest, fetchMembersSuccess, fetchMembersFailure } =
  MemberGetSlice.actions;

export default MemberGetSlice.reducer;
