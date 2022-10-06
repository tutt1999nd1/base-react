import React, {useEffect, useState} from "react";
import apiManagerAuth from "../../api/manager-auth";
import MicrosoftLogin from "react-microsoft-login";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    onMsalInstanceChange,
    updateHomeAccountId,
    updateName,
    updateToken,
    updateUsername
} from "../../store/user/userSlice";
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
        instance.loginPopup({...loginRequest,prompt:'consent'}).then(r=>{
            console.log("r",r)
        }).catch(e => {
            console.error(e);
        });
    }
    // function RequestAccessToken() {
    //     const request = {
    //         ...loginRequest,
    //         account: accounts[0]
    //     };
    //
    //     // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    //     instance.acquireTokenSilent(request).then((response) => {
    //         setAccessToken(response.accessToken);
    //         dispatch(updateToken(response.accessToken));
    //
    //     }).catch((e) => {
    //         instance.acquireTokenPopup(request).then((response) => {
    //             setAccessToken(response.accessToken);
    //             dispatch(updateToken(response.accessToken));
    //
    //         });
    //     });
    // }
    // if (inProgress === InteractionStatus.None && isAuthenticated) {
    //     navigate('/')
    // }

    // useEffect(()=>{
    //     console.log("accounts[0]",accounts[0])
    //     if(isAuthenticated){
    //         dispatch(updateUsername(accounts[0].username))
    //         dispatch(updateName(accounts[0].name))
    //         dispatch(updateHomeAccountId(accounts[0].homeAccountId))
    //         RequestAccessToken();
    //         // navigate('/dashboard')
    //         // console.log("accounts",accounts)
    //     }
    //     // else {
    //     //     localStorage.clear()
    //     //
    //     // }
    // },[isAuthenticated])
    useEffect(()=>{
        localStorage.clear();
    },[])
    return (
        <div className={'wrapper-login'}>
            <div className={'wrapper-form-login'}>
                <div className={'logo'}>
                    <img src={require('../../assets/img/new-logo.png')} alt=""/>
                </div>
                {/*<div className={'login-with'}>*/}
                {/*    Login with*/}
                {/*</div>*/}
                <div className={'options-login'}>
                    <div className={'button-login'} onClick={handleLogin}>
                        <div className={'icon-microsoft'}>
                            <img src={require('../../assets/img/microsoft.png')} alt=""/>
                        </div>
                        <div className={'tittle-button-login'}>
                            Sign in with Microsoft
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}