import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    success: false,
    error: null,
    member: null,
};

const categoryPostSlice = createSlice({
    name: 'categoryPost',
    initialState,
    reducers: {
        makePostCategory: (state, action) => {
            //Saga will handle the actual API call
            state.category = action.payload.category;
        },
        categoryPostRequest: (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        categoryPostSuccess: (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.member = action.payload;
        },
        categoryPostFailure: (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    },
});

export const { categoryPostRequest, categoryPostSuccess, categoryPostFailure, makePostCategory } = categoryPostSlice.actions;

export default categoryPostSlice.reducer;
