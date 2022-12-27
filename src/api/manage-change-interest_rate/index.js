import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiChangeInterestRate{
    getListChangeInterestRate= (data) => {
        return axiosClient.post(API_MAP.GET_LIST_CHANGE_INTEREST_RATE,data)
    }
    createChangeInterestRate = (data) => {
        return axiosClient.post(API_MAP.CREATE_CHANGE_INTEREST_RATE,data)
    }
    createChangeInterestRateFile = (data) => {
        return axiosClient.post(API_MAP.CREATE_CHANGE_INTEREST_RATE_FILE,data,{
            headers: {'content-type': 'multipart/form-data'
            }
        })
    }
    updateChangeInterestRate = (id,data) => {
        return axiosClient.post(API_MAP.UPDATE_CHANGE_INTEREST_RATE+`/${id}`,data,{
            headers: {'content-type': 'multipart/form-data'}
        })
    }
    deleteListChangeInterestRate= (data) => {
        return axiosClient.post(API_MAP.DELETE_LIST_CHANGE_INTEREST_RATE,data)
    }
    deleteChangeInterestRate = (id) => {
        return axiosClient.delete(API_MAP.DELETE_CHANGE_INTEREST_RATE+`/${id}`)
    }
}

const apiChangeInterestRate = new ApiChangeInterestRate();

export default apiChangeInterestRate;