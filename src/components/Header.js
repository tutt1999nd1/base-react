import React, { useEffect, useState } from "react";
import {Avatar, Badge, Breadcrumbs, Button, IconButton, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import Link from '@mui/material/Link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import {useDispatch,useSelector} from "react-redux";
import {updateShowMenu} from "../store/user/userSlice";

const Header = () => {
    // const [anchorEl, setAnchorEl] =
    const currentUser = useSelector(state => state.currentUser)
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = React.useState();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const touchMenu = () => {
      dispatch(updateShowMenu(!currentUser.showMenu))
    }
    return (
        <header className={'header'}>
            <div style={{display:"flex",justifyContent:'space-between',width:'100%'}}>
                <div className={'header-left'}>
                    <IconButton  onClick={touchMenu}>
                        <MenuIcon></MenuIcon>
                    </IconButton>
                    {/*<Breadcrumbs aria-label="breadcrumb">*/}
                    {/*    <Link underline="hover" color="inherit" href="/" to={""}>*/}
                    {/*        Danh mục*/}
                    {/*    </Link>*/}
                    {/*    <Typography color="text.primary">Tài khoản</Typography>*/}
                    {/*</Breadcrumbs>*/}
                </div>
                <div className={'header-right'}>
                    <Tooltip title="Thông báo">
                        <IconButton color="primary"  component="label" style={{marginRight:'10px'}}>
                            <Badge badgeContent={4}  color={'primary'} sx={{
                                "& .MuiBadge-badge": {
                                    color: "white",
                                    backgroundColor: "#D14343"
                                }
                            }}>
                                <NotificationsIcon style={{ color: "#6b7280" }}></NotificationsIcon>
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Avatar
                        id={"basic-menu"}
                        alt="Avatar"
                        src={require('../assets/img/avatar.jpg')}
                        sx={{ width: 35, height: 35 }}
                        style={{cursor:'pointer'}}
                        onClick={handleClick}
                    />
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
                        {/*<MenuItem onClick={handleClose}>My account</MenuItem>*/}
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>

        </header>
    );
};

export default Header
