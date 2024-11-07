// slices/member-slice/MemberEditSlices.jsx
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  success: false,
  error: null,
  member: null,
};

const memberEditSlice = createSlice({
  name: 'memberEdit',
  initialState,
  reducers: {
    makeEditMember: (state, action) => {
      state.member = action.payload.member;
    },
    memberEditRequest: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    memberEditSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.member = action.payload;
    },
    memberEditFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    memberRejectRequest: (state) => {
      state.loading = true;
    },
    memberRejectSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    memberRejectFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  memberEditRequest, 
  memberEditSuccess, 
  memberEditFailure, 
  makeEditMember, 
  memberRejectRequest,
  memberRejectSuccess,
  memberRejectFailure 
} = memberEditSlice.actions;

export default memberEditSlice.reducer;
