import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import categoryApi from "../../api/categoryApi";

const initialState = {
    typeList: [],
    categories: [],
}

export const getCategories = createAsyncThunk("product/getCategories",
    async () => {
        const response = await categoryApi.getCategories();
        if (response.status === 200)
            return response.data;
        return 0;
    });


export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.fulfilled, (state, { payload }) => {
                state.categories = payload;
            })

    },
})

// Action creators are generated for each case reducer function
export const { } = categorySlice.actions;
export const selectTypeList = state => state.category.typeList;
export const selectCategories = state => state.category.categories;
export default categorySlice.reducer;