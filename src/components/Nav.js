import React, {useEffect, useState} from "react";
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
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
import {useSelector} from "react-redux";

export default function Nav() {
    const { pathname } = useLocation();
    const navigate = useNavigate()
    const currentUser = useSelector(state => state.currentUser)
    const [open, setOpen] = useState(true)
    const handleClickCollapse = () => {
        setOpen(!open);
    };
    useEffect(() => {
        if (pathname == '/') navigate('/dashboard')
    }, [pathname])
    return (
        <nav className={`nav ${currentUser.showMenu?'':'animationTab'}`}>
            <div className={'logo'}>
                <img style={{width: '100%'}} src={require('../assets/img/logo-white.png')}/>
            </div>
            <hr/>
            <div style={{marginTop: "10px"}}>
                <ul>
                    <NavLink className={'nav-link'} isActive={true} to={'dashboard'}>
                        <li>
                            <div className={'nav-item'}>
                                <div className={'nav-item-name'}><DashboardIcon></DashboardIcon>
                                    Dashboard
                                </div>
                            </div>
                        </li>
                    </NavLink>
                    <NavLink className={'nav-link'}   to={'assets'}>
                        <li>
                            <div className={'nav-item'}>
                                <div className={'nav-item-name'}><AttachMoneyIcon></AttachMoneyIcon>Quản lý tài sản</div>
                            </div>
                        </li>
                    </NavLink>
                    <NavLink className={'nav-link'} to={'campaign'}>
                        <li>
                            <div className={'nav-item'}>
                                <div className={'nav-item-name'}><DashboardIcon></DashboardIcon>Quản lý mục đích vay</div>
                            </div>
                        </li>
                    </NavLink>
                    <NavLink className={'nav-link'} to={'sof'}>
                        <li>
                            <div className={'nav-item'}>
                                <div className={'nav-item-name'}><AssignmentIcon></AssignmentIcon>Quản lý nguồn vốn</div>
                            </div>
                        </li>
                    </NavLink>
                    <NavLink className={'nav-link'} to={'approve'}>
                        <li>
                            <div className={'nav-item'}>
                                <div className={'nav-item-name'}><AssignmentIcon></AssignmentIcon>Quản lý phê duyệt</div>
                            </div>
                        </li>
                    </NavLink>
                    <NavLink className={'nav-link '} to={'charging_est'}>
                        <li>
                            <div className={'nav-item'}>
                                <div className={'nav-item-name'}><AssignmentIcon></AssignmentIcon>Tính lãi</div>
                            </div>
                        </li>
                    </NavLink>
                    {/*<NavLink className={'nav-link'} to={''}>*/}
                    {/*    <li onClick={handleClickCollapse}>*/}
                    {/*        <div className={'nav-item'} style={{width:'100%'}}>*/}
                    {/*            <div className={'nav-item-name'}><LibraryBooksIcon></LibraryBooksIcon>Danh mục</div>*/}
                    {/*            {open ? <ExpandLess/> : <ExpandMore/>}*/}
                    {/*        </div>*/}
                    {/*    </li>*/}
                    {/*</NavLink>*/}
                    <li onClick={handleClickCollapse}>
                        <div className={'nav-item'} style={{width:'100%'}}>
                            <div className={'nav-item-name'}><LibraryBooksIcon></LibraryBooksIcon>Danh mục</div>
                            {open ? <ExpandLess/> : <ExpandMore/>}
                        </div>
                    </li>


                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <ul>
                            <NavLink className={'nav-link hidden'} to={'account'}>
                                <li>
                                    <div className={'nav-item li-child'}>
                                        <div className={'nav-item-name'}><SwitchAccountIcon></SwitchAccountIcon>Tài khoản
                                        </div>
                                    </div>
                                </li>
                            </NavLink>

                            <NavLink className={'nav-link'} to={'company'}>
                                <li>
                                    <div className={'nav-item li-child'}>
                                        <div className={'nav-item-name'}><BusinessIcon></BusinessIcon>Công ty vay
                                        </div>
                                    </div>
                                </li>
                            </NavLink>
                            <NavLink className={'nav-link'} to={'category'}>
                                <li>
                                    <div className={'nav-item li-child'}>
                                        <div className={'nav-item-name'}><ClassIcon></ClassIcon>Hạng mục</div>
                                    </div>
                                </li>
                            </NavLink>
                            <NavLink className={'nav-link'} to={'supplier'}>
                                <li>
                                    <div className={'nav-item li-child'}>
                                        <div className={'nav-item-name'}><BusinessIcon></BusinessIcon>Đối tượng cung cấp
                                        </div>
                                    </div>
                                </li>
                            </NavLink>
                            <NavLink className={'nav-link'} to={'asset-group'}>
                                <li>
                                    <div className={'nav-item li-child'}>
                                        <div className={'nav-item-name'}><ClassIcon></ClassIcon>Nhóm tài sản</div>
                                    </div>
                                </li>
                            </NavLink>
                        </ul>
                    </Collapse>


                </ul>
            </div>
        </nav>
    );
};