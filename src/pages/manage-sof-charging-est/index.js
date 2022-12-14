import React, {useEffect, useState} from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import 'bootstrap-daterangepicker/daterangepicker.css';

import {
    Autocomplete,
    Button, CircularProgress,
    Collapse,
    Divider,
    IconButton, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {convertToAutoComplete, convertToAutoCompleteMail, currencyFormatter, pending} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {useSelector} from "react-redux";
import Axios from "axios";
import API_MAP from "../../constants/api";
import FileDownload from "js-file-download";
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import apiManagerChargingEst from "../../api/manage-charging-est";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {NumericFormat} from "react-number-format";
import ItemDashboard from "../../components/ItemDashboard";

import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {Checkbox} from "antd";
import LinkIcon from "@mui/icons-material/Link";
import ModalConfirm from "../../components/ModalConfirm";

export default function ManageSofChargingEst() {
    const currentUser = useSelector(state => state.currentUser)
    const [openSearch, setOpenSearch] = useState(true)
    const [openTotal, setOpenTotal] = useState(true)
    const [loadingEmail, setLoadingEmail] = useState(false)
    const [loadingExport, setLoadingExport] = useState(false)
    const navigate = useNavigate();
    const [infoUpdate, setInfoUpdate] = useState({id: '', amount: 0})
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [openModalEmail, setOpenModalEmail] = useState(false)
    const [listUser, setListUser] = useState([{id: '1', 'label': '1'}])
    const [email, setEmail] = useState([])
    const [listUpdateEst, setListUpdateEst] = useState([])
    const [cc, setCc] = useState([])
    const [bcc, setBcc] = useState([])
    const [listId, setListId] = useState([])
    const [openModalConfirm, setOpenModalConfirm] = useState(false)

    const [total, setTotal] = useState({
        charging_amount: 0,
        principal: 0,
        GRACE_INTEREST: 0,
    })
    const [timeSearch, setTimeSearch] = useState(
        {
            start: (new dayjs).startOf('month'),
            end: (new dayjs).endOf('month'),
        }
    )
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [companySearch, setCompanySearch] = useState(0)
    const [listCompany, setListCompany] = useState([]);
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 10,
        rows: [],
        total: 0
    });
    const convertMultiToArr = (arr) => {
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            newArr.push(arr[i].label);
        }
        return newArr;
    }
    const handleCloseModalConfirm = () => {
        setOpenModalConfirm(false)
    }

    const handleCloseModalEdit = () => {
        setOpenModalEdit(false)
    }
    const handleCloseModalEmail = () => {
        setOpenModalEmail(false)
    }
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
            let newArr=[]
            let totalInterest = 0;
            let totalPrincipal = 0;
            for (let j = 0; j <listConvert[i].sof.length; j++){
                console.log(listConvert[i].sof[j].payable_period_detail_entities.length)
                for(let k=0;k<listConvert[i].sof[j].payable_period_detail_entities.length;k++){
                    let convertData = {
                        amount_paid_in_period:listConvert[i].sof[j].payable_period_detail_entities[k].amount,
                        charging_amount:null,
                        charging_type:listConvert[i].sof[j].charging_type,
                        company_name:listConvert[i].sof[j].company_name,
                        id:listConvert[i].sof[j].id,
                        id_detail:listConvert[i].sof[j].payable_period_detail_entities[k].id,
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
            listConvert[i].sofConvert=newArr;
        }
        listConvert.sort(function(a,b){
            return new Date(convertDate(a.chargingDate)) - new Date(convertDate(b.chargingDate));
        })
        console.log('listConverttttttttt')
        console.log(listConvert)
        return listConvert;
    }
    function convertDate(myDate){
        myDate = myDate.split("-");
        var newDate = new Date( myDate[2], myDate[1] - 1, myDate[0]);
        return newDate;
    }

    useEffect(() => {

        // dayjs(values.founding_date).format('DD-MM-YYYY');
        if (currentUser.token) {
            getListChargingEstApi({
                'page_size': listResult.pageSize,
                'page_index': listResult.page + 1,
                'paging': false,
                'start_date': dayjs(timeSearch.start).format('DD-MM-YYYY'),
                'end_date': dayjs(timeSearch.end).format('DD-MM-YYYY'),
                // 'charging_date_to': moment(timeSearch.end).format('DD-MM-YYYY'),
                // 'company_name': nameSearch === '' ? null : nameSearch,
                // 'contact_detail': contactSearch === 0 ? null : contactSearch,
                // 'tax_number': taxSearch === 0 ? null : taxSearch,
                'company_id': companySearch === 0 ? null : companySearch,
            }).then(r => {
                setLoading(false)
                console.log("r", r)
                let arr;
                if (r.data.payable_period_responses) {
                    arr = convertArr(r.data.payable_period_responses)
                } else arr = convertArr([])
                setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
            }).catch(e => {
                setLoading(false)
                console.log(e)
            })

        }

    }, [listResult.page, listResult.pageSize, companySearch, timeSearch, refresh, currentUser.token])

    useEffect(() => {
        getListCompanyApi({paging: false}).then(r => {
            if (r.data.companies) {
                setListCompany(convertToAutoComplete(r.data.companies, 'company_name'))
            } else {
                setListCompany([])
            }
        }).catch(e => {
            console.log(e)
        })
        Axios.get('https://graph.microsoft.com/v1.0/users?$top=999', {
            headers: {'Authorization': `Bearer ${currentUser.tokenGraphApi}`},
            // responseType: 'blob'
        }).then(users => {
            console.log('users.value', users.data.value)
            let arrConvert = convertToAutoCompleteMail(users.data.value, 'mail')
            setListUser(arrConvert)
        }).catch(e => {
            // window.location.reload();
            localStorage.clear()
        })
    }, [currentUser.token])
    useEffect(() => {
        // console.log(listResult)
    }, [listResult])
    const handleChangeDateRange = (event, picker) => {
        setTimeSearch({start: picker.startDate, end: picker.endDate})
    }
    const updateChargingEstBtn = (id, amount) => {
        setInfoUpdate({id: id, amount: amount})
        setOpenModalEdit(true)
    }
    const sendEmail = () => {
        sendEmailApi({
            'list_email_to': email,
            'list_email_cc': cc,
            'list_email_bcc': bcc,
            'page_size': listResult.pageSize,
            'page_index': listResult.page + 1,
            'paging': false,
            'start_date': dayjs(timeSearch.start).format('DD-MM-YYYY'),
            'end_date': dayjs(timeSearch.end).format('DD-MM-YYYY'),
            // 'company_name': nameSearch === '' ? null : nameSearch,
            // 'contact_detail': contactSearch === 0 ? null : contactSearch,
            // 'tax_number': taxSearch === 0 ? null : taxSearch,
            'company_id': companySearch === 0 ? null : companySearch,
        }).then(r => {
            setLoadingEmail(false)
            toast.success('G???i b??o c??o th??nh c??ng, vui l??ng ki???m tra email.', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setOpenModalEmail(false)
            console.log(r)
        }).catch(err => {
            setLoadingEmail(false)
            console.log(err)
            setOpenModalEmail(false)
        })
    }
    const submitUpdate = () => {
        updateChargingEstApi(infoUpdate.id, {charging_amount: infoUpdate.amount}).then(r => {
            toast.success('C???p nh???t th??nh c??ng', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            handleCloseModalEdit();
            setRefresh(!refresh)
        }).catch(e => {
            handleCloseModalEdit();
            console.log(e)
        })
    }

    const exportChargingEst = () => {
        setLoadingExport(true)
        Axios.post(API_MAP.EXPORT_CHARGING_EST, {
            'page_size': listResult.pageSize,
            'page_index': listResult.page + 1,
            'paging': false,
            'start_date': dayjs(timeSearch.start).format('DD-MM-YYYY'),
            'end_date': dayjs(timeSearch.end).format('DD-MM-YYYY'),
            // 'company_name': nameSearch === '' ? null : nameSearch,
            // 'contact_detail': contactSearch === 0 ? null : contactSearch,
            // 'tax_number': taxSearch === 0 ? null : taxSearch,
            'company_id': companySearch === 0 ? null : companySearch,
        }, {
            headers: {'Authorization': `Bearer ${currentUser.token}`},
            responseType: 'blob'
        }).then(response => {
            setLoadingExport(false)
            let nameFile = response.headers['content-disposition'].split(`"`)[1]
            FileDownload(response.data, nameFile);

        }).catch(e => {
            setLoadingExport(false)
        })
    }
    const handleUpdateStatusPayable = (e,i,j,id,idDetail) => {
        let listUpdate = [...listUpdateEst];
        let ob = {id:id,idDetail:idDetail,status:e.target.checked};
        if(!checkExist(listUpdate,ob)){
            listUpdate.push(ob);
            console.log("exist")
        }
        else{
            listUpdate = listUpdate.filter(x => x.id != ob.id && x.idDetail !=ob.idDetail)
        }
        let listId = [];
        let group = listUpdate.reduce(function (r, a) {
                r[a.id] = r[a.id] || [];
                r[a.id].push(a);
                return r;
            }, Object.create(null));
        console.log("group",group);
        for (const property in group) {
            let check = true;
            for(let j = 0; j < group[property].length; j++){
                console.log("group[property]",group[property][j])
                console.log("group[property].length",group[property].length)
                if(j!=group[property].length-1)
                if(group[property][j].status !=group[property][j+1].status){
                    check = false;
                    break;
                }
            }
            if(check){
                listId.push(group[property][0].id);
            }
        }

        setListId(listId);
        for( let i = 0; i < group.length; i++){
            let check = true;
            for(let j = 0; j < group[i].length; j++){
                if(group[i][j].status !=group[i][j+1].status){
                    check = false;
                    break;
                }
            }
            if(check){
                listId.push(group[0].id);
            }
        }
        console.log("list ID ",listId)
        setListUpdateEst(listUpdate)
        let listResultCopy = {...listResult};

        if(e.target.checked){
            listResultCopy.rows[i].sofConvert[j].status = "paid"
        }
        else listResultCopy.rows[i].sofConvert[j].status = "unpaid"

        setListResult(listResultCopy)


    }
    const submitUpdateEst = () => {
        updateEstApi({list_id:listId}).then(response => {
            toast.success('C???p nh???t th??nh c??ng', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
          setRefresh(!refresh);
          setListUpdateEst([]);
          setListId([]);
          handleCloseModalConfirm();
        })
    }
    const checkExist = (arr,ob) => {
        for (let i = 0; i < arr.length; i++){
            if(ob.id == arr[i].id && ob.idDetail == arr[i].idDetail){
                return true;
            }
        }
        return false;
    }
    const sendEmailBtn = () => {
        setOpenModalEmail(true)
    }
    const redirectToSof = (id) => {
        navigate('/sof/detail?id=' + id)
    }
    const payablePeriodDetail = (id, startDate, endDate) => {
        navigate('/detail-est/?id='+ id+'&startDate='+startDate+'&endDate='+endDate)
    }
    const sendEmailApi = (data) => {
        setLoadingEmail(true)
        return apiManagerChargingEst.sendEmailChargingEst(data);
    }

    const getListCompanyApi = (data) => {
        return apiManagerCompany.getListCompany(data);
    }
    const importCompanyApi = (data) => {
        return apiManagerCompany.importCompany(data);
    }
    const getListChargingEstApi = (data) => {
        setLoading(true)
        return apiManagerChargingEst.getListChargingEst(data);
    }
    const updateEstApi = (id) => {
        return apiManagerChargingEst.updateStatusPayable(id);
    }
    const updateChargingEstApi = (id, data) => {
        return apiManagerChargingEst.updateChargingEst(id, data);
    }
    const downloadFile = (id) => {
        if(id){
            Axios.get(API_MAP.LINK_FILE+id, {
                headers: {'Authorization': `Bearer ${currentUser.token}`},
                responseType: 'blob'
            }).then(response => {
                let nameFile = response.headers['content-disposition'].split(`"`)[1]
                FileDownload(response.data, nameFile);
            }).catch(e => {
            })
        }
        // return apiManagerSOF.downloadFile(id);
    }

    return (
        <div className={'main-content'}>
            {/*<div className={`loading ${loading ? '' : 'hidden'}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
            {/*</div>*/}
            <ModalConfirm open={openModalConfirm}
                          handleCloseModal={handleCloseModalConfirm}
                          submit={submitUpdateEst}></ModalConfirm>
            <Dialog open={openModalEdit} onClose={handleCloseModalEdit}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        C???p nh???t
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalEdit}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{width: '450px', height: '75px'}} dividers className={"model-project"}>
                    <div className="form-input">
                        <div className={'label-input'}>S??? ti???n ph???i tr???(VN??)<span
                            className={'error-message'}>*</span></div>
                        <NumericFormat
                            size={'small'}
                            customInput={TextField}
                            className={'formik-input'}
                            // variant="standard"
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            value={infoUpdate.amount}
                            onValueChange={(value) => {
                                const {floatValue} = value;
                                setInfoUpdate({...infoUpdate, amount: floatValue})
                                // setFieldValue('max_capital_value', formattedValue)
                            }}

                        />

                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseModalEdit}>
                        H???y
                    </Button>
                    {/*{*/}
                    {/*    !(valueInput.trim() ==(name?name.trim():name)) ?   <Button disabled={true} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>X??a</Button>*/}
                    {/*    :*/}
                    {/*        <Button  onClick={submit} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>X??a</Button>*/}
                    {/*}*/}
                    <Button
                        onClick={submitUpdate}
                        variant={'contained'} color={"primary"}>C???p nh???t</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openModalEmail} onClose={handleCloseModalEmail}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Nh???n b??o c??o v??? email
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalEmail}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{width: '550px', height: '300px'}} dividers className={"model-project"}>
                    <div className="form-input">
                        <div className={'label-input'}>Email<span className={'error-message'}>*</span></div>
                        <Stack spacing={3}>
                            <Autocomplete
                                multiple
                                options={listUser}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                    />
                                )}

                                onChange={(event, newValue) => {
                                    console.log("newValue", newValue);
                                    setEmail(convertMultiToArr(newValue));
                                }}

                            />
                        </Stack>

                    </div>
                    <div className="form-input">
                        <div className={'label-input'}>CC</div>
                        <Stack spacing={3}>
                            <Autocomplete
                                multiple
                                options={listUser}
                                // getOptionLabel={(option) => option.title}
                                // defaultValue={[top5Songs[2]]}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                    />
                                )}

                                onChange={(event, newValue) => {
                                    console.log("newValue", newValue);
                                    setCc(convertMultiToArr(newValue));
                                }}

                            />
                        </Stack>

                    </div>
                    <div className="form-input">
                        <div className={'label-input'}>BCC</div>
                        <Stack spacing={3}>
                            <Autocomplete
                                multiple
                                options={listUser}
                                // getOptionLabel={(option) => option.title}
                                // defaultValue={[top5Songs[2]]}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                    />
                                )}

                                onChange={(event, newValue) => {
                                    console.log("newValue", newValue);
                                    setBcc(convertMultiToArr(newValue));
                                }}

                            />
                        </Stack>

                    </div>


                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseModalEmail}>
                        H???y
                    </Button>
                    {/*{*/}
                    {/*    !(valueInput.trim() ==(name?name.trim():name)) ?   <Button disabled={true} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>X??a</Button>*/}
                    {/*    :*/}
                    {/*        <Button  onClick={submit} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>X??a</Button>*/}
                    {/*}*/}
                    {
                        loadingEmail ? <CircularProgress size={30}></CircularProgress> :
                            <Button
                                onClick={sendEmail}
                                variant={'contained'} disabled={email.length === 0} color={"primary"}>G???i</Button>
                    }

                </DialogActions>
            </Dialog>

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
            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        T??nh l??i
                    </Typography>
                    <div>

                        {
                            loadingExport ? <CircularProgress size={30}></CircularProgress> :
                                <Button onClick={exportChargingEst} style={{marginLeft: '10px', marginRight: '10px'}}
                                        variant="text"
                                        startIcon={<VerticalAlignBottomIcon/>}>Xu???t</Button>
                        }

                        <Button onClick={sendEmailBtn} variant="text" startIcon={<ForwardToInboxIcon/>}>G???i th???ng k?? v???
                            email</Button>
                    </div>
                </div>
                <div className={'main-content-body calculate-interest-body'}>
                    <div className={'main-content-body-tittle'}>
                        <h4>Th???ng k??</h4>
                        {openTotal ? <IconButton color="primary" style={{cursor: 'pointer'}}
                                                 onClick={() => setOpenTotal(false)}>
                                <ExpandLessOutlinedIcon></ExpandLessOutlinedIcon>
                            </IconButton> :
                            <IconButton style={{cursor: 'pointer'}} color="primary"
                                        onClick={() => setOpenTotal(true)}>
                                <ExpandMoreOutlinedIcon></ExpandMoreOutlinedIcon>
                            </IconButton>
                        }
                    </div>
                    <Divider light/>
                    <Collapse in={openTotal} timeout="auto" unmountOnExit>
                        <div className={'row'} style={{padding: '0 50px 50px 50px', justifyContent: "space-between"}}>
                            <ItemDashboard tittle={'T???ng ti???n ph??i tr???'}
                                           content={total.charging_amount}></ItemDashboard>
                            <ItemDashboard tittle={'T???ng ti???n g???c'} content={total.PRINCIPAL}></ItemDashboard>
                            <ItemDashboard tittle={'T???ng ti???n l??i'} content={total.INTEREST}></ItemDashboard>
                            <ItemDashboard tittle={'T???ng ti???n l??i ??n h???n'}
                                           content={total.GRACE_INTEREST}></ItemDashboard>
                        </div>
                    </Collapse>


                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>T??m ki???m</h4>
                    {openSearch ? <IconButton color="primary" style={{cursor: 'pointer'}}
                                              onClick={() => setOpenSearch(false)}>
                            <ExpandLessOutlinedIcon></ExpandLessOutlinedIcon>
                        </IconButton> :
                        <IconButton style={{cursor: 'pointer'}} color="primary"
                                    onClick={() => setOpenSearch(true)}>
                            <ExpandMoreOutlinedIcon></ExpandMoreOutlinedIcon>
                        </IconButton>
                    }

                </div>
                <Divider light/>
                <Collapse in={openSearch} timeout="auto" unmountOnExit>
                    <div className={'main-content-body-search'}>
                        <div style={{width: '20%'}}>
                            <div className={'label-input'}>C??ng ty vay</div>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={listCompany}
                                // sx={{ width: 300 }}
                                // onChange={}
                                renderInput={(params) => < TextField {...params} placeholder="C??ng ty vay"/>}
                                size={"small"}
                                onChange={(event, newValue) => {
                                    console.log("new_value", newValue)
                                    if (newValue)
                                        setCompanySearch(newValue.id)
                                    else setCompanySearch(null)
                                }}
                            />
                        </div>
                        <div style={{marginLeft: '20px', width: '30%'}}>
                            <div className={'label-input'}>Kho???ng th???i gian</div>
                            <div className={''} style={{display: "flex", alignItems: "center"}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        style={{height: '30px'}}
                                        inputFormat="DD-MM-YYYY"
                                        value={timeSearch.start}
                                        onChange={(values) => {
                                            console.log(values)
                                            setTimeSearch({...timeSearch, start: values})
                                        }}
                                        renderInput={(params) => <TextField size={"small"}  {...params} />}
                                    />
                                </LocalizationProvider>
                                <div style={{margin: '0 5px'}}>?????n</div>
                                <LocalizationProvider style={{width: '50px !important', height: '30px'}}
                                                      dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        style={{width: '50px !important', height: '30px'}}
                                        inputFormat="DD-MM-YYYY"
                                        value={timeSearch.end}
                                        onChange={(values) => {
                                            console.log(values)
                                            setTimeSearch({...timeSearch, end: values})
                                        }}
                                        // onChange={value => props.setFieldValue("founding_date", value)}
                                        renderInput={(params) => <TextField size={"small"}  {...params} />}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>


                    </div>

                </Collapse>
                <Divider light/>
                <div className={'main-content-body-result'} style={{position: "relative"}}>
                    <Tooltip title="Danh s??ch ???? ch???n">
                        <Button className={`${listUpdateEst.length>0 ?'':'hidden'}`} style={{float:"right",margin:"10px"}} onClick={()=>{setOpenModalConfirm(true)}} variant={"outlined"}  color={"primary"}>C???p nh???t tr???ng th??i</Button>
                    </Tooltip>
                    <TableContainer style={{height: '100%', width: '100%', overflow: "auto"}}>
                        {/*<div style={{height: '100%', width: '100%'}}>*/}
                        <Table stickyHeader className={"table-custom"}>
                            <TableHead>
                                <TableRow>

                                    <TableCell align="center">Ng??y tr???</TableCell>
                                    <TableCell align="center">C??ng ty vay</TableCell>
                                    <TableCell align="center">T???ng ph???i tr???(VN??)</TableCell>
                                    <TableCell align="center">T???ng g???c ph???i tr???(VN??)</TableCell>
                                    <TableCell align="center">T???ng l??i ph???i tr???(VN??)</TableCell>
                                    {/*<TableCell align="center">M?? kho???n vay</TableCell>*/}
                                    <TableCell align="center">S??? ti???n ph???i tr???(VN??)</TableCell>
                                    <TableCell align="center">Ki???u tr???</TableCell>
                                    <TableCell align="center">Ti???n g???c tham chi???u</TableCell>
                                    <TableCell align="center">L??i su???t(%)</TableCell>
                                    <TableCell align="center">Ng??y b???t ?????u</TableCell>
                                    <TableCell align="center">Ng??y k???t th??c</TableCell>
                                    <TableCell align="center">S??? ng??y t??nh l??i </TableCell>
                                    <TableCell align="center">Tr???ng th??i</TableCell>
                                    <TableCell align="center">Thao t??c</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{overflowY: "auto"}}>
                                <div className={`message-table-empty ${loading?'':'hidden'}`} >
                                    <CircularProgress size={30}></CircularProgress>
                                </div>
                                <div
                                    className={`message-table-empty ${listResult.rows.length === 0 && !loading ? '' : 'hidden'}`}>Kh??ng
                                    c?? d??? li???u
                                </div>
                                {listResult.rows.map((item,i) => (

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
                                            item.sofConvert.map((detail, j) => (
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
                                                        <TableCell >
                                                            <div className='icon-action'>
                                                                {
                                                                    // detail.type_date=="Tr??? l??i"?<Checkbox
                                                                    //     checked={detail.status==="paid"}
                                                                    //     onChange={()=>handleUpdateStatusPayable(detail.id)}
                                                                    //     inputProps={{ 'aria-label': 'controlled' }}
                                                                    // />:'-'

                                                                    <Checkbox
                                                                        checked={detail.status==="paid"}
                                                                        onChange={(e)=>handleUpdateStatusPayable(e,i,j,detail.id,detail.id_detail)}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                    />
                                                                }

                                                        </div>
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
                                        <TableRow>

                                            </TableRow>

                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                </div>
            </div>
        </div>
    )
}

