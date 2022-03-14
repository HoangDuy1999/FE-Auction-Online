import axiosClient from './axiosClient';

const prefix='seller';

const productApi = {
    postProduct(data){
        const url = `/${prefix}/product`;
        console('ap')
        return axiosClient.post(url, { ...data });
    },
}

export default productApi;