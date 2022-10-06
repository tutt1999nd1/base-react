import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerAssets{
    getListAsset = (data) => {
        return axiosClient.post(API_MAP.GET_LIST_ASSETS,data)
    }
    createAsset = (data) => {
        return axiosClient.post(API_MAP.CREATE_ASSETS,data,{
            // params: description,
            headers: {'content-type': 'multipart/form-data'}
        })
    }
    updateAsset = (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_ASSETS+`/${id}`,data)
    }
    deleteAsset = (id) => {
        return axiosClient.delete(API_MAP.DELETE_ASSETS+`/${id}`)
    }
    getAssetGroup = () => {
        return axiosClient.get(API_MAP.GET_ASSETS_GROUP)
    }
    getAssetType = () => {
        return axiosClient.get(API_MAP.GET_ASSETS_TYPE)
    }
    getListAssetDashboard = (data) => {
        return axiosClient.get(API_MAP.GET_LIST_ASSETS_DASHBOARD,data)
    }
    // deleteBackup = (data) => {
    //     return axiosClient.post(API_MAP.DELETE_BACKUP ,data)
    // }
}

const apiManagerAssets = new ApiManagerAssets();

export default apiManagerAssets;