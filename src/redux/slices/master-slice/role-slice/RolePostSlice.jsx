import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    success: false,
    error: null,
    member: null,
};

const rolePostSlice = createSlice({
    name: 'rolePost',
    initialState,
    reducers: {
        makePostRole: (state, action) => {
            //Saga will handle the actual API call
            state.role = action.payload.role;
        },
        rolePostRequest: (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        rolePostSuccess: (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.member = action.payload;
        },
        rolePostFailure: (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    },
});

export const { rolePostRequest, rolePostSuccess, rolePostFailure, makePostRole } = rolePostSlice.actions;

export default rolePostSlice.reducer;