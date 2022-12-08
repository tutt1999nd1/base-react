import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerChargingEst{
    // getListChargingEst = (data) => {
    //     //     return axiosClient.post(API_MAP.GET_LIST_CHARGING_EST,data)
    //     // }
    getListChargingEst = (data) => {
        return axiosClient.post(API_MAP.GET_PAYABLE_PERIOD,data)
    }
    sendEmailChargingEst = (data) => {
        return axiosClient.post(API_MAP.SEND_EMAIL_CHARGING_EST,data)
    }
    getInterestTable = (data) => {
        return axiosClient.post(API_MAP.GET_INTEREST_TABLE,data)
    }
    exportChargingEst = (data) => {
        return axiosClient.post(API_MAP.EXPORT_CHARGING_EST,data)
    }
    updateChargingEst= (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_CHARGING_EST+`/${id}`,data)
    }
    updateStatusPayable= (id) => {
        return axiosClient.post(API_MAP.UPDATE_STATUS_PAYABLE+`/${id}`)
    }

}

const apiManagerChargingEst = new ApiManagerChargingEst();

export default apiManagerChargingEst;