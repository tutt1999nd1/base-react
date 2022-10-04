import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";

class ApiManagerAuth{
    login = (data) => {
        return axiosClient.get(API_MAP.LOGIN)
    }


}

const apiManagerAuth = new ApiManagerAuth();

export default apiManagerAuth;