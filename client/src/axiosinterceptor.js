import axios from "axios";
const axiosInstance=axios.create({
    baseURL:'http://localhost:3000'
})

axiosInstance.interceptors.request.use(function (config) {
    const accessToken=localStorage.getItem('logintoken')
    if(accessToken){
        if(config){
            config.headers.token=accessToken;
        }
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  export default axiosInstance