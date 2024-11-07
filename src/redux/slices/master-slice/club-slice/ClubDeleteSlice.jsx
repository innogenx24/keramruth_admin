import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const clubDeleteSlice = createSlice({
  name: 'clubDelete',
  initialState,
  reducers: {
    deleteClubRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    deleteClubSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    deleteClubFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
  },
});

export const {
    deleteClubRequest,
    deleteClubSuccess,
    deleteClubFailure,
} = clubDeleteSlice.actions;

export default clubDeleteSlice.reducer;