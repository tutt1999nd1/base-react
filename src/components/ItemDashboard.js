import React from "react";
import {Divider, Typography} from "@mui/material";
import {currencyFormatter} from "../constants/utils";
export default function ItemDashboard(props) {
    const {tittle,content} = props
    return (
        // <div className={'header-container'}>
        <div className={'item-dashboard'}>
            <div >
                <div className={'item-dashboard-content '}> <Typography variant={'h6'} >{currencyFormatter(content) +' VNĐ'}</Typography></div>
                <div className={'item-dashboard-tittle'}>{tittle}</div>
            </div>
        </div>
    );
};