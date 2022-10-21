import React, {useEffect, useState} from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import 'bootstrap-daterangepicker/daterangepicker.css';

import {
    Autocomplete,
    Button,
    Collapse,
    Divider,
    IconButton, InputAdornment,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import {toast, ToastContainer} from "react-toastify";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import {convertToAutoComplete, currencyFormatter, pending} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {useSelector} from "react-redux";
import Axios from "axios";
import API_MAP from "../../constants/api";
import FileDownload from "js-file-download";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import apiManagerChargingEst from "../../api/manage-charging-est";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {NumericFormat} from "react-number-format";

export default function ManageSofChargingEst() {
    const currentUser = useSelector(state => state.currentUser)
    const [openSearch, setOpenSearch] = useState(true)
    const navigate = useNavigate();
    const [infoUpdate,setInfoUpdate] = useState({id:'',amount:0})
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [timeSearch, setTimeSearch] = useState(
        {
            start: moment().startOf('day').toDate(),
            end: moment().endOf('day').add(120, 'hour').toDate()
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

    const handleChangePage = (event: unknown, page: number) => {
        setListResult((prev) => ({...prev, page}))
    };

    const handleChangeRowsPerPage = (event) => {
        let pageSize = parseInt(event.target.value, 10);
        setListResult((prev) => ({...prev, pageSize}))

    };
    const redirectAddPage = () => {
        navigate('/company/create')
    }
    const handleCloseModalEdit = () => {
        setOpenModalEdit(false)
    }
    const convertArr = (arr) => {

        let listConvert = [];
        for (let i = 0; i < arr.length; i++) {
            let key = arr[i].company.company_name+arr[i].charging_date;
            if (listConvert.filter(e => e.key === key).length === 0) {
                listConvert.push({
                    key: key,
                    chargingDate:arr[i].charging_date ,
                    companyName:arr[i].company.company_name,
                    sof: [arr[i]],
                    total:arr[i].charging_amount
                })
            } else
                for (let j = 0; j < listConvert.length; j++) {
                    if (listConvert[j].key === key) {
                        listConvert[j].sof.push(arr[i]);
                        listConvert[j].total = listConvert[j].total+arr[i].charging_amount;
                    }

                }
        }
        console.log("listConvert", listConvert)
        for (let i = 0; i < listConvert.length; i++) {
            listConvert[i].total = currencyFormatter(listConvert[i].total);
            for (let j = 0; j < listConvert[i].sof.length; j++) {
                listConvert[i].sof[j].principal = currencyFormatter(listConvert[i].sof[j].principal)
                listConvert[i].sof[j].charging_amount = currencyFormatter(listConvert[i].sof[j].charging_amount)
                listConvert[i].sof[j].charging_type = listConvert[i].sof[j].charging_type==='INTEREST'?'Tiền lãi':listConvert[i].sof[j].charging_type==='PRINCIPAL'?'Tiền gốc':'Tiền lãi ân hạn';
            }
        }
        return listConvert;
    }

    useEffect(() => {
        if (currentUser.token) {
            getListChargingEstApi({
                'page_size': listResult.pageSize,
                'page_index': listResult.page + 1,
                'paging': false,
                // 'charging_date_from':moment(timeSearch.start).format('DD-MM-YYYY'),
                // 'charging_date_to':moment(timeSearch.end).format('DD-MM-YYYY'),
                // 'company_name': nameSearch === '' ? null : nameSearch,
                // 'contact_detail': contactSearch === 0 ? null : contactSearch,
                // 'tax_number': taxSearch === 0 ? null : taxSearch,
                'capital_company_id': companySearch === 0 ? null : companySearch,
            }).then(r => {
                setLoading(false)
                console.log("r", r)
                let arr;
                if(r.data.sof_charging_ests){
                    arr = convertArr(r.data.sof_charging_ests)
                }
                else arr = []
                setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
            }).catch(e => {
                setLoading(false)
                console.log(e)
            })
        }

    }, [listResult.page, listResult.pageSize,companySearch,timeSearch, refresh, currentUser.token])
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
    },[currentUser.token])
    useEffect(() => {
        console.log(listResult)
    },[listResult])
    const handleChangeDateRange = (event, picker) => {
        setTimeSearch({ start: picker.startDate, end: picker.endDate })
    }
    const updateChargingEstBtn = (id,amount) => {
        setInfoUpdate({id:id,amount:amount})
        setOpenModalEdit(true)
    }
    const submitUpdate = ()=>{

        updateChargingEstApi(infoUpdate.id,{charging_amount:infoUpdate.amount}).then(r=>{
            toast.success('Cập nhật thành công', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            handleCloseModalEdit();
            setRefresh(!refresh)
        }).catch(e=>{
            handleCloseModalEdit();
            toast.error('Có lỗi xảy ra', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        })
    }

    const uploadFile = () => {
        var el = window._protected_reference = document.createElement("INPUT");
        el.type = "file";
        el.accept = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
        // el.multiple = "multiple";
        el.addEventListener('change', function (ev2) {

            new Promise(function (resolve) {
                setTimeout(function () {
                    if (el.files.length > 0) {
                        console.log(el.files);
                        let formData = new FormData();
                        formData.append('file', el.files[0])
                        importCompanyApi(formData).then(r => {
                            console.log(r);
                            toast.success('Nhập dữ liệu thành công', {
                                position: "top-right",
                                autoClose: 1500,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                            setRefresh(!refresh)

                        }).catch(err => {
                            toast.error('Có lỗi xảy ra', {
                                position: "top-right",
                                autoClose: 1500,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                        })
                    }
                    resolve();

                }, 1000);


            })
                .then(function () {
                    // clear / free reference
                    el = window._protected_reference = undefined;
                });
        });

        el.click();
    }
    const downTemplate = () => {
        Axios.get(API_MAP.DOWN_TEMPLATE_COMPANY, {
            headers: {'Authorization': `Bearer ${currentUser.token}`},
            responseType: 'blob'
        }).then(response => {
            let nameFile = response.headers['content-disposition'].split(`"`)[1]
            FileDownload(response.data, nameFile);

        }).catch(e => {
        })
    }
    const redirectToSof = (id) => {
      navigate('/sof/detail?id=' + id)
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
    const updateChargingEstApi = (id,data) => {
        return apiManagerChargingEst.updateChargingEst(id,data);
    }

    return (
        <div className={'main-content'}>
            {/*<div className={`loading ${loading ? '' : 'hidden'}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
            {/*</div>*/}
            <Dialog  open={openModalEdit} onClose={handleCloseModalEdit}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Cập nhật
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
                <DialogContent style={{width:'450px',height:'75px'}}  dividers className={"model-project"}>
                    <div className="form-input">
                        <div className={'label-input'}>Số tiền phải trả(VNĐ)<span
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
                                const { floatValue} = value;
                                setInfoUpdate({...infoUpdate,amount:floatValue})
                                // setFieldValue('max_capital_value', formattedValue)
                            }}

                        />

                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined"  onClick={handleCloseModalEdit}>
                        Hủy
                    </Button>
                    {/*{*/}
                    {/*    !(valueInput.trim() ==(name?name.trim():name)) ?   <Button disabled={true} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>Xóa</Button>*/}
                    {/*    :*/}
                    {/*        <Button  onClick={submit} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>Xóa</Button>*/}
                    {/*}*/}
                    <Button
                            onClick={submitUpdate}
                             variant={'contained'} color={"primary"}>Cập nhật</Button>
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
                        Tính lãi
                    </Typography>
                    <div>
                        <Tooltip title={'Tải file mẫu'}>
                            <IconButton style={{cursor: 'pointer'}} color="primary"
                                        onClick={downTemplate}>
                                <SimCardDownloadIcon></SimCardDownloadIcon>
                            </IconButton>
                        </Tooltip>
                        <Button onClick={uploadFile} variant="text" startIcon={<VerticalAlignTopIcon/>}>Nhập</Button>
                        <Button onClick={pending} style={{marginLeft: '10px', marginRight: '10px'}} variant="text"
                                startIcon={<VerticalAlignBottomIcon/>}>Xuất</Button>
                        <Button onClick={redirectAddPage} variant="outlined" startIcon={<AddIcon/>}>
                            Thêm
                        </Button>
                    </div>
                </div>

            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Tìm kiếm</h4>
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
                            <div className={'label-input'}>Công ty vay</div>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={listCompany}
                                // sx={{ width: 300 }}
                                // onChange={}
                                renderInput={(params) => < TextField {...params} placeholder="Công ty vay"/>}
                                size={"small"}
                                onChange={(event, newValue) => {
                                    console.log("new_value", newValue)
                                    if (newValue)
                                        setCompanySearch(newValue.id)
                                    else setCompanySearch(null)
                                }}
                            />
                        </div>
                        <div style={{width: '20%',marginLeft:'20px'}}>
                            <div className={'label-input'}>Khoảng thời gian</div>
                            <div className={'time-search'}>
                                <img src={require('../../assets/img/icon-calendar.svg').default} alt="" />
                                <DateRangePicker
                                    initialSettings={{
                                        timePicker: true,
                                        // minDate: moment().startOf('day').toDate(),
                                        startDate: moment().startOf('month').toDate(),
                                        endDate: moment().endOf('month').toDate(),
                                        locale: {
                                            format: 'DD/MM/YYYY',
                                        }
                                    }}
                                    onApply={handleChangeDateRange}
                                >
                                    <input type="text" className="form-control col input-date-range" />
                                </DateRangePicker>
                            </div>
                        </div>




                    </div>

                </Collapse>
                <Divider light/>
                <div className={'main-content-body-result'}>
                    <TableContainer  style={{height:'100%', width: '100%',overflow:"auto"}}>
                    {/*<div style={{height: '100%', width: '100%'}}>*/}
                        <Table stickyHeader  className={"table-custom"}>
                            <TableHead >
                                <TableRow >
                                    <TableCell align="center">Ngày trả lãi</TableCell>
                                    <TableCell align="center">Công ty vay</TableCell>
                                    <TableCell align="center">Tổng phải trả(VNĐ)</TableCell>

                                    <TableCell align="center">Mã khoản vay</TableCell>
                                    <TableCell align="center">Giá trị vay(VNĐ)</TableCell>
                                    {/*start_date*/}
                                    <TableCell align="center">Ngày vay</TableCell>
                                    {/*end_date*/}
                                    <TableCell align="center">Ngày trả gốc</TableCell>
                                    {/*nums_of_interest_day*/}
                                    <TableCell align="center">Ngày tính lãi</TableCell>
                                    {/*interest_rate*/}
                                    <TableCell align="center">Lãi xuất(%)</TableCell>
                                    {/*//charging_amount*/}
                                    <TableCell align="center">Số tiền phải trả(VNĐ)</TableCell>
                                    {/*charging_type*/}
                                    <TableCell align="center">Loại tiền lãi</TableCell>
                                    {/*interest_period*/}
                                    <TableCell align="center">Số kỳ trả lãi</TableCell>
                                    {/*principal_period*/}
                                    <TableCell align="center">Số kỳ trả gốc</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{overflowY:"auto"}}>
                                <div className={`message-table-empty ${listResult.rows.length===0?'':'hidden'}`}>Không có dữ liệu</div>
                                {listResult.rows.map(item => (
                                    <>
                                        <TableRow>
                                            <TableCell rowSpan={item.sof.length + 1}>
                                                {item.chargingDate}
                                            </TableCell>
                                            <TableCell rowSpan={item.sof.length + 1}>
                                                {item.companyName}
                                            </TableCell>
                                            <TableCell rowSpan={item.sof.length + 1}>
                                                <div className={'error-message'}>
                                                    {item.total}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {item.sof.map(detail => (
                                            <TableRow>
                                                <TableCell><div className={'text-decoration'} onClick={()=>redirectToSof(detail.sof_id)}>{detail.sof_code}</div></TableCell>
                                                <TableCell><div >{detail.principal}</div></TableCell>
                                                <TableCell>{detail.start_date}</TableCell>
                                                <TableCell>{detail.end_date}</TableCell>
                                                <TableCell>{detail.nums_of_interest_day}</TableCell>
                                                <TableCell>{detail.interest_rate}</TableCell>
                                                <TableCell><div className={'error-message'}>
                                                    {detail.charging_amount}
                                                </div>
                                                </TableCell>
                                                <TableCell>{detail.charging_type}</TableCell>
                                                <TableCell>{detail.interest_period}</TableCell>
                                                <TableCell>{detail.principal_period}</TableCell>
                                                <TableCell>
                                                    <div className='icon-action'>
                                                        <Tooltip title="Cập nhật">
                                                            <EditOutlinedIcon onClick={()=>updateChargingEstBtn(detail.id,detail.charging_amount)}
                                                                style={{color: "rgb(107, 114, 128)"}}></EditOutlinedIcon>
                                                        </Tooltip>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}

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
            </div>
        </div>
    )
}

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton/>
            <GridToolbarDensitySelector/>
        </GridToolbarContainer>
    );
}
