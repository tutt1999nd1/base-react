import axios from 'axios';
import queryString from 'query-string';
import { toast, ToastContainer } from "react-toastify";
// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    // const token = JSON.parse(localStorage.getItem('persist:root')).token.replaceAll(`"`,``)
    const token = localStorage.getItem('token');
    if (token != "") {
        config.headers = { 'token': token }
    }
    return config;
});

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;

}, (error) => {
    // alert("errorr :", JSON.stringify(error.response))
    // Handle errors
    // if (error.response) {
    //     if (error.response.status === 400) {
    //         if (error.response.data.detail == "Wrong Token" || error.response.data.detail == "account is logout") {
    //             localStorage.clear();
    //             window.location.href = "/login"
    //         } else {
    //             localStorage.clear();
    //             window.location.href = "/login"
    //         }
    //     } else {
    //         localStorage.clear();
    //         window.location.href = "/login"
    //     }
    // }
    // let url = new URL(window.location.href);
    // let paramDomain =  url.searchParams.get("domain")
    // if (error.response) {
    //     switch (error.response.status) {
    //         case 400:
    //             if (error.response.data.detail == "Wrong Token" || error.response.data.detail == "account is logout") {
    //                 // window.location.href = "/login"
    //
    //                 window.location.href = `/login${paramDomain!=null?`?domain=${paramDomain}`:''}`
    //                 localStorage.removeItem('token');
    //                 localStorage.removeItem('persist:root')
    //             }
    //             else{
    //                 if(error.response.data.detail_error.includes("tồn tại")){
    //                     toast.error(error.response.data.detail_error, {
    //                         position: "top-right",
    //                         autoClose: 5000,
    //                         hideProgressBar: true,
    //                         closeOnClick: true,
    //                         pauseOnHover: true,
    //                         draggable: true,
    //                     });
    //                 }
    //             }
    //             // else {
    //             //     localStorage.clear();
    //             //     window.location.href = "/login"
    //             // }
    //             break
    //         case 404:
    //             // window.location.href = "/home/errors/notfound"
    //             break
    //         case 503, 500, 505, 504, 501:
    //             window.location.href = "/home/errors/error-server"
    //             break
    //         case 403:
    //             window.location.href = "/home/errors/forbidden"
    //             break
    //     }
    // }
    // else{
    //     window.location.href = `/login`+ paramDomain!=null?`?domain=${paramDomain}`:''
    //     localStorage.removeItem('persist:root');
    //     localStorage.removeItem('token');
    // }
    throw error;
});

export default axiosClient;