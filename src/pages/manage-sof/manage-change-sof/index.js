import React, {useEffect, useState} from "react";
import {Box, Button, Tab, Tabs, Typography} from "@mui/material";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {a11yProps, TabPanel} from "../../../constants/utils";
import ChangeLendingAmount from "./change-lending-amount";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ChangeInterestRate from "./change-interest_rate";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import apiManagerSOF from "../../../api/manage-sof";

export default function ManageChangeSof(props) {
    const navigate = useNavigate();
    const [info, setInfo] = useState({
        id: '',
        capital_company: {id: 0},
        capital_category: {id: 0},
        capital_campaign: {id: 0},
        supplier: {id: 0},
        lending_amount: null,
        owner_full_name: null,
        owner_user_id: null,
        lending_start_date: null,
        status: null,
        lending_in_month: null,
        interest_period: null,
        interest_rate: null,
        grace_principal_in_month: null,
        grace_interest_in_month: null,
        interest_rate_type: null,
        reference_interest_rate: null,
        interest_rate_rage: null,
        list_attachments: []
    })
    const [location, setLocation] = useSearchParams();
    const [idDetail, setIdDetail] = useState(null)
    const [tab, setTab] = React.useState(0);
    const currentUser = useSelector(state => state.currentUser)
    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };
    const backList = () => {
        navigate('/sof')
    }
    useEffect(() => {
        if (idDetail) {
            getListSOFApi({id: idDetail, page_size: 1}).then(r => {
                setInfo(r.data.source_of_funds[0])
                console.log(r.data.source_of_funds[0])
            }).catch(e => {

            })
        }
    }, [idDetail])
    useEffect(() => {
        if (location.get('id')) {
            setIdDetail(location.get('id'));
        } else navigate('/sof')

    }, [location])

    const getListSOFApi = (data) => {
        return apiManagerSOF.getListSOF(data);
    }

    return (
        <div className={'main-content change-lending-amount'}>
            <Box sx={{width: '100%'}}>
                    <Button onClick={backList} style={{marginBottom: '10px'}} variant="text"
                            startIcon={<KeyboardBackspaceIcon/>}>Nguồn vốn</Button>
                <Typography variant="h5" className={'main-content-tittle'}>
                    {/*Mã khoản vay: {info.sof_code}*/}
                    Mã khoản vay: {info.sof_code}
                </Typography>

                    <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                        <Tab label="Thay đổi tiền gốc" {...a11yProps(0)} />
                        <Tab label="Thay đổi lãi suất" {...a11yProps(1)} />
                        {/*<Tab label="Item Three" {...a11yProps(2)} />*/}
                    </Tabs>
                <TabPanel value={tab} index={0}>
                    <ChangeLendingAmount sourceOfFundId={idDetail}></ChangeLendingAmount>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                <ChangeInterestRate sourceOfFundId={idDetail}></ChangeInterestRate>
                </TabPanel>
            </Box>
        </div>
    )
}
