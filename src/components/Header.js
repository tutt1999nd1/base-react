import React, { useEffect, useState } from "react";
import {Avatar, Badge, Breadcrumbs, Button, IconButton, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import Link from '@mui/material/Link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import {useDispatch,useSelector} from "react-redux";
import {updateShowMenu} from "../store/user/userSlice";
import {useMsal} from "@azure/msal-react";
import Axios from 'axios'
const Header = () => {
    const { instance,accounts } = useMsal()
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
    async function handleLogout() {
        // const logoutHint = accounts[0].idTokenClaims.login_hint;
        // await msalInstance.logoutPopup({ logoutHint: logoutHint });
        let homeAccountId = currentUser.homeAccountId;

        const currentAccount = instance.getAccountByHomeId(homeAccountId);
// The account's ID Token must contain the login_hint optional claim to avoid the account picker
         instance.logoutRedirect({account: currentAccount});
        // const logoutRequest = {
        //     account: instance.getAccountByHomeId(currentUser.homeAccountId),
        //     postLogoutRedirectUri: "http://localhost:3000/login",
        // };
        // // localStorage.clear();
        // instance.logoutRedirect(logoutRequest).catch(e => {
        //     console.error(e);
        // });
    }
    const touchMenu = () => {
      dispatch(updateShowMenu(!currentUser.showMenu))
    }
    const [imageUrl, setImageUrl] = useState(null)
    useEffect(() => {
        if(localStorage.getItem('tokenGraphApi'))
        Axios.get('https://graph.microsoft.com/v1.0/me/photo/$value', {
            headers: { 'Authorization': `Bearer ${currentUser.tokenGraphApi}` },
            responseType: 'blob'
        }).then(o => {
            const url = window.URL || window.webkitURL;
            const blobUrl = url.createObjectURL(o.data);
            console.log("blobUrl",blobUrl)
            setImageUrl(blobUrl)
        }).catch(e=>{
            // window.location.reload();
            // localStorage.clear()
        })

    }, [currentUser])
    return (
        <header className={'header'}>
            <div style={{display:"flex",justifyContent:'space-between',width:'100%'}}>
                <div className={'header-left'}>
                    <IconButton  onClick={touchMenu}>
                        <MenuIcon></MenuIcon>
                    </IconButton>
                    {/*<Breadcrumbs aria-label="breadcrumb">*/}
                    {/*    <Link underline="hover" color="inherit" href="/" to={""}>*/}
                    {/*        Danh m???c*/}
                    {/*    </Link>*/}
                    {/*    <Typography color="text.primary">T??i kho???n</Typography>*/}
                    {/*</Breadcrumbs>*/}
                </div>
                <div className={'header-right'}>
                    {/*<Tooltip title="Th??ng b??o">*/}
                    {/*    <IconButton color="primary"  component="label" style={{marginRight:'10px'}}>*/}
                    {/*        <Badge badgeContent={4}  color={'primary'}*/}
                    {/*               sx={{*/}
                    {/*            "& .MuiBadge-badge": {*/}
                    {/*                color: "white",*/}
                    {/*                backgroundColor: "#D14343"*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*        >*/}
                    {/*            <NotificationsIcon style={{ color: "#6b7280" }}></NotificationsIcon>*/}
                    {/*        </Badge>*/}
                    {/*    </IconButton>*/}
                    {/*</Tooltip>*/}
                    <Avatar
                        id={"basic-menu"}
                        alt="Avatar"
                        // src={require('../assets/img/avatar.jpg')}
                        src={imageUrl}
                        sx={{ width: 35, height: 35 }}
                        style={{cursor:'pointer'}}
                        onClick={handleClick}
                    />

                    <Menu
                        sx={{
                            "& .MuiPaper-root": {
                                left:'unset !important',
                                right:'20px'
                            }

                        }}
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
                        <MenuItem >{currentUser.name}</MenuItem>
                        {/*<MenuItem onClick={handleClose}>Logout</MenuItem>*/}
                        <MenuItem onClick={handleLogout}>????ng xu???t</MenuItem>
                    </Menu>
                </div>
            </div>

        </header>
    );
};

export default Header
