import { createSlice } from "@reduxjs/toolkit";

const RoleGetSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchRolesRequest: (state) => {
      state.loading = true;
      state.error = null;
    //   state.roleId = action.payload.roleId; 
    },
    fetchRolesSuccess: (state, action) => {
      state.roles = action.payload;
      state.loading = false;
    },
    fetchRolesFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchRolesRequest, fetchRolesSuccess, fetchRolesFailure } =
RoleGetSlice.actions;

export default RoleGetSlice.reducer;