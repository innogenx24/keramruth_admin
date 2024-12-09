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
      console.log(action.payload.roleId) 
    },
    fetchMembersSuccess: (state, action) => {
      state.members = action.payload;
      state.loading = false;
    },
    fetchMembersFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearMembers: (state) => {
      state.members = [];
    },
  },
});

export const { fetchMembersRequest, fetchMembersSuccess, fetchMembersFailure, clearMembers } =
  MemberGetSlice.actions;

export default MemberGetSlice.reducer;
