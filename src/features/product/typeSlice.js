import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import typeApi from "../../api/typeApi";

const initialState = {
   typeList: [],
   typeInfo: [],
}

export const getTypeList = createAsyncThunk("type/getTypeList",
    async () => {
        const response = await typeApi.getTypeList(); 
        if(response.status === 200)
            return response.data;
        return 0;
});

export const getTypeInfo = createAsyncThunk("type/getTypeInfo",
    async () => {
        const response = await typeApi.getTypeInfo(); 
        if(response.status === 200)
            return response.data;
        return 0;
});


export const typeSlice = createSlice({
    name: 'type',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getTypeList.fulfilled, (state, { payload }) => {
                state.typeList = payload;
            })
            .addCase(getTypeInfo.fulfilled, (state, { payload }) => {
                state.typeInfo = payload;
            })
            
    },
})

// Action creators are generated for each case reducer function
export const { } = typeSlice.actions;
export const selectTypeList = state => state.type.typeList;
export const selectTypeInfo = state => state.type.typeInfo;
export default typeSlice.reducer;