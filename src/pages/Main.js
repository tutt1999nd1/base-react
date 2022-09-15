import React, {useEffect} from "react";
import {Outlet, useNavigate, useSearchParams} from 'react-router-dom';
import Header from "../../../base-react/src/components/Header";
import Nav from "../../../base-react/src/components/Nav";
import Footer from "../../../base-react/src/components/Footer";

export default function Main() {

    return (
        <div className={'main'}>
            <Nav></Nav>
            <div style={{width:'100%'}}>
                <Header></Header>
                <Outlet/>
                <Footer></Footer>
            </div>



        </div>
    );
};