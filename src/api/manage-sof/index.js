import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerSOF{
    getListSOF = (data) => {
        return axiosClient.post(API_MAP.GET_LIST_SOF,data)
    }
    getListSOFDashboard = (data) => {
        return axiosClient.get(API_MAP.GET_LIST_SOF_DASHBOARD,data)
    }
    createSOF = (data) => {
        return axiosClient.post(API_MAP.CREATE_SOF,data,{
            // params: description,
            headers: {'content-type': 'multipart/form-data'}
        })
    }
    updateSOF = (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_SOF+`/${id}`,data)
    }
    deleteSOF = (id) => {
        return axiosClient.delete(API_MAP.DELETE_SOF+`/${id}`)
    }

}

const apiManagerSOF = new ApiManagerSOF();

export default apiManagerSOF;