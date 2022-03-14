import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import adminApi from "../../api/adminApi";
import { NotifyHelper } from '../../helper/NotifyHelper';

const initialState = {
    products: [],
    accounts: [],
    bidders: [],
    sellers: [],
    removeResult: 0,
    waitUpgrade: [],
    temp: null,
    allProducts: [],
}

export const getProduct = createAsyncThunk("admin/getProduct",
    async () => {
        const response = await adminApi.getProduct();
        if (response.status === 200)
            return response.data;
        return 0;
    });

export const getAccount = createAsyncThunk("admin/getAccount",
    async () => {
        const response = await adminApi.getAccount();
        if (response.status === 200)
            return response.data;
        return 0;
    });

export const getWaitUpgrade = createAsyncThunk("admin/getWaitUpgrade",
    async () => {
        const response = await adminApi.getWaitUpgrade();
        if (response.status === 200)
            return response.data;
        return 0;
    });

export const removeProduct = createAsyncThunk("admin/removeProduct",
    async (id) => {
        const response = await adminApi.removeProduct(id);
        if (response.status === 200) {
            NotifyHelper.success(response.data.message, "Thông báo");
            return 1;
        }
        NotifyHelper.error(response.data.message, "Thông báo");
        return 0;
    });

export const upgradeAccount = createAsyncThunk("admin/upgradeAccount",
    async (id) => {
        const response = await adminApi.upgradeAccount(id);
        if (response.status === 200) {
            NotifyHelper.success(response.data.message, "Thông báo");
            return 1;
        }
        NotifyHelper.error(response.data.message, "Thông báo");
        return 0;
    });

export const inferiorAccount = createAsyncThunk("admin/inferiorAccount",
    async (id) => {
        const response = await adminApi.inferiorAccount(id);
        if (response.status === 200) {
            NotifyHelper.success(response.data.message, "Thông báo");
            return 1;
        }
        NotifyHelper.error(response.data.message, "Thông báo");
        return 0;
    });

export const getAllProduct = createAsyncThunk("admin/getAllProduct",
    async () => {
        const response = await adminApi.getAllProduct();
        if (response.status === 200) {

            return response.data;
        }

        return 0;
    });

export const resetPassWord = createAsyncThunk("user/resetPassWord",
    async (id) => {
        const response = await adminApi.resetPassWord(id);

        if (response.status === 200) {
            NotifyHelper.success(response.data.message);
            return 1;
        }
        return 0;
    }
);

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        remove: (state, action) => {
            state.products = state.products.filter(p => p.product_id !== action.payload);
        },
        removeWaitAccount: (state, action) => {
            state.waitUpgrade = state.waitUpgrade.filter(a => a.account_id !== action.payload);
        },
        refreshAccount: (state, action) => {
            state.sellers = state.sellers.filter(a => a.account_id !== action.payload);
            state.bidders = state.bidders.filter(a => a.account_id !== action.payload);
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getProduct.fulfilled, (state, { payload }) => {
                state.products = payload;
            })
            .addCase(getAccount.fulfilled, (state, { payload }) => {
                state.accounts = payload;
                state.bidders = payload.filter(a => a.role_id === 1);
                state.sellers = payload.filter(a => a.role_id === 2);
            })
            .addCase(getWaitUpgrade.fulfilled, (state, { payload }) => {
                state.waitUpgrade = payload;
            })
            .addCase(upgradeAccount.fulfilled, (state, { payload }) => {

            })
            .addCase(inferiorAccount.fulfilled, (state, { payload }) => {

            })
            .addCase(getAllProduct.fulfilled, (state, { payload }) => {
                state.allProducts = payload;
            })
            .addCase(resetPassWord.fulfilled, (state, { payload }) => {
               
            })
    },
})

// Action creators are generated for each case reducer function
export const { remove, removeWaitAccount, refreshAccount } = adminSlice.actions;
export const selectProducts = state => state.admin.products;
export const selectAllProducts = state => state.admin.allProducts;
export const selectAccounts = state => state.admin.accounts;
export const selectSellers = state => state.admin.sellers;
export const selectBidders = state => state.admin.bidders;
export const selectWaitUpgrade = state => state.admin.waitUpgrade;
export const selectRemoveResult = state => state.admin.removeResult;
export default adminSlice.reducer;