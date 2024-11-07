import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const memberDeleteSlice = createSlice({
  name: 'memberDelete',
  initialState,
  reducers: {
    deleteMemberRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    deleteMemberSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    deleteMemberFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
  },
});

export const {
    deleteMemberRequest,
    deleteMemberSuccess,
    deleteMemberFailure,
} = memberDeleteSlice.actions;

export default memberDeleteSlice.reducer;