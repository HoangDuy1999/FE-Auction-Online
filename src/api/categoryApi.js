import axiosClient from './axiosClient';

const prefix='categories';

const productApi = {
    getCategories(){
        const url = `/${prefix}`;
        return axiosClient.get(url);
    },
 
}

export default productApi;