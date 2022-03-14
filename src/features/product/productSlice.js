import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import productApi from "../../api/productApi";

const initialState = {
    runOutItems: [],
    topHighestCost: [],
    topHighestAutions: [],
    infoProduct: {},
    relationProduct: [],
    productsByCategory: [],
    categoryName: '',
    searchResult: [],
    infoAuctioneers: [],
}

export const getTopItemRunOut = createAsyncThunk("product/getTopItemRunOut",
    async () => {
        const response = await productApi.getTopItemRunOut();
        if (response.status === 200)
            return response.data;
        return 0;
    });

export const getTopHighestCost = createAsyncThunk("product/getTopHighestCost",
    async () => {
        const response = await productApi.getTopHighestCost();
        if (response.status === 200)
            return response.data;
        return 0;
    });

export const getTopHighestAutions = createAsyncThunk("product/getTopHighestAutions",
    async () => {
        const response = await productApi.getTopHighestAutions();
        if (response.status === 200)
            return response.data;
        return 0;
    });

export const getInfoProduct = createAsyncThunk("product/getInfoProduct",
    async (id) => {
        const response = await productApi.getInfoProduct(id);
        if (response.status === 200) {
            //console.log(response.data)
            return response.data;
        }


        return 0;
    });

export const getProductsByCategory = createAsyncThunk("product/getProductsByCategory",
    async (id) => {
        const response = await productApi.getProductsByCategory(id);
        if (response.status === 200)
            return response.data;
        return 0;
    });

export const getSearchResult = createAsyncThunk("product/getSearchResult",
    async (search) => {
        const response = await productApi.getSearchResult(search);
        if (response.status === 200)
            return response.data;
        return 0;
    });


export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setInfoProduct: (state, action) => {
            state.infoProduct = action.payload.infoProduct;
            state.relationProduct = action.payload.relation_product;
            state.infoAuctioneers = action.payload.infoAuctioneers;
        },
        setSearchResult: (state, action) => {
            state.searchResult = action.payload;
        },
        sortProductDescendingByCreateDate: (state, action) => {
            state.searchResult = state.searchResult.sort((a, b) => {
                return (new Date(a.start_day) - new Date(b.start_day))
            }).reverse();
        },
        sortProductAscendingByPrice: (state, action) => {
            state.searchResult = state.searchResult.sort((a, b) => a.start_cost - b.start_cost);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTopItemRunOut.fulfilled, (state, { payload }) => {
                state.runOutItems = payload;
            })
            .addCase(getTopHighestCost.fulfilled, (state, { payload }) => {
                state.topHighestCost = payload;
            })
            .addCase(getTopHighestAutions.fulfilled, (state, { payload }) => {
                state.topHighestAutions = payload;
            })
            .addCase(getInfoProduct.fulfilled, (state, { payload }) => {
                state.infoProduct = payload.infoProduct;
                state.relationProduct = payload.relation_product;
                state.infoAuctioneers = payload.infoAuctioneers;
            })
            .addCase(getProductsByCategory.fulfilled, (state, { payload }) => {
                state.productsByCategory = payload.info_types;
                state.categoryName = payload.name;
            })
            .addCase(getSearchResult.fulfilled, (state, { payload }) => {
                state.searchResult = payload;
            })

    },
})

// Action creators are generated for each case reducer function
export const { setInfoProduct, 
    setSearchResult,
    sortProductAscendingByPrice,
    sortProductDescendingByCreateDate
} = productSlice.actions;
export const selectRunOutItems = state => state.product.runOutItems;
export const selectTopHighestCost = state => state.product.topHighestCost;
export const selectTopHighestAutions = state => state.product.topHighestAutions;
export const selectInfoProduct = state => state.product.infoProduct;
export const selectRelationProduct = state => state.product.relationProduct;
export const selectProductsByCategory = state => state.product.productsByCategory;
export const selectCategoryName = state => state.product.categoryName;
export const selectSearchResult = state => state.product.searchResult;
export const selectInfoAuctioneers = state => state.product.infoAuctioneers;
export default productSlice.reducer;