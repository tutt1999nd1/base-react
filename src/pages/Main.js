import React, {useEffect, useState} from "react";
import {Outlet, useNavigate} from 'react-router-dom';
import Header from "../components/Header";
import Nav from "../components/Nav";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {loginRequest} from "../constants/authConfig";
import {useDispatch, useSelector} from "react-redux";
import {
    updateHomeAccountId,
    updateName, updateRole,
    updateToken,
    updateTokenGraphApi,
    updateUsername
} from "../store/user/userSlice";

export default function Main() {
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const dispatch = useDispatch();
    const { instance, accounts, inProgress } = useMsal();
    const [accessToken, setAccessToken] = useState(null);
    const [countInterval, setCountInterval] = useState(0);

    // const isAuthenticated = useIsAuthenticated();
    // useEffect(()=>{
    //     if(!isAuthenticated)navigate('/login')
    // },[isAuthenticated])
    const currentUser = useSelector(state => state.currentUser)
    function RequestAccessToken() {
        const request = {
            ...loginRequest,
            account: accounts[0]
        };
        const requestGraphApi = {
            scopes: ["User.Read.All"],
            account: accounts[0]
        };
        // Silently acquires an access token which is then attached to a request for Microsoft Graph data
        instance.acquireTokenSilent(request).then((response) => {
            setAccessToken(response.accessToken);
            dispatch(updateToken(response.accessToken));

        }).catch((e) => {
            instance.acquireTokenPopup(request).then((response) => {
                dispatch(updateToken(response.accessToken));

            });
        });
        instance.acquireTokenSilent(requestGraphApi).then((response) => {
            setAccessToken(response.accessToken);
            dispatch(updateTokenGraphApi(response.accessToken));

        }).catch((e) => {
            instance.acquireTokenPopup(requestGraphApi).then((response) => {
                dispatch(updateTokenGraphApi(response.accessToken));

            });
        });

    }
    useEffect(()=>{
        console.log("accounts[0]",accounts[0])
        if(isAuthenticated){
            dispatch(updateUsername(accounts[0].username))
            if(accounts[0].idTokenClaims.roles){
                dispatch(updateRole(accounts[0].idTokenClaims.roles))
            }
            dispatch(updateName(accounts[0].name))
            dispatch(updateHomeAccountId(accounts[0].homeAccountId))
            RequestAccessToken();
            // navigate('/dashboard')
            // console.log("accounts",accounts)
        }
        const intervalId = setInterval(() => {
            setCountInterval(prevCount => prevCount + 1);
            RequestAccessToken();

        }, 300000);
        return () => clearInterval(intervalId);
        // else {
        //     localStorage.clear()
        //
        // }
    },[])
    console.log("inProgress")
    //
    // if (inProgress === InteractionStatus.None && !isAuthenticated) {
    //     setTimeout(() => {
    //         if (accounts.length === 0) {
    //             instance.loginRedirect();
    //         }
    //     }, 500)
    // }
    // if (inProgress === InteractionStatus.None && !isAuthenticated) {
    //     navigate('/login')
    //     // instance.loginRedirect(loginRequest);
    // }
    // useLayoutEffect(() => {
    //     alert("tutt")
    //     //check local token or something
    //     if(!currentUser.token){
    //         navigate('/login')
    //     }
    // }, [currentUser.token]);

    return (
        <div className={'main'}>
            <Nav></Nav>
            <div style={{width:'100%',height:'100%','overflow-y':'auto'}}>
                <Header></Header>
                <div className={'main-body'}>
                        <Outlet/>
                </div>
                {/*<Footer></Footer>*/}
            </div>

        </div>
    );
};