import React, {useEffect, useState} from "react";
import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BusinessIcon from '@mui/icons-material/Business';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import {Collapse} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ClassIcon from '@mui/icons-material/Class';
import AssignmentIcon from '@mui/icons-material/Assignment';
export default function Nav() {
    const [open, setOpen] = useState(true)
    const handleClickCollapse = () => {
        setOpen(!open);
    };

    return (
        <nav className={'nav'}>
            <div style={{margin: '10px'}}>
                <img style={{width: '100%'}} src={require('../assets/img/logo-white.png')}/>
            </div>
            <hr/>
            <div style={{marginTop: "10px"}}>
                <ul>
                    <li>
                        <div className={'nav-item'}>
                            <div className={'nav-item-name'}><DashboardIcon></DashboardIcon>Dashboard</div>
                        </div>
                    </li>
                    <li>
                        <div className={'nav-item'}>
                            <div className={'nav-item-name'}><AttachMoneyIcon></AttachMoneyIcon>Quản lý tài sản</div>
                        </div>
                    </li>
                    <li>
                        <div className={'nav-item'}>
                            <div className={'nav-item-name'}><DashboardIcon></DashboardIcon>Quản lý mục đích vay</div>
                        </div>
                    </li>
                    <li>
                        <div className={'nav-item'}>
                            <div className={'nav-item-name'}><AssignmentIcon></AssignmentIcon>Quản lý khoản vay</div>
                        </div>
                    </li>

                    <li onClick={handleClickCollapse}>
                        <div className={'nav-item'}>
                            <div className={'nav-item-name'}><LibraryBooksIcon></LibraryBooksIcon>Danh mục</div>
                            {open ? <ExpandLess/> : <ExpandMore/>}
                        </div>
                    </li>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <ul>
                            <li>
                                <div className={'nav-item li-child'}>
                                    <div className={'nav-item-name'}><SwitchAccountIcon></SwitchAccountIcon>Tài khoản
                                    </div>

                                </div>
                            </li>
                            <li>
                                <div className={'nav-item li-child'}>
                                    <div className={'nav-item-name'}><BusinessIcon></BusinessIcon>Quản lý công ty vay
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className={'nav-item li-child'}>
                                    <div className={'nav-item-name'}><ClassIcon></ClassIcon>Hạng mục</div>
                                </div>
                            </li>
                        </ul>
                    </Collapse>


                </ul>
            </div>
        </nav>
    );
};