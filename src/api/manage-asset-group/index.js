import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerAssetGroup{
    getListAssetGroup= (data) => {
        return axiosClient.post(API_MAP.GET_LIST_ASSET_GROUP,data)
    }
    getListAssetGroupTree= (data) => {
        return axiosClient.post(API_MAP.GET_LIST_ASSET_GROUP_TREE,data)
    }
    createAssetGroup = (data) => {
        return axiosClient.post(API_MAP.CREATE_ASSET_GROUP,data)
    }
    updateAssetGroup = (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_ASSET_GROUP+`/${id}`,data)
    }
    deleteAssetGroup = (id) => {
        return axiosClient.delete(API_MAP.DELETE_ASSET_GROUP+`/${id}`)
    }
    deleteListAssetGroup= (data) => {
        return axiosClient.post(API_MAP.DELETE_LIST_ASSET_GROUP,data)
    }
}

const apiManagerAssetGroup = new ApiManagerAssetGroup();

export default apiManagerAssetGroup;