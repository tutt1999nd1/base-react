import axios from 'axios';
import queryString from 'query-string';
import { toast, ToastContainer } from "react-toastify";
import {useSelector} from "react-redux";
// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    // const token = JSON.parse(localStorage.getItem('persist:root')).token.replaceAll(`"`,``)
    const token = localStorage.getItem('token');

    if (token != "") {
        const bearer = `Bearer ${token}`;

        config.headers = { 'Authorization': bearer }
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
    let options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    }
    if (error.response) {
        if (error.response.status === 400) {
            if (error.response.data.status.code == "permission_denied" ) {
                toast.error('Bạn không có quyền thực hiện', options);
            }
            else if(error.response.data.status.code == "not_support"){
                toast.error('Không hỗ trợ', options);
            } else if(error.response.data.status.code == "action_not_allow"){
                toast.error('Thao tác không hợp lệ', options);
            } else if(error.response.data.status.code == "invalid_data_type"){
                toast.error('Loại dữ liệu không hợp lệ', options);
            } else if(error.response.data.status.code == "cannot_read_file"){
                toast.error('Không thể đọc file dữ liệu', options);
            } else if(error.response.data.status.code == "cannot_delete_file"){
                toast.error('Không thể xóa file dữ liệu', options);
            } else if(error.response.data.status.code == "file_already_exist"){
                toast.error('File dữ liệu đã tồn tại', options);
            } else if(error.response.data.status.code == "cannot_move_file"){
                toast.error('Không thể di chuyển file dữ liệu', options);
            } else if(error.response.data.status.code == "folder_does_not_exist"){
                toast.error('Thư mục không tồn tại', options);
            } else if(error.response.data.status.code == "cannot_delete_folder"){
                toast.error('Không thể xóa thư mục', options);
            } else if(error.response.data.status.code == "move_folder_error"){
                toast.error('Không thể di chuyển thư mục', options);
            } else if(error.response.data.status.code == "cannot_rename_file"){
                toast.error('Không thể đổi tên file dữ liệu', options);
            } else if(error.response.data.status.code == "file_does_not_exist"){
                toast.error('File dữ liệu không tồn tại', options);
            } else if(error.response.data.status.code == "cannot_create_file"){
                toast.error('Không thể tạo file dữ liệu', options);
            } else if(error.response.data.status.code == "cannot_create_folder"){
                toast.error('Không thể tạo thư mục dữ liệu', options);
            } else if(error.response.data.status.code == "invalid_status"){
                toast.error('Trạng thái không hợp lệ', options);
            }
            else if(error.response.data.status.code == "invalid_sof_data"){
                toast.error('Dữ liệu hợp đồng vay không hợp lệ', options);
            } else if(error.response.data.status.code == "member_already_exist"){
                toast.error('Thành viên đã tồn tại', options);
            }
            else {
                toast.error('Có lỗi xảy ra', options);
            }
        }
        else if(error.response.status===401){
            // localStorage.clear()
        }
    }
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