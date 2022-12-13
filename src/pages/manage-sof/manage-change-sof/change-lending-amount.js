import React, {useEffect, useState} from "react";
import {Button, Collapse, Divider, IconButton, TextField, Tooltip, Typography} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, viVN} from "@mui/x-data-grid";
import {changeVisibilityTableAll, checkColumnVisibility, currencyFormatter, typeToName} from "../../../constants/utils";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {useSelector} from "react-redux";
import ModalConfirmDel from "../../../components/ModalConfirmDelete";
import AddIcon from "@mui/icons-material/Add";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import apiChangeLendingAmount from "../../../api/manage-change-lending-amount";
import ModalChangeLendingAmount from "./modal-edit";
import LinkIcon from '@mui/icons-material/Link';
import Axios from "axios";
import FileDownload from "js-file-download";
import axiosClient from "../../../api/axiosClient";
import API_MAP from "../../../constants/api";
import apiManagerSOF from "../../../api/manage-sof";

export default function ChangeLendingAmount(props) {
    const {sourceOfFundId} = props;
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.currentUser)
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

    const downloadFile = (id) => {
        if(id){
            Axios.get('http://localhost:8443/attachment/'+id, {
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
            field: 'paid_amount',
            headerName: 'Số tiền',
            headerClassName: 'super-app-theme--header',
            minWidth: 120,
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
            field: 'type',
            headerName: 'Loại',
            headerClassName: 'super-app-theme--header',
            minWidth: 120,
            flex: 1,
            hide: checkColumnVisibility('change_lending_amount','paid_amount'),
            renderCell: (params) => {
                return <div className='content-column'>
                    {typeToName(params.value)}
                </div>;
            },
        },
        // {filterable: false,sortable: false, field: 'document', headerName: 'Tài liệu',headerClassName: 'super-app-theme--header' ,minWidth: 120},

        {
            filterable: false,
            sortable: false,
            field: 'date_apply',
            headerName: 'Ngày áp dụng gốc mới',
            headerClassName: 'super-app-theme--header',
            minWidth: 120,
            flex: 1,
            hide: checkColumnVisibility('change_lending_amount','date_apply'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            field: 'action',
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('supplier','action'),
            headerName: 'Thao tác',
            sortable: false,
            width: 200,
            align: 'center',
            maxWidth: 130,
            // flex: 1,
            renderCell: (params) => {
                const deleteBtn = (e) => {
                    e.stopPropagation();
                    setIsDelList(false)
                    setOpenModalDel(true)
                    setInfoDel(params.row)
                }
                const updateBtn = (e) => {
                    e.stopPropagation();
                    let copy = {...params.row}
                    copy.paid_amount = Number(copy.paid_amount.replaceAll('.',''))
                    setInfo(copy)
                    setIsUpdate(true)
                    setOpenModalEdit(true)
                    // });
                }
                return <div className='icon-action'>

                    {params.row.attachment_id != null &&
                    <Tooltip title="File thay đổi" onClick={() => downloadFile(params.row.attachment_id)}>
                        <LinkIcon style={{color: "rgb(107, 114, 128)"}}></ LinkIcon>
                    </Tooltip>
                    }
                    <Tooltip title="Cập nhật" onClick={updateBtn}>
                        <EditOutlinedIcon style={{color: "rgb(107, 114, 128)"}}></EditOutlinedIcon>
                    </Tooltip>
                    <Tooltip title="Xóa" onClick={deleteBtn}>
                        <DeleteOutlineIcon style={{color: "rgb(107, 114, 128)"}}></DeleteOutlineIcon>
                    </Tooltip>

                </div>;
            },
        },

        // { field: 'document', headerName: 'Nhóm tài sản' },
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
        if (currentUser.token&&sourceOfFundId) {
            getListChangeLendingAmountApi({
                'page_size': listResult.pageSize,
                'page_index': listResult.page + 1,
                'paging': true,
                // 'supplier_name': nameSearch === '' ? null : nameSearch,
                'source_of_fund_id':sourceOfFundId,
                'date_apply_from':dayjs(timeSearch.start).format('DD-MM-YYYY'),
                'date_apply_to':dayjs(timeSearch.end).format('DD-MM-YYYY'),
            }).then(r => {
                setLoading(false)
                console.log("r", r)
                let arr = convertArr(r.data.change_lending_amount_entities)
                setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
            }).catch(e => {
                setLoading(false)
                console.log(e)
            })
        }

    }, [listResult.page, listResult.pageSize, refresh, currentUser.token,sourceOfFundId,timeSearch])

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
    const deleteListBtn = () => {
        setIsDelList(true)
        setOpenModalDel(true)
    }
    const deleteListApi = (data) => {
        return apiChangeLendingAmount.deleteListChangeLendingAmount(data);
    }
    const getListChangeLendingAmountApi = (data) => {
        setLoading(true)
        return apiChangeLendingAmount.getListChangeLendingAmount(data);
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
            <div className={'main-content-header'}>
                <ModalConfirmDel name={infoDel.supplier_name} openModalDel={openModalDel}
                                 handleCloseModalDel={handleCloseModalDel}
                                 submitDelete={submitDelete}></ModalConfirmDel>
                <ModalChangeLendingAmount sourceOfFundId={sourceOfFundId} refresh={refresh} setRefresh={setRefresh} openModal={openModalEdit} handleCloseModal={handleCloseModalEdit} info={info} isUpdate={isUpdate}></ModalChangeLendingAmount>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý thay đổi tiền gốc
                    </Typography>
                    <div>
                        <Button onClick={()=>{setIsUpdate(false);setOpenModalEdit(true)}}  variant="outlined" startIcon={<AddIcon/>}>
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
                        <div style={{width:'30%'}}>
                            <div className={'label-input'}>Khoảng thời gian</div>
                            <div className={''} style={{display:"flex",alignItems:"center"}}>
                                <LocalizationProvider  dateAdapter={AdapterDayjs} >
                                    <DesktopDatePicker
                                        style={{height:'30px'}}
                                        inputFormat="DD-MM-YYYY"
                                        value={timeSearch.start}
                                        onChange={(values) => {
                                            console.log(values)
                                            setTimeSearch({...timeSearch,start: values})
                                        }}

                                        renderInput={(params) => <TextField size={"small"}  {...params} />}
                                    />
                                </LocalizationProvider>
                                <div style={{margin:'0 5px'}}>đến</div>
                                <LocalizationProvider   style={{width:'50px !important',height:'30px'}}  dateAdapter={AdapterDayjs} >
                                    <DesktopDatePicker
                                        style={{width:'50px !important',height:'30px'}}
                                        inputFormat="DD-MM-YYYY"
                                        value={timeSearch.end}
                                        onChange={(values) => {
                                            console.log(values)
                                            setTimeSearch({...timeSearch,end: values})
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
                <div className={'main-content-body-result'}>
                    <div style={{height: '100%', width: '100%'}}>
                        <DataGrid
                            getRowHeight={() => 'auto'}
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                            labelRowsPerPage={"Số kết quả"}
                            density="standard"
                            columns={columns}
                            pagination
                            rowCount={listResult.total}
                            {...listResult}
                            paginationMode="server"
                            // onPageChange={(page) => setCurrentPage(page)}
                            // onPageSizeChange={(pageSize) =>
                            //    setCurrentSize(pageSize)
                            // }
                            onPageChange={(page) => setListResult((prev) => ({...prev, page}))}
                            onPageSizeChange={(pageSize) =>
                                setListResult((prev) => ({...prev, pageSize}))
                            }
                            onSelectionModelChange={(newSelectionModel) => {
                                setListDelete(newSelectionModel)
                            }}
                            onColumnVisibilityModelChange={(event) =>{
                                changeVisibilityTableAll('supplier',event)
                            }}
                            checkboxSelection
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
