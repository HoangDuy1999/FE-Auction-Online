import axiosClient from './axiosClient';

const prefix='admin';

const adminApi = {
    getProduct(){
        const url = `/${prefix}/product`;
        return axiosClient.get(url);
    },
    getAllProduct(){
        const url = `/${prefix}/product?condition_end_day=true`;
        return axiosClient.get(url);
    },
    getAccount(){
        const url = `/${prefix}/account`;
        return axiosClient.get(url);
    },
    getWaitUpgrade(){
        const url = `/${prefix}/account/bidder`;
        return axiosClient.get(url);
    },
    upgradeAccount(id){
        const url = `/${prefix}/account/upgrade?account_id=${id}`;
        return axiosClient.patch(url);
    },
    inferiorAccount(id){
        const url = `/${prefix}/account/inferior?account_id=${id}`;
        return axiosClient.patch(url);
    },
    removeProduct(id){
        const url = `/${prefix}/product/removeProduct?id=${id}`;
        return axiosClient.patch(url);
    },
    resetPassWord(id){
        const data ={
            account_id : Number(id) 
        }
        const url = `/accounts/reset_password`;
        return axiosClient.patch(url, data);
    },
}

export default adminApi;