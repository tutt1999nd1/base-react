import React, {useEffect} from "react";
import {Outlet, useNavigate, useSearchParams} from 'react-router-dom';
import Header from "../../../base-react/src/components/Header";
import Nav from "../../../base-react/src/components/Nav";
import Footer from "../../../base-react/src/components/Footer";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {InteractionStatus} from "@azure/msal-browser";
import {loginRequest} from "../constants/authConfig";

export default function Main() {
    // const navigate = useNavigate();
    // const isAuthenticated = useIsAuthenticated();
    // useEffect(()=>{
    //     if(!isAuthenticated)navigate('/login')
    // },[isAuthenticated])
    const isAuthenticated = useIsAuthenticated();
    const { instance, inProgress,accounts } = useMsal();

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
    //     instance.loginRedirect(loginRequest);
    // }

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