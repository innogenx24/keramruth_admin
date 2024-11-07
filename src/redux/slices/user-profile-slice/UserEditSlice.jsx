import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  success: false,
  error: null,
  user: null,
};

const userEditSlice = createSlice({
  name: 'userEdit',
  initialState,
  reducers: {
    makeEditUser: (state, action) => {
      console.log("actionslice", action)
      // Saga will handle the actual API call
      state.user = action.payload.user;
    },
    userEditRequest: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    userEditSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.user = action.payload;
    },
    userEditFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
  },
});

export const { userEditFailure, userEditSuccess, userEditRequest, makeEditUser } = userEditSlice.actions;

export default userEditSlice.reducer;