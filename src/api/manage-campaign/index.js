import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerCampaign{
    getListCampaign= (data) => {
        return axiosClient.post(API_MAP.GET_LIST_CAMPAIGNS,data)
    }
    createCampaign = (data) => {
        return axiosClient.post(API_MAP.CREATE_CAMPAIGNS,data)
    }
    updateCampaign = (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_CAMPAIGNS+`/${id}`,data)
    }
    deleteCampaign = (id) => {
        return axiosClient.delete(API_MAP.DELETE_CAMPAIGNS+`/${id}`)
    }
}

const apiManagerCampaign = new ApiManagerCampaign();

export default apiManagerCampaign;