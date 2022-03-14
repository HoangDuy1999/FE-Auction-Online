import axiosClient from './axiosClient';

const prefix='accounts';

const accountApi = {
    getProfile(){
        const url = `/${prefix}/detail`;
        return axiosClient.get(url);
    },
    getWatchList(){
        const url = `/bidder/watch_list`;
        return axiosClient.get(url);
    },
    addWatchList(id){
        const data ={
            product_id: id
        }
        const url = `/bidder/watch_list?product_id=${id}`;
        return axiosClient.post(url,data);
    },
    removeWatchList(id){
        const data ={
            product_id: id
        }
        const url = `/bidder/watch_list?product_id=${id}`;
        return axiosClient.delete(url,data);
    },
    getReviews(id){
        const url = `/evaluation_historys/${id}`;
        return axiosClient.get(url);
    },
    upgradeAccount(){
        const data={};
        const url = `/bidder/account/requestUpgrade`;
        return axiosClient.post(url,data);
    },
    refreshToken(){
        const url = `/refreshToken`;
        return axiosClient.post(url);
    },
    getWonProducts(){
        const url = `/bidder/product/won_list`;
        return axiosClient.get(url);
    },
    getSoldProducts(){
        const url = `/seller/product/listProductHasBidder`;
        return axiosClient.get(url);
    },
    getPublicReviews(accountId){
        const data ={
            account_id: accountId
        }
        const url = `/evaluation_historys`;
        return axiosClient.get(url, data);
    },
}

export default accountApi;