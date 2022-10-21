import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerChargingEst{
    getListChargingEst = (data) => {
        return axiosClient.post(API_MAP.GET_LIST_CHARGING_EST,data)
    }
    updateChargingEst= (id,data) => {
        return axiosClient.put(API_MAP.UPDATE_CHARGING_EST+`/${id}`,data)
    }

}

const apiManagerChargingEst = new ApiManagerChargingEst();

export default apiManagerChargingEst;