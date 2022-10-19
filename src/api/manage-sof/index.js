import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerSOF{
    getListSOF = (data) => {
        return axiosClient.post(API_MAP.GET_LIST_SOF,data)
    }
    getListSOFApprove = (data) => {
        return axiosClient.post(API_MAP.GET_LIST_SOF_APPROVE,data)
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
    sendApproveSOF = (data) => {
        return axiosClient.post(API_MAP.SEND_APPROVE_SOF,data)
    }
    cancelApproveSOF = (data) => {
        return axiosClient.post(API_MAP.CANCEL_APPROVE_SOF,data)
    }
    confirmApproveSOF = (data) => {
        return axiosClient.post(API_MAP.CONFIRM_APPROVE_SOF,data)
    }
    rejectApproveSOF = (data) => {
        return axiosClient.post(API_MAP.REJECT_APPROVE_SOF,data)
    }
    deleteSOF = (id) => {
        return axiosClient.delete(API_MAP.DELETE_SOF+`/${id}`)
    }
    deleteListSOF= (data) => {
        return axiosClient.post(API_MAP.DELETE_LIST_SOF,data)
    }

}

const apiManagerSOF = new ApiManagerSOF();

export default apiManagerSOF;