import React, {useEffect, useState} from "react";
import {
    Button,
    Collapse,
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {currencyFormatter} from "../../constants/utils";
import apiManagerSOF from "../../api/manage-sof";
import Axios from "axios";
import FileDownload from "js-file-download";
import {useSelector} from "react-redux";
import apiManagerChargingEst from "../../api/manage-charging-est";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {Checkbox} from "antd";
import LinkIcon from "@mui/icons-material/Link";

export default function DetailSOF(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [listCharging, setListCharging] = useState([]);
    const [idDetail, setIdDetail] = useState(null)
    const [openModalDel, setOpenModalDel] = useState(false)
    const [openDetail, setOpenDetail] = useState(false)
    const currentUser = useSelector(state => state.currentUser)
    const [idSof, setIdSof] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 10,
        rows: [],
        total: 0
    });
    const [total, setTotal] = useState({
        charging_amount: 0,
        principal: 0,
        GRACE_INTEREST: 0,
    })
    const [info, setInfo] = useState({
        id: '',
        capital_company: {id: 0},
        capital_category: {id: 0},
        capital_campaign: {id: 0},
        supplier: {id: 0},
        lending_amount: null,
        remain_lending_amount: null,
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
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const backList = () => {
        navigate('/sof')
    }
    const getInterestTableApi = (id) => {
        return apiManagerChargingEst.updateStatusPayable(id);
    }
    useEffect(() => {
        if (idDetail) {
            getListSOFApi({id: idDetail, page_size: 1}).then(r => {
                setInfo(r.data.source_of_funds[0])
                console.log(r.data.source_of_funds[0])
            }).catch(e => {

            })
            getListChargingEstApi(idDetail,{
                'paging': false,
                'sof_id': idDetail,
            }).then(r => {
                // setLoading(false)
                console.log("rrrrrrrrrrrrrr", r)


                let arr;
                if (r.data) {
                    arr = convertArr(r.data)
                } else arr = convertArr([])

                setListResult({...listResult, rows: (arr)});
            }).catch(e => {
                // setLoading(false)
                console.log(e)
            })
        }
    }, [idDetail])

    const convertArr = (arr) => {
        console.log("arr", arr)
        let total = {
            charging_amount: 0,
            INTEREST: 0, //l??i
            PRINCIPAL: 0, //g???c
            GRACE_INTEREST: 0, //??n h???n
        }
        let listConvert = [];
        for (let i = 0; i < arr.length; i++) {
            // var sorted = arr.sort(function(date1,date2){return date1.getTime() - date2.getTime()});
            // sorted
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].type_date === "Tr??? l??i ??n h???n") {
                total.GRACE_INTEREST = total.GRACE_INTEREST + arr[i].amount_paid_in_period;
            } else if (arr[i].type_date === "Tr??? l??i") {
                total.INTEREST = total.INTEREST + arr[i].amount_paid_in_period;
                console.log("INTEREST",total.INTEREST)
            } else if (arr[i].type_date === "Tr??? g???c") {
                total.PRINCIPAL = total.PRINCIPAL + arr[i].amount_paid_in_period;
            }
            let key = arr[i].company_name + arr[i].payable_date;
            if (listConvert.filter(e => e.key === key).length === 0) {
                listConvert.push({
                    key: key,
                    chargingDate: arr[i].payable_date,
                    companyName: arr[i].company_name,
                    sof: [arr[i]],
                    total: arr[i].amount_paid_in_period
                })
            } else
                for (let j = 0; j < listConvert.length; j++) {
                    if (listConvert[j].key === key) {
                        listConvert[j].sof.push(arr[i]);
                        listConvert[j].total = listConvert[j].total + arr[i].amount_paid_in_period;
                    }

                }
        }
        for (let i = 0; i < listConvert.length; i++) {
            total.charging_amount = total.charging_amount + listConvert[i].total;
            listConvert[i].total = currencyFormatter(listConvert[i].total);
            for (let j = 0; j < listConvert[i].sof.length; j++) {
                listConvert[i].sof[j].principal = currencyFormatter(listConvert[i].sof[j].amount_paid_in_period)
                listConvert[i].sof[j].charging_amount = currencyFormatter(listConvert[i].sof[j].amount_paid_in_period)
                // listConvert[i].sof[j].charging_type = listConvert[i].sof[j].charging_type === 'INTEREST' ? 'Ti???n l??i' : listConvert[i].sof[j].charging_type === 'PRINCIPAL' ? 'Ti???n g???c' : 'Ti???n l??i ??n h???n';
                listConvert[i].sof[j].charging_type = listConvert[i].sof[j].type_date;
            }
        }

        setTotal(total)

        for(let i = 0; i < listConvert.length; i++){
            let totalInterest = 0;
            let totalPrincipal = 0;
            let newArr=[]
            for (let j = 0; j <listConvert[i].sof.length; j++){
                console.log(listConvert[i].sof[j].payable_period_detail_entities.length)
                for(let k=0;k<listConvert[i].sof[j].payable_period_detail_entities.length;k++){
                    let convertData = {
                        amount_paid_in_period:listConvert[i].sof[j].payable_period_detail_entities[k].amount,
                        charging_amount:null,
                        charging_type:listConvert[i].sof[j].charging_type,
                        company_name:listConvert[i].sof[j].company_name,
                        id:listConvert[i].sof[j].id,
                        status:listConvert[i].sof[j].status,
                        principal:"",
                        sof_code:listConvert[i].sof[j].sof_code,
                        source_of_fund_id:listConvert[i].sof[j].source_of_fund_id,
                        start_date:listConvert[i].sof[j].payable_period_detail_entities[k].start_date,
                        end_date:listConvert[i].sof[j].payable_period_detail_entities[k].end_date,
                        type_date:listConvert[i].sof[j].charging_type,
                        total_day:listConvert[i].sof[j].payable_period_detail_entities[k].total_day,
                        principal_amount:listConvert[i].sof[j].payable_period_detail_entities[k].principal_amount,
                        interest_rate:listConvert[i].sof[j].payable_period_detail_entities[k].interest_rate,
                        attachment_id:listConvert[i].sof[j].payable_period_detail_entities[k].attachment_id
                    }
                    if(listConvert[i].sof[j].payable_period_detail_entities[k].attachment_entity){
                        convertData.attachment_id = listConvert[i].sof[j].payable_period_detail_entities[k].attachment_entity.id
                    }else {
                        convertData.attachment_id = null;
                    }
                    newArr.push(convertData)
                }

            }
            for(let l = 0; l < newArr.length; l++){
                if(newArr[l].charging_type == "Tr??? l??i ??n h???n" || newArr[l].charging_type == "Tr??? l??i"){
                    totalInterest += newArr[l].amount_paid_in_period;
                }else {
                    totalPrincipal += newArr[l].amount_paid_in_period;
                }
            }
            listConvert[i].totalInterest = totalInterest;
            listConvert[i].totalPrincipal = totalPrincipal;
            listConvert[i].sofConvert=newArr.reverse();


        }
        // console.log('bbbbbbbbbbbbbbbbbbbbbb')
        // console.log(listConvert)
        listConvert.sort(function(a,b){
            return new Date(convertDate(a.chargingDate)) - new Date(convertDate(b.chargingDate));
        })

        return listConvert;
    }
    const handleUpdateStatusPayable = (id) => {
        getInterestTableApi(id).then(response => {
            setRefresh(!refresh)
        })
    }
    function convertDate(myDate){
        myDate = myDate.split("-");
        var newDate = new Date( myDate[2], myDate[1] - 1, myDate[0]);
        return newDate;
    }


    useEffect(() => {
        if (location.get('id')) {
            setIdDetail(location.get('id'));
        } else navigate('/sof')

    }, [location])
    const submitDelete = () => {
        // alert("tutt20")
        deleteSOFApi(info.id).then(r => {
            toast.success('X??a th??nh c??ng', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                navigate(`/sof`)
            }, 1050);

        }).catch(e => {
            console.log(e)
        })

    }
    const getListSOFApi = (data) => {
        return apiManagerSOF.getListSOF(data);
    }
    const payablePeriodDetail = (id, startDate, endDate) => {
        navigate('/detail-est/?id='+ id+'&startDate='+startDate+'&endDate='+endDate)
    }

    const update = () => {
        navigate(`/sof/update?id=${idDetail}`)
    }
    const getListChargingEstApi = (idDetail, data) => {
        // setLoading(true)
        return apiManagerChargingEst.getPerPayablePeriod(idDetail, data);
    }
    const deleteSOFBtn = () => {
        setOpenModalDel(true)
    }
    const deleteSOFApi = (id) => {
        return apiManagerSOF.deleteSOF(id);
    }

    const downloadFile = (e) => {

        if(e.attachment_type ==='REFERENCE'){
            window.open(e.download_link, '_blank');
        }
        else {
            Axios.get(e.download_link, {
                headers: {'Authorization': `Bearer ${currentUser.token}`},
                responseType: 'blob'
            }).then(response => {
                let nameFile = response.headers['content-disposition'].split(`"`)[1]
                FileDownload(response.data, nameFile);
            }).catch(e => {
            })
        }

    }

    return (
        <div className={'main-content main-content-detail'}>
            {/*<div className={`loading ${false ? '' : ''}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
            {/*</div>*/}
            <ModalConfirmDel name={info.id + ""} openModalDel={openModalDel}
                             handleCloseModalDel={handleCloseModalDel} submitDelete={submitDelete}></ModalConfirmDel>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Button onClick={backList} style={{marginBottom: '10px'}} variant="text"
                    startIcon={<KeyboardBackspaceIcon/>}>Ngu???n v???n</Button>

            <div className={'main-content-header'}>
                <div className={'row makhoanvay'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        M?? kho???n vay: {info.sof_code}
                    </Typography>
                    <Button onClick={update} style={{marginBottom: '10px'}} variant="outlined"
                            startIcon={<BorderColorOutlinedIcon/>}>C???p nh???t</Button>

                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Th??ng tin chi ti???t</h4>
                    {openDetail ? <IconButton color="primary" style={{cursor: 'pointer'}}
                                              onClick={() => setOpenDetail(false)}>
                            <ExpandLessOutlinedIcon></ExpandLessOutlinedIcon>
                        </IconButton> :
                        <IconButton style={{cursor: 'pointer'}} color="primary"
                                    onClick={() => setOpenDetail(true)}>
                            <ExpandMoreOutlinedIcon></ExpandMoreOutlinedIcon>
                        </IconButton>
                    }
                </div>
                <Collapse in={openDetail} timeout="auto" unmountOnExit>
                    <Divider light/>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            ID
                        </div>
                        <div className={'text-info-content'}>
                            {info.id}
                        </div>
                    </div>
                    <Divider></Divider>

                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            C??ng ty vay
                        </div>
                        <div className={'text-info-content'}>
                            {info.capital_company.company_name}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            ?????i t?????ng cung c???p v???n
                        </div>
                        <div className={'text-info-content'}>
                            {info.supplier.supplier_name}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>H???ng m???c</div>
                        <div className={'text-info-content'}>
                            {info.capital_category.category_name}

                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            M???c ????ch vay
                        </div>
                        <div className={'text-info-content'}>
                            {info.capital_campaign.campaign_name}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Tr???ng th??i
                        </div>
                        <div className={'text-info-content'}>
                            {info.status == 'UNPAID' ? 'Ch??a t???t to??n' : info.status == 'PAID' ? '???? t???t to??n' : info.status === 'A_PART_PRINCIPAL_OFF' ? 'Off 1 ph???n g???c' : '???? off g???c, ch??a tr??? l??'}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>S??? ti???n vay</div>
                        <div className={'text-info-content'}>
                            {currencyFormatter(info.lending_amount)}
                        </div>
                    </div>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>S??? ti???n c??n l???i</div>
                        <div className={'text-info-content'}>
                            {currencyFormatter(info.remain_lending_amount)}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Ng?????i qu???n l??
                        </div>
                        <div className={'text-info-content'}>
                            {info.owner_full_name}
                        </div>
                    </div>
                    {/*<div className={'row-detail'}>*/}
                    {/*    <div className={'text-info-tittle'}>*/}
                    {/*        Tr???ng th??i*/}
                    {/*    </div>*/}
                    {/*    <div className={'text-info-content'}>*/}

                    {/*    </div>*/}
                    {/*</div>*/}
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Ng??y vay
                        </div>
                        <div className={'text-info-content'}>
                            {info.lending_start_date}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Th???i gian vay
                        </div>
                        <div className={'text-info-content'}>
                            {info.lending_in_month}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>S??? k??? tr??? g???c</div>
                        <div className={'text-info-content'}>
                            {info.principal_period}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            S??? k??? tr??? l??i
                        </div>
                        <div className={'text-info-content'}>
                            {info.interest_period}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            L??i su???t h???p ?????ng vay
                        </div>
                        <div className={'text-info-content'}>
                            {info.interest_rate}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>Th???i gian ??n h???n g???c</div>
                        <div className={'text-info-content'}>
                            {info.grace_principal_in_month}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Th???i gian ??n h???n l??i
                        </div>
                        <div className={'text-info-content'}>
                            {info.grace_interest_in_month}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Lo???i l??i su???t
                        </div>
                        <div className={'text-info-content'}>
                            {info.interest_rate_type}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>L??i su???t tham chi???u</div>
                        <div className={'text-info-content'}>
                            {info.reference_interest_rate}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Bi??n ????? l??i su???t
                        </div>
                        <div className={'text-info-content'}>
                            {info.interest_rate_rage}
                        </div>
                    </div>
                    <Divider></Divider>
                </Collapse>


            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>T??nh l??i</h4>
                </div>
                <Divider light/>
                <div style={{height: '500px', width: '100%'}}>
                    <TableContainer style={{height: '100%', width: '100%', overflow: "auto",position:"relative"}}>
                        {/*<div style={{height: '100%', width: '100%'}}>*/}
                        <Table stickyHeader className={"table-custom"}>
                            <TableHead>
                                <TableRow>
                                    {/*<TableCell align="center">*/}
                                    {/*    <Tooltip title={'Tr???ng th??i'}><div>Tr???ng th??i</div></Tooltip>*/}
                                    {/*</TableCell>*/}
                                    <TableCell align="center">Ng??y tr???</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'C??ng ty vay'}><div>C??ng ty vay</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'T???ng ph???i tr??? (VN??)'}><div>T???ng ph???i tr???(VN??)</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'T???ng g???c ph???i tr??? (VN??)'}><div>T???ng g???c ph???i tr???(VN??)</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'T???ng l??i ph???i tr??? (VN??)'}><div>T???ng l??i ph???i tr???(VN??)</div></Tooltip>
                                    </TableCell>
                                    {/*<TableCell align="center">*/}
                                    {/*    <Tooltip title={'M?? kho???n vay'}><div>M?? kho???n vay</div></Tooltip>*/}
                                    {/*</TableCell>*/}
                                    <TableCell align="center">
                                        <Tooltip title={'S??? ti???n ph???i tr???(VN??)'}><div>S??? ti???n ph???i tr???(VN??)</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Ki???u tr???'}><div>Ki???u tr???</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Ti???n g???c tham chi???u'}><div>Ti???n g???c tham chi???u</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'L??i su???t(%)'}><div>L??i su???t(%)</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Ng??y b???t ?????u'}><div>Ng??y b???t ?????u</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Ng??y k???t th??c'}><div>Ng??y k???t th??c</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'S??? ng??y t??nh l??i'}><div>S??? ng??y t??nh l??i</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Thao t??c'}><div>Thao t??c</div></Tooltip>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{overflowY: "auto"}}>
                                <div
                                    className={`message-table-empty ${listResult.rows.length === 0 ? '' : 'hidden'}`}>Kh??ng
                                    c?? d??? li???u
                                </div>
                                {listResult.rows.map(item => (
                                    <>
                                        <TableRow>

                                            <TableCell rowSpan={item.sofConvert.length + 1}>{item.chargingDate}</TableCell>
                                            <TableCell rowSpan={item.sofConvert.length + 1}>
                                                <div>{item.companyName}</div>
                                            </TableCell>
                                            <TableCell rowSpan={item.sofConvert.length + 1}>
                                                <div className={'error-message'}>
                                                    {item.total}
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={item.sofConvert.length + 1}>
                                                <div className={'error-message'}>
                                                    {currencyFormatter(item.totalPrincipal)}
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={item.sofConvert.length + 1}>
                                                <div className={'error-message'}>
                                                    {currencyFormatter(item.totalInterest)}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {
                                            item.sofConvert.map(detail => (

                                                <TableRow>
                                                    <TableCell>
                                                        <div className={'error-message number'}>{currencyFormatter(detail.amount_paid_in_period)}</div>
                                                        {/*<div className={'error/-message number'}>{detail.amount_paid_in_period}</div>*/}
                                                    </TableCell>
                                                    <TableCell>{detail.type_date}</TableCell>
                                                    <TableCell>
                                                        <div className={"number"}>{currencyFormatter(detail.principal_amount)}</div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div>{detail.interest_rate}</div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div>{detail.start_date}</div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div>{detail.end_date}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>{detail.type_date==="Tr??? g???c"?"-":detail.total_day}</div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className='icon-action'>
                                                            {detail.attachment_id != null &&
                                                                <Tooltip title="File thay ?????i" onClick={() => downloadFile(detail.attachment_id)}>
                                                                    <LinkIcon style={{color: "rgb(107, 114, 128)"}}></ LinkIcon>
                                                                </Tooltip>
                                                            }
                                                            {
                                                                detail.type_date=="Tr??? l??i"?<Tooltip title="Xem chi ti???t">
                                                                    <RemoveRedEyeIcon onClick={() => {
                                                                        payablePeriodDetail(detail.source_of_fund_id, detail.start_date, detail.end_date)
                                                                    }}
                                                                                      style={{color: "rgb(123, 128, 154)"}}></RemoveRedEyeIcon>
                                                                </Tooltip>:''
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }

                                    </>
                                ))}
                            </TableBody>
                        </Table>
                        {/*<TablePagination*/}
                        {/*    rowsPerPageOptions={[5, 10, 25]}*/}
                        {/*    component="div"*/}
                        {/*    count={listResult.total}*/}
                        {/*    rowsPerPage={listResult.pageSize}*/}
                        {/*    page={listResult.page}*/}
                        {/*    onPageChange={(page) => setListResult((prev) => ({...prev, page}))}*/}
                        {/*    onPageChange={handleChangePage}*/}
                        {/*    onRowsPerPageChange={handleChangeRowsPerPage}*/}
                        {/*/>*/}
                    </TableContainer>
                </div>
                <Divider></Divider>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>T??i li???u ????nh k??m</h4>
                </div>
                <Divider light/>
                {
                    info.list_attachments.map((e, i) => (
                        <div style={{cursor: "pointer"}} className={'row-detail'}
                             onClick={() => downloadFile(e)}>
                            <div className={'text-info-content text-decoration'}>
                                {e.file_name || e.download_link}
                            </div>
                        </div>
                    ))
                }

                <Divider></Divider>


            </div>

            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Qu???n l??</h4>
                </div>
                <Divider light/>
                <div style={{padding: '20px'}}>
                    <Button onClick={deleteSOFBtn} color={'error'} style={{marginBottom: '10px'}} variant="outlined">X??a
                        d??? li???u</Button>
                    <div className={'text-info-content'}>
                        Thao t??c n??y s??? x??a to??n b??? d??? li???u c???a b???n ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
