import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerCategory{
    getListCategory= (data) => {
        return axiosClient.post(API_MAP.GET_LIST_CATEGORY,data)
    }
    getListCategoryTree= (data) => {
        return axiosClient.post(API_MAP.GET_LIST_CATEGORY_TREE,data)
    }
    createCategory = (data) => {
        return axiosClient.post(API_MAP.CREATE_CATEGORY,data)
    }
    updateCategory = (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_CATEGORY+`/${id}`,data)
    }
    deleteCategory = (id) => {
        return axiosClient.delete(API_MAP.DELETE_CATEGORY+`/${id}`)
    }
}

const apiManagerCategory = new ApiManagerCategory();

export default apiManagerCategory;