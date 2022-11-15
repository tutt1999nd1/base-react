import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerMember{
    getListChangeSOF = (data) => {
        return axiosClient.post(API_MAP.GET_LIST_MEMBER,data)
    }
    createMember = (data) => {
        return axiosClient.post(API_MAP.CREATE_MEMBER,data)
    }
    updateMember = (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_MEMBER+`/${id}`,data)
    }
    deleteListMember= (data) => {
        return axiosClient.post(API_MAP.DELETE_LIST_MEMBER,data)
    }
    deleteMember = (id) => {
        return axiosClient.delete(API_MAP.DELETE_MEMBER+`/${id}`)
    }
    removeMemberFromCompany = (id) => {
        return axiosClient.post(API_MAP.REMOVE_MEMBER_COMPANY+`/${id}`)
    }
    getCompanyOfMember = (id) => {
        return axiosClient.get(API_MAP.GET_COMPANY_MEMBER+`/${id}`)
    }
}

const apiManagerMember = new ApiManagerMember();

export default apiManagerMember;