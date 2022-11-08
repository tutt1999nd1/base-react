import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerCompany{
    getListCompany = (data) => {
        return axiosClient.post(API_MAP.GET_LIST_COMPANY,data)
    }
    getListCompanyAvai = (data) => {
        return axiosClient.post(API_MAP.GET_LIST_COMPANY_AVAI,data)
    }
    importCompany = (data) => {
        return axiosClient.post(API_MAP.IMPORT_COMPANY,data,{
            // params: description,
            headers: {'content-type': 'multipart/form-data'}
        })
    }
    createCompany = (data) => {
        return axiosClient.post(API_MAP.CREATE_COMPANY,data)
    }
    updateCompany = (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_COMPANY+`/${id}`,data)
    }
    deleteCompany = (id) => {
        return axiosClient.delete(API_MAP.DELETE_COMPANY+`/${id}`)
    }
    deleteChangeHistory = (id) => {
        return axiosClient.delete(API_MAP.DELETE_CHANGE_HISTORY+`/${id}`)
    }
    deleteListCompany= (data) => {
        return axiosClient.post(API_MAP.DELETE_LIST_COMPANY,data)
    }
    updateCompanyMember= (data) => {
        return axiosClient.post(API_MAP.UPDATE_MEMBER_COMPANY+`/${data.id}`,data)
    }
    addCompanyMember= (data) => {
        return axiosClient.post(API_MAP.ADD_MEMBER_COMPANY,data)
    }
    getChangeHistory = (id) => {
        return axiosClient.get(API_MAP.GET_CHANGE_HISTORY+`/${id}`)
    }
    getMember = (id) => {
        return axiosClient.get(API_MAP.GET_MEMBER_COMPANY+`/${id}`)
    }
    addHistory = (data) => {
        return axiosClient.post(API_MAP.CREATE_CHANGE_HISTORY,data)
    };
    updateHistory = (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_CHANGE_HISTORY+`/${id}`,data)
    }
    getHistoryById = (id) => {
        return axiosClient.get(API_MAP.GET_CHANGE_HISTORY_BY_ID+`/${id}`)
    }

    addShareHolder = (data) => {
        return axiosClient.post(API_MAP.ADD_SHAREHOLDER,data)
    };
    getShareHolder = (id) => {
        return axiosClient.get(API_MAP.GET_SHAREHOLDER+`/${id}`)
    }
    removeShareHolder = (id) => {
        return axiosClient.post(API_MAP.REMOVE_SHAREHOLDER+`/${id}`)
    }
}

const apiManagerCompany = new ApiManagerCompany();

export default apiManagerCompany;