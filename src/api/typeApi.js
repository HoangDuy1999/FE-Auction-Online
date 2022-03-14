import axiosClient from './axiosClient';

const prefix='types';

const productApi = {
    getTypeList(){
        const url = `/${prefix}`;
        return axiosClient.get(url);
    },
    getTypeInfo(){
        const url = `/${prefix}/fullinfos`;
        return axiosClient.get(url);
    },
}

export default productApi;