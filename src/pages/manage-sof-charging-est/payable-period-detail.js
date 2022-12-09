import React, {useEffect, useState} from "react";
import {Button, Collapse, Divider, IconButton, TextField, Tooltip, Typography} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate, useSearchParams} from "react-router-dom";
import {DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, viVN} from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {useSelector} from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {changeVisibilityTableAll, checkColumnVisibility, currencyFormatter, typeToName} from "../../constants/utils";
import ModalChangeLendingAmount from "../manage-sof/manage-change-sof/modal-edit";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import apiChangeLendingAmount from "../../api/manage-change-lending-amount";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

export default function PayablePeriodDetail(props) {
    const {sourceOfFundId} = props;
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.currentUser)
    const [idSof, setIdSof] = useState(null)
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [location, setLocation] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listDelete, setListDelete] = useState([]);
    const [isDelList,setIsDelList] =  useState(false);
    const [openModalDel, setOpenModalDel] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [openSearch, setOpenSearch] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 10,
        rows: [],
        total: 0
    });

    useEffect(() => {
        setIdSof(location.get('id'));
        setStart(location.get('startDate'));
        setEnd(location.get('endDate'));


    }, [location])

    const [timeSearch, setTimeSearch] = useState(
        {
            start: (new dayjs).startOf('month'),
            end: (new dayjs).endOf('month'),
        }
    )
    const [infoDel, setInfoDel] = useState({})
    const [info, setInfo] = useState({
        "paid_amount":"",
        "date_apply":new dayjs,
        "type":"pay",
        "source_of_fund_id":sourceOfFundId
    })
    useEffect(()=>{
        if(!openModalEdit){
            setInfo({
                "paid_amount":"",
                type:"pay",
                "date_apply":new dayjs,
                "source_of_fund_id":sourceOfFundId
            })
        }
    },[openModalEdit])
    const columns: GridColDef[] = [
        {
            sortable: false,
            field: 'index',
            headerName: 'STT',
            maxWidth: 75,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('supplier','index'),
            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            field: 'payable_date',
            headerName: 'Ngày',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            hide: checkColumnVisibility('change_lending_amount','paid_amount'),
            renderCell: (params) => {
                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'type_date',
            headerName: 'Loại tiền',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            hide: checkColumnVisibility('change_lending_amount','type_date'),
            renderCell: (params) => {
                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        // {filterable: false,sortable: false, field: 'document', headerName: 'Tài liệu',headerClassName: 'super-app-theme--header' ,minWidth: 120},

        {
            filterable: false,
            sortable: false,
            field: 'company_name',
            headerName: 'Công ty vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            hide: checkColumnVisibility('change_lending_amount','date_apply'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'amount_paid_in_period',
            headerName: 'Số tiền phải trả(VNĐ)',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            hide: checkColumnVisibility('change_lending_amount','date_apply'),
            renderCell: (params) => {

                return <div className='content-column error-message'>
                    {currencyFormatter(params.value)}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'sof_code',
            headerName: 'Mã khoản vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            hide: checkColumnVisibility('change_lending_amount','date_apply'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'interest_rate',
            headerName: 'Lãi suất(%)',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            hide: checkColumnVisibility('change_lending_amount','date_apply'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'interest_period',
            headerName: 'Số kỳ trả lãi',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            hide: checkColumnVisibility('change_lending_amount','date_apply'),
            renderCell: (params) => {
                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'principal_period',
            headerName: 'Số kỳ trả gốc',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            hide: checkColumnVisibility('change_lending_amount','date_apply'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
    ];
    const convertArr = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i].index = (listResult.page) * listResult.pageSize + i + 1;
            // arr[i].asset_group_name = arr[i].asset_group?.group_name;
            // arr[i].asset_type_name = arr[i].asset_type?.asset_type_name;
            // arr[i].initial_value = currencyFormatter(arr[i].initial_value)
            // arr[i].capital_value = currencyFormatter(arr[i].capital_value)
            // arr[i].max_capital_value = currencyFormatter(arr[i].max_capital_value)
            arr[i].paid_amount = currencyFormatter(arr[i].paid_amount)
        }
        return arr;
    }
    useEffect(() => {
            if(idSof!=null&&start!=null&&end!=null)
            getPayablePeriod(idSof,start,end,{
                'page_size': listResult.pageSize,
                'page_index': listResult.page + 1,
                'paging': true,
                // 'supplier_name': nameSearch === '' ? null : nameSearch,

            }).then(r => {
                setLoading(false)
                console.log("r", r)
                let arr = convertArr(r.data)
                setListResult({...listResult, rows: (arr)});
            }).catch(e => {
                setLoading(false)
                console.log(e)
            })


    }, [listResult.page, listResult.pageSize, refresh, currentUser.token,sourceOfFundId,timeSearch,idSof,start,end])

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton/>
                {/*<GridToolbarDensitySelector/>*/}
                {listDelete.length > 0 ?
                    <Tooltip title="Xóa">
                        <Button onClick={deleteListBtn} variant={"outlined"} style={{right:"20px",position:'absolute'}} color={"error"}>Xóa</Button>
                    </Tooltip> : ''}
            </GridToolbarContainer>
        );
    }
    const submitDelete = () => {
        if(isDelList){
            deleteListApi({list_id:listDelete}).then(r => {
                setRefresh(!refresh)
                toast.success('Xóa thành công', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }).catch(e => {
                console.log(e)
            })
        }else{
            deleteApi(infoDel.id).then(r => {
                toast.success('Xóa thành công', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setLoading(false)
                setRefresh(!refresh);
            }).catch(e => {
                setLoading(false)
                console.log(e)
            })
        }
    }
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const handleCloseModalEdit = () => {
        setOpenModalEdit(false)
    }
    const backList = () => {
        navigate('/charging_est')
    }
    const deleteListBtn = () => {
        setIsDelList(true)
        setOpenModalDel(true)
    }
    const deleteListApi = (data) => {
        return apiChangeLendingAmount.deleteListChangeLendingAmount(data);
    }
    const getPayablePeriod = (id,start,end,data) => {
        setLoading(true)
        return apiChangeLendingAmount.getPayablePeriodDetail(id,start,end,data);
    }
    const deleteApi = (id) => {
        setLoading(true)
        return apiChangeLendingAmount.deleteChangeLendingAmount(id);
    }
    return (
        <div className={'main-content'}>
            {/*<div className={`loading ${loading ? '' : 'hidden'}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`}/>*/}
            {/*</div>*/}
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
                    startIcon={<KeyboardBackspaceIcon/>}>Tính lãi</Button>
            <div className={'main-content-header'}>
                <ModalConfirmDel name={infoDel.supplier_name} openModalDel={openModalDel}
                                 handleCloseModalDel={handleCloseModalDel}
                                 submitDelete={submitDelete}></ModalConfirmDel>
                <ModalChangeLendingAmount sourceOfFundId={sourceOfFundId} refresh={refresh} setRefresh={setRefresh} openModal={openModalEdit} handleCloseModal={handleCloseModalEdit} info={info} isUpdate={isUpdate}></ModalChangeLendingAmount>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Chi tiết tiền lãi
                    </Typography>
                </div>

            </div>
            <div className={'main-content-body'}>
                {/*<div className={'main-content-body-tittle'}>*/}
                {/*    <h4>Tìm kiếm</h4>*/}
                {/*    {openSearch ? <IconButton color="primary" style={{cursor: 'pointer'}}*/}
                {/*                              onClick={() => setOpenSearch(false)}>*/}
                {/*            <ExpandLessOutlinedIcon></ExpandLessOutlinedIcon>*/}
                {/*        </IconButton> :*/}
                {/*        <IconButton style={{cursor: 'pointer'}} color="primary"*/}
                {/*                    onClick={() => setOpenSearch(true)}>*/}
                {/*            <ExpandMoreOutlinedIcon></ExpandMoreOutlinedIcon>*/}
                {/*        </IconButton>*/}
                {/*    }*/}

                {/*</div>*/}
                {/*<Divider light/>*/}
                {/*<Collapse in={openSearch} timeout="auto" unmountOnExit>*/}
                {/*    <div className={'main-content-body-search'}>*/}
                {/*        <div style={{width:'30%'}}>*/}
                {/*            <div className={'label-input'}>Khoảng thời gian</div>*/}
                {/*            <div className={''} style={{display:"flex",alignItems:"center"}}>*/}
                {/*                <LocalizationProvider  dateAdapter={AdapterDayjs} >*/}
                {/*                    <DesktopDatePicker*/}
                {/*                        style={{height:'30px'}}*/}
                {/*                        inputFormat="DD-MM-YYYY"*/}
                {/*                        value={timeSearch.start}*/}
                {/*                        onChange={(values) => {*/}
                {/*                            console.log(values)*/}
                {/*                            setTimeSearch({...timeSearch,start: values})*/}
                {/*                        }}*/}

                {/*                        renderInput={(params) => <TextField size={"small"}  {...params} />}*/}
                {/*                    />*/}
                {/*                </LocalizationProvider>*/}
                {/*                <div style={{margin:'0 5px'}}>đến</div>*/}
                {/*                <LocalizationProvider   style={{width:'50px !important',height:'30px'}}  dateAdapter={AdapterDayjs} >*/}
                {/*                    <DesktopDatePicker*/}
                {/*                        style={{width:'50px !important',height:'30px'}}*/}
                {/*                        inputFormat="DD-MM-YYYY"*/}
                {/*                        value={timeSearch.end}*/}
                {/*                        onChange={(values) => {*/}
                {/*                            console.log(values)*/}
                {/*                            setTimeSearch({...timeSearch,end: values})*/}
                {/*                        }}*/}
                {/*                        // onChange={value => props.setFieldValue("founding_date", value)}*/}
                {/*                        renderInput={(params) => <TextField size={"small"}  {...params} />}*/}
                {/*                    />*/}
                {/*                </LocalizationProvider>*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*    </div>*/}

                {/*</Collapse>*/}
                <Divider light/>
                <div className={'main-content-body-result'}>
                    <div style={{height: '100%', width: '100%'}}>
                        <DataGrid
                            getRowHeight={() => 'auto'}
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                            labelRowsPerPage={"Số kết quả"}
                            density="standard"
                            columns={columns}
                            rows={listResult.rows}
                            pagination

                            loading={loading}
                            rowsPerPageOptions={[5, 10, 25]}
                            disableSelectionOnClick
                            sx={{
                                // boxShadow: 2,
                                overflowX: 'scroll',
                                border: 1,
                                borderColor: 'rgb(255, 255, 255)',
                                '& .MuiDataGrid-iconSeparator': {
                                    display: 'none',
                                }
                            }}
                            components={{
                                Toolbar: CustomToolbar,
                            }}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}
