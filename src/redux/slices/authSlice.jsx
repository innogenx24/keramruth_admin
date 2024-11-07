
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    error: null,
    token: localStorage.getItem('token') || null,
  },
  reducers: {
    signInRequest: (state, action) => {
      state.user = action.payload.user;
      state.error = null; // Clear previous errors
    },
    signInSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      // Persist token and user data in localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    signInFailure: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    signUpRequest: (state) => {
      state.error = null; // Clear previous errors
    },
    signUpSuccess: (state, action) => {
      state.user = action.payload.user;
      state.error = null;
    },
    signUpFailure: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  signInRequest,
  signInSuccess,
  signInFailure,
  signOut,
  signUpRequest,
  signUpSuccess,
  signUpFailure
} = authSlice.actions;

export default authSlice.reducer;
