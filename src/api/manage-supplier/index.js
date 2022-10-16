import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerSupplier{
    getListSupplier = (data) => {
        return axiosClient.post(API_MAP.GET_LIST_SUPPLIER,data)
    }
    createSupplier = (data) => {
        return axiosClient.post(API_MAP.CREATE_SUPPLIER,data)
    }
    updateSupplier = (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_SUPPLIER+`/${id}`,data)
    }
    deleteSupplier = (id) => {
        return axiosClient.delete(API_MAP.DELETE_SUPPLIER+`/${id}`)
    }
}

const apiManagerSupplier = new ApiManagerSupplier();

export default apiManagerSupplier;