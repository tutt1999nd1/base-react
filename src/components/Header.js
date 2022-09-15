import React, { useEffect, useState } from "react";
import {Breadcrumbs, Typography} from "@mui/material";
import Link from '@mui/material/Link';
const Header = () => {
    return (
        <header className={'header'}>
            <div className={'header-left'}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/" to={""}>
                        Danh mục
                    </Link>
                    <Typography color="text.primary">Tài khoản</Typography>
                </Breadcrumbs>
            </div>
            <div className={'header-right'}>
                <div>r</div>
                <div>r</div>
                <div>r</div>
            </div>
        </header>
    );
};

export default Header
