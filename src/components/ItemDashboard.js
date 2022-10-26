import React from "react";
import {Divider, Typography} from "@mui/material";
import {currencyFormatter} from "../constants/utils";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
export default function ItemDashboard(props) {
    const {tittle,content} = props
    return (
        // <div className={'header-container'}>
        <div className={'item-dashboard'}>
            <div >
                <div className={'item-dashboard-content '}> <Typography variant={'h6'} >{currencyFormatter(content) +' VNĐ'}</Typography></div>
                <div className={'item-dashboard-tittle'}>{tittle}</div>
            </div>
            <div>
                <AttachMoneyIcon  sx={{ fontSize: 35, color:"white",marginRight:'5px'}} ></AttachMoneyIcon>
            </div>
        </div>
    );
};