import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import { boolean } from 'yup';
import accountApi from "../../api/accountApi";
import { NotifyHelper } from '../../helper/NotifyHelper';

const initialState = {
    requesting: false,
    userInfo: {},
    OTP: 0,
    registerInfo: {},
    profile: {},
    watchList: [],
    getReviews: [],
    isRequestUpgrade: boolean,
    access_token: "",
    wonProducts: [],
    soldProducts: [],
    publicReviews: [],
}

export const getProfile = createAsyncThunk("user/getProfile",
    async () => {
        const response = await accountApi.getProfile();
        if (response.status === 200)
            return response.data;
        return 0;
    });

export const getWatchList = createAsyncThunk("user/getWatchList",
    async () => {
        const response = await accountApi.getWatchList();
        if (response.status === 200)
            return response.data;
        return 0;
    });

export const addWatchList = createAsyncThunk("user/addWatchList",
    async (id) => {
        const response = await accountApi.addWatchList(id);
        if (response.status === 200) {
            NotifyHelper.success(response.data.message, 'Thông báo');
            return 1;
        }
        NotifyHelper.success(response.data.message, 'Thông báo');
        return 0;
    }
);

export const removeWatchList = createAsyncThunk("user/removeWatchList",
    async (id) => {
        const response = await accountApi.removeWatchList(id);
        if (response.status === 200) {
            NotifyHelper.success(response.data.message, 'Thông báo');
            return 1;
        }
        NotifyHelper.success(response.data.message, 'Thông báo');
        return 0;
    }
);

export const getReviews = createAsyncThunk("user/getReviews",
    async (id) => {
        const response = await accountApi.getReviews(id);
        if (response.status === 200) {
            return response.data;
        }
        return 0;
    }
);

export const getPublicReviews = createAsyncThunk("user/getPublicReviews",
    async (id) => {
        const response = await accountApi.getReviews(id);
        if (response.status === 200) {
            return response.data;
        }
        return 0;
    }
);

export const upgradeAccount = createAsyncThunk("user/upgradeAccount",
    async () => {
        const response = await accountApi.upgradeAccount();
      
        if (response.status === 200) {
            NotifyHelper.success(response.data.message, 'Thông báo');
            return 1;
        }
        NotifyHelper.success(response.data.message, 'Thông báo');
        return 0;
    }
);

export const refreshToken = createAsyncThunk("user/refreshToken",
    async () => {
        const response = await accountApi.refreshToken();
      
        if (response.status === 200) {
           
            return response.data;
        }
        return 0;
    }
);

export const getWonProducts = createAsyncThunk("user/getWonProducts",
    async () => {
        const response = await accountApi.getWonProducts();
      
        if (response.status === 200) {
           
            return response.data;
        }
        return 0;
    }
);

export const getSoldProducts = createAsyncThunk("user/getSoldProducts",
    async () => {
        const response = await accountApi.getSoldProducts();
      
        if (response.status === 200) {
           
            return response.data;
        }
        return 0;
    }
);


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload;
        },
        setOTP: (state, action) => {
            state.OTP = action.payload;
        },
        setRegisterInfo: (state, action) => {
            state.registerInfo = action.payload;
        },
        getUserInfo: (state, action) => {
            state.userInfo = jwt_decode(localStorage.x_accessToken);
        },
        refresh: (state, action) => {
            state.requesting = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.fulfilled, (state, { payload }) => {
                state.profile = payload.info_account;
                state.isRequestUpgrade =  payload.info_account.request_update;
            })
            .addCase(getWatchList.fulfilled, (state, { payload }) => {
                state.watchList = payload.watch_list;
            })
            .addCase(getReviews.fulfilled, (state, { payload }) => {
                state.requesting = true;
                state.getReviews = payload;
            })
            .addCase(addWatchList.fulfilled, (state, { payload }) => {
                state.requesting = true;
            })
            .addCase(removeWatchList.fulfilled, (state, { payload }) => {
                state.requesting = true;
            })
            .addCase(upgradeAccount.fulfilled, (state, { payload }) => {
                state.requesting = true;
            })
            .addCase(refreshToken.fulfilled, (state, { payload }) => {
                state.requesting = true;
                state.access_token = payload.accessToken;
            })
            .addCase(getWonProducts.fulfilled, (state, { payload }) => {
                state.requesting = true;
                state.wonProducts = payload;
            })
            .addCase(getSoldProducts.fulfilled, (state, { payload }) => {
                state.requesting = true;
                state.soldProducts = payload;
            })
            .addCase(getPublicReviews.fulfilled, (state, { payload }) => {
                state.requesting = true;
                state.publicReviews = payload;
            })
    },
})

// Action creators are generated for each case reducer function
export const { setUser, setOTP, setRegisterInfo, getUserInfo, refresh
     } = userSlice.actions;
export const selectUser = state => state.user.userInfo;
export const selectOTP = state => state.user.OTP;
export const selectRegisterInfo = state => state.user.registerInfo;
export const selectProfile = state => state.user.profile;
export const selectWatchList = state => state.user.watchList;
export const selectReviews = state => state.user.getReviews;
export const selectRequestUpgrade = state => state.user.isRequestUpgrade;
export const selectAccessToken = state => state.user.access_token;
export const selectWonProducts = state => state.user.wonProducts;
export const selectSoldProducts = state => state.user.soldProducts;
export const selectPublicReviews = state => state.user.publicReviews;
export default userSlice.reducer;