import React, {useEffect, useState} from "react";
import apiManagerAuth from "../../api/manager-auth";
import MicrosoftLogin from "react-microsoft-login";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {onMsalInstanceChange, updateName, updateToken, updateUsername} from "../../store/user/userSlice";
import {useMsal} from "@azure/msal-react";
import {loginRequest} from "../../constants/authConfig";
import { useIsAuthenticated } from "@azure/msal-react";
import {InteractionStatus} from "@azure/msal-browser";
export default function Login() {
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { instance, accounts, inProgress } = useMsal();
    const [accessToken, setAccessToken] = useState(null);
    const handleLogin = () => {
        instance.loginPopup(loginRequest).then(r=>{
            console.log("r")
        }).catch(e => {
            console.error(e);
        });
    }
    function RequestAccessToken() {
        const request = {
            ...loginRequest,
            account: accounts[0]
        };

        // Silently acquires an access token which is then attached to a request for Microsoft Graph data
        instance.acquireTokenSilent(request).then((response) => {
            setAccessToken(response.accessToken);
            dispatch(updateToken(response.accessToken));

        }).catch((e) => {
            instance.acquireTokenPopup(request).then((response) => {
                setAccessToken(response.accessToken);
                dispatch(updateToken(response.accessToken));

            });
        });
    }
    if (inProgress === InteractionStatus.None && isAuthenticated) {
        navigate('/')
    }
    useEffect(()=>{
        if(isAuthenticated){
            dispatch(updateUsername(accounts[0].username))
            dispatch(updateName(accounts[0].name))
            RequestAccessToken();
            navigate('/')
            // console.log("accounts",accounts)
        }
    },[isAuthenticated])
    useEffect(()=>{
        console.log("assetToken",accessToken)
    },[accessToken])
    return (
        <div className={'wrapper-login'}>
            <div className={'wrapper-form-login'}>
                <div className={'logo'}>
                    <img src={require('../../assets/img/new-logo.png')} alt=""/>
                </div>
                <div className={'login-with'}>
                    Login with
                </div>
                <div className={'options-login'}>
                    <div className={'button-login'} onClick={handleLogin}>
                        <div className={'icon-microsoft'}>
                            <img src={require('../../assets/img/microsoft.png')} alt=""/>
                        </div>
                        <div className={'tittle-button-login'}>
                            Microsoft
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}