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

                // let newR = [];
                // for(let i = 0; i < r.data.length; i++){
                //     let newConvertData = {
                //         amount_paid_in_period: r.data[i].amount_paid_in_period,
                //         charging_amount: r.data[i].amount_paid_in_period,
                //         charging_type: r.data[i].amount_paid_in_period,
                //         company_name: r.data[i].amount_paid_in_period,
                //         create_at: r.data[i].amount_paid_in_period,
                //         id: r.data[i].amount_paid_in_period,
                //         interest_period: r.data[i].amount_paid_in_period,
                //         interest_rate: r.data[i].amount_paid_in_period,
                //         interest_rate_rage: r.data[i].amount_paid_in_period,
                //         interest_rate_type: r.data[i].amount_paid_in_period,
                //         modify_at: r.data[i].amount_paid_in_period,
                //       //  payable_date: r.data[i].amount_paid_in_period,
                //         payable_period_detail_entities: r.data[i].amount_paid_in_period,
                //         principal: r.data[i].amount_paid_in_period,
                //         principal_period: r.data[i].amount_paid_in_period,
                //         reference_interest_rate: r.data[i].amount_paid_in_period,
                //         sof_code: r.data[i].amount_paid_in_period,
                //         source_of_fund_id: r.data[i].amount_paid_in_period,
                //     //    start_date: r.data[i].amount_paid_in_period,
                //         status: r.data[i].amount_paid_in_period,
                //         type_date: r.data[i].amount_paid_in_period,
                //     }
                // }


                let arr;
                if (r.data) {
                    arr = convertArr(r.data)
                } else arr = convertArr([])

                console.log('ffffffffffffffffffffffff');
                console.log(arr);


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
            INTEREST: 0, //lãi
            PRINCIPAL: 0, //gốc
            GRACE_INTEREST: 0, //ân hạn
        }
        let listConvert = [];
        for (let i = 0; i < arr.length; i++) {
            // var sorted = arr.sort(function(date1,date2){return date1.getTime() - date2.getTime()});
            // sorted
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].type_date === "Trả lãi ân hạn") {
                total.GRACE_INTEREST = total.GRACE_INTEREST + arr[i].amount_paid_in_period;
            } else if (arr[i].type_date === "Trả lãi") {
                total.INTEREST = total.INTEREST + arr[i].amount_paid_in_period;
                console.log("INTEREST",total.INTEREST)
            } else if (arr[i].type_date === "Trả gốc") {
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
                // listConvert[i].sof[j].charging_type = listConvert[i].sof[j].charging_type === 'INTEREST' ? 'Tiền lãi' : listConvert[i].sof[j].charging_type === 'PRINCIPAL' ? 'Tiền gốc' : 'Tiền lãi ân hạn';
                listConvert[i].sof[j].charging_type = listConvert[i].sof[j].type_date;
            }
        }
        console.log("total",total);
        console.log("list_convert",listConvert);
        setTotal(total)
        for(let i = 0; i < listConvert.length; i++){
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
                        interest_rate:listConvert[i].sof[j].payable_period_detail_entities[k].interest_rate
                    }
                    newArr.push(convertData)
                }
            }
            listConvert[i].sofConvert=newArr;

        }
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
            toast.success('Xóa thành công', {
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
                    startIcon={<KeyboardBackspaceIcon/>}>Nguồn vốn</Button>

            <div className={'main-content-header'}>
                <div className={'row makhoanvay'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Mã khoản vay: {info.sof_code}
                    </Typography>
                    <Button onClick={update} style={{marginBottom: '10px'}} variant="outlined"
                            startIcon={<BorderColorOutlinedIcon/>}>Cập nhật</Button>

                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Thông tin chi tiết</h4>
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
                            Công ty vay
                        </div>
                        <div className={'text-info-content'}>
                            {info.capital_company.company_name}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Đối tượng cung cấp vốn
                        </div>
                        <div className={'text-info-content'}>
                            {info.supplier.supplier_name}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>Hạng mục</div>
                        <div className={'text-info-content'}>
                            {info.capital_category.category_name}

                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Mục đích vay
                        </div>
                        <div className={'text-info-content'}>
                            {info.capital_campaign.campaign_name}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Trạng thái
                        </div>
                        <div className={'text-info-content'}>
                            {info.status == 'UNPAID' ? 'Chưa tất toán' : info.status == 'PAID' ? 'Đã tất toán' : info.status === 'A_PART_PRINCIPAL_OFF' ? 'Off 1 phần gốc' : 'Đã off gốc, chưa trả lã'}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>Số tiền vay</div>
                        <div className={'text-info-content'}>
                            {currencyFormatter(info.lending_amount)}
                        </div>
                    </div>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>Số tiền còn lại</div>
                        <div className={'text-info-content'}>
                            {currencyFormatter(info.remain_lending_amount)}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Người quản lý
                        </div>
                        <div className={'text-info-content'}>
                            {info.owner_full_name}
                        </div>
                    </div>
                    {/*<div className={'row-detail'}>*/}
                    {/*    <div className={'text-info-tittle'}>*/}
                    {/*        Trạng thái*/}
                    {/*    </div>*/}
                    {/*    <div className={'text-info-content'}>*/}

                    {/*    </div>*/}
                    {/*</div>*/}
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Ngày vay
                        </div>
                        <div className={'text-info-content'}>
                            {info.lending_start_date}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Thời gian vay
                        </div>
                        <div className={'text-info-content'}>
                            {info.lending_in_month}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>Số kỳ trả gốc</div>
                        <div className={'text-info-content'}>
                            {info.principal_period}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Số kỳ trả lãi
                        </div>
                        <div className={'text-info-content'}>
                            {info.interest_period}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Lãi suất hợp đồng vay
                        </div>
                        <div className={'text-info-content'}>
                            {info.interest_rate}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>Thời gian ân hạn gốc</div>
                        <div className={'text-info-content'}>
                            {info.grace_principal_in_month}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Thời gian ân hạn lãi
                        </div>
                        <div className={'text-info-content'}>
                            {info.grace_interest_in_month}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Loại lãi suất
                        </div>
                        <div className={'text-info-content'}>
                            {info.interest_rate_type}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>Lãi suất tham chiếu</div>
                        <div className={'text-info-content'}>
                            {info.reference_interest_rate}
                        </div>
                    </div>
                    <Divider></Divider>
                    <div className={'row-detail'}>
                        <div className={'text-info-tittle'}>
                            Biên độ lãi suất
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
                    <h4>Tính lãi</h4>
                </div>
                <Divider light/>
                <div style={{height: '500px', width: '100%'}}>
                    <TableContainer style={{height: '100%', width: '100%', overflow: "auto"}}>
                        {/*<div style={{height: '100%', width: '100%'}}>*/}
                        <Table stickyHeader className={"table-custom"}>
                            <TableHead>
                                <TableRow>
                                    {/*<TableCell align="center">*/}
                                    {/*    <Tooltip title={'Trạng thái'}><div>Trạng thái</div></Tooltip>*/}
                                    {/*</TableCell>*/}
                                    <TableCell align="center">Ngày trả</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Công ty vay'}><div>Công ty vay</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Tổng phải trả (VNĐ)'}><div>Tổng phải trả(VNĐ)</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Mã khoản vay'}><div>Mã khoản vay</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Số tiền phải trả(VNĐ)'}><div>Số tiền phải trả(VNĐ)</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Tiền gốc tham chiếu'}><div>Tiền gốc tham chiếu</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Lãi suất(%)'}><div>Lãi suất(%)</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Kiểu trả'}><div>Kiểu trả</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Ngày bắt đầu'}><div>Ngày bắt đầu</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Ngày kết thúc'}><div>Ngày kết thúc</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Số ngày tính lãi'}><div>Số ngày tính lãi</div></Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={'Thao tác'}><div>Thao tác</div></Tooltip>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{overflowY: "auto"}}>
                                <div
                                    className={`message-table-empty ${listResult.rows.length === 0 ? '' : 'hidden'}`}>Không
                                    có dữ liệu
                                </div>
                                {listResult.rows.map(item => (
                                    <>
                                        <TableRow>
                                            {/*<TableCell rowSpan={item.sofConvert.length + 1}>*/}
                                            {/*    <div className='icon-action'>*/}
                                            {/*        {*/}
                                            {/*            <Checkbox*/}
                                            {/*                checked={item.status==="paid"}*/}
                                            {/*                onChange={()=>handleUpdateStatusPayable(item.id)}*/}
                                            {/*                inputProps={{ 'aria-label': 'controlled' }}*/}
                                            {/*            />*/}
                                            {/*        }*/}

                                            {/*    </div>*/}
                                            {/*</TableCell>*/}
                                            <TableCell rowSpan={item.sofConvert.length + 1}>{item.chargingDate}</TableCell>
                                            <TableCell rowSpan={item.sofConvert.length + 1}>
                                                <div>{item.companyName}</div>
                                            </TableCell>
                                            <TableCell rowSpan={item.sofConvert.length + 1}>
                                                <div className={'error-message'}>
                                                    {item.total}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {
                                            item.sofConvert.map(detail => (

                                                <TableRow>
                                                    <TableCell>
                                                        <div>{detail.sof_code}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className={'error-message number'}>{currencyFormatter(detail.amount_paid_in_period)}</div>
                                                        {/*<div className={'error/-message number'}>{detail.amount_paid_in_period}</div>*/}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className={"number"}>{currencyFormatter(detail.principal_amount)}</div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div>{detail.interest_rate}</div>
                                                    </TableCell>
                                                    <TableCell>{detail.type_date}</TableCell>

                                                    <TableCell>
                                                        <div>{detail.start_date}</div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div>{detail.end_date}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>{detail.type_date==="Trả gốc"?"-":detail.total_day}</div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className='icon-action'>
                                                            {
                                                                detail.type_date=="Trả lãi"?<Tooltip title="Xem chi tiết">
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
                    <h4>Tài liệu đính kèm</h4>
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
                    <h4>Quản lý</h4>
                </div>
                <Divider light/>
                <div style={{padding: '20px'}}>
                    <Button onClick={deleteSOFBtn} color={'error'} style={{marginBottom: '10px'}} variant="outlined">Xóa
                        dữ liệu</Button>
                    <div className={'text-info-content'}>
                        Thao tác này sẽ xóa toàn bộ dữ liệu của bản ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
