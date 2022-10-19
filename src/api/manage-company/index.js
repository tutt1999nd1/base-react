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
    deleteListCompany= (data) => {
        return axiosClient.post(API_MAP.DELETE_LIST_COMPANY,data)
    }
}

const apiManagerCompany = new ApiManagerCompany();

export default apiManagerCompany;