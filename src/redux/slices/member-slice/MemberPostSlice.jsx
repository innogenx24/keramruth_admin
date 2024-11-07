import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    success: false,
    error: null,
    member: null,
};

const memberPostSlice = createSlice({
    name: 'memberPost',
    initialState,
    reducers: {
        makePostMember: (state, action) => {
            //Saga will handle the actual API call
            state.member = action.payload.member;
        },
        memberPostRequest: (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        memberPostSuccess: (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.member = action.payload;
        },
        memberPostFailure: (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    },
});

export const { memberPostRequest, memberPostSuccess, memberPostFailure, makePostMember } = memberPostSlice.actions;

export default memberPostSlice.reducer;
