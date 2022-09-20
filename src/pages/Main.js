import React, {useEffect} from "react";
import {Outlet, useNavigate, useSearchParams} from 'react-router-dom';
import Header from "../../../base-react/src/components/Header";
import Nav from "../../../base-react/src/components/Nav";
import Footer from "../../../base-react/src/components/Footer";

export default function Main() {

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