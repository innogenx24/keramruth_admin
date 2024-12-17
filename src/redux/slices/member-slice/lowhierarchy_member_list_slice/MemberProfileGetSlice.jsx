import { createSlice } from "@reduxjs/toolkit";

const MembersMemberGetSlice = createSlice({
  name: "membersMemberLists",
  initialState: {
    members: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchMembersMemberRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.roleId = action.payload.roleId;
      console.log(action.payload.roleId) 
    },
    fetchMembersMemberSuccess: (state, action) => {
      state.members = action.payload;
      state.loading = false;
    },
    fetchMembersMemberFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearMembersMember: (state) => {
      state.members = [];
    },
  },
});

export const { fetchMembersMemberRequest, fetchMembersMemberSuccess, fetchMembersMemberFailure, clearMembersMember } =
MembersMemberGetSlice.actions;

export default MembersMemberGetSlice.reducer;