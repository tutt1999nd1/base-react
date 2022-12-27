import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiChangeLendingAmount{
    getListChangeLendingAmount = (data) => {
        return axiosClient.post(API_MAP.GET_LIST_CHANGE_LENDING_AMOUNT,data)
    }
    getPayablePeriodDetail = (id,start,end,data) => {
        return axiosClient.post(API_MAP.GET_PAYABLE_PERIOD_DETAIL+`/${id}?startDate=${start}&endDate=${end}`,data)
    }
    createChangeLendingAmount = (data) => {
        return axiosClient.post(API_MAP.CREATE_CHANGE_LENDING_AMOUNT,data)
    }
    updateChangeLendingAmount = (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_CHANGE_LENDING_AMOUNT+`/${id}`,data)
    }
    createChangeLendingAmountFile = (data) => {
        return axiosClient.post(API_MAP.CREATE_CHANGE_LENDING_AMOUNT_FILE,data,{
            // params: description,
            headers: {'content-type': 'multipart/form-data'}
        })
    }
    updateChangeLendingAmountFile = (id,data) => {
        return axiosClient.post(API_MAP.UPDATE_CHANGE_LENDING_AMOUNT+`/${id}`,data,{
            // params: description,
            headers: {'content-type': 'multipart/form-data'}
        })
    }
    deleteListChangeLendingAmount= (data) => {
        return axiosClient.post(API_MAP.DELETE_LIST_CHANGE_LENDING_AMOUNT,data)
    }
    deleteChangeLendingAmount = (id) => {
        return axiosClient.delete(API_MAP.DELETE_CHANGE_LENDING_AMOUNT+`/${id}`)
    }
}

const apiChangeLendingAmount = new ApiChangeLendingAmount();

export default apiChangeLendingAmount;