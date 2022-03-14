import axiosClient from "./axiosClient";

const prefix = 'accounts'
const authApi = {
    signUp(data) {
        const url = `/${prefix}/signup`;
    
        return axiosClient.post(url, data);
      },
    
      signIn(data) {
        const url = `/${prefix}/signin`;
    
        return axiosClient.post(url, data);
      },
};

export default authApi;