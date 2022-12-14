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
        "source_of_fund_id":sourceOfFundId,
        "attachment_entity": {"file_name": ""}
    })

    useEffect(()=>{
        if(!openModalEdit){
            setInfo({
                "paid_amount":"",
                type:"pay",
                "date_apply":new dayjs,
                "source_of_fund_id":sourceOfFundId,
                "attachment_entity": {"file_name": ""}
            })
        }
    },[openModalEdit])

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
            headerName: 'S??? ti???n',
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
            headerName: 'Lo???i',
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
        // {filterable: false,sortable: false, field: 'document', headerName: 'T??i li???u',headerClassName: 'super-app-theme--header' ,minWidth: 120},

        {
            filterable: false,
            sortable: false,
            field: 'date_apply',
            headerName: 'Ng??y ??p d???ng g???c m???i',
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
            headerName: 'Thao t??c',
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
                    let copy = {...params.row}
                    e.stopPropagation();

                    copy.paid_amount = Number(copy.paid_amount.replaceAll('.',''))
                    setInfo(copy)
                    setIsUpdate(true)
                    setOpenModalEdit(true)
                }
                return <div className='icon-action'>
                    {params.row.attachment_entity != null &&
                    <Tooltip title="File thay ?????i" onClick={() => downloadFile(params.row.attachment_entity.id)}>
                        <LinkIcon style={{color: "rgb(107, 114, 128)"}}></ LinkIcon>
                    </Tooltip>
                    }
                    <Tooltip title="C???p nh???t" onClick={updateBtn}>
                        <EditOutlinedIcon style={{color: "rgb(107, 114, 128)"}}></EditOutlinedIcon>
                    </Tooltip>
                    <Tooltip title="X??a" onClick={deleteBtn}>
                        <DeleteOutlineIcon style={{color: "rgb(107, 114, 128)"}}></DeleteOutlineIcon>
                    </Tooltip>

                </div>;
            },
        },

        // { field: 'document', headerName: 'Nh??m t??i s???n' },
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
                    <Tooltip title="X??a">
                        <Button onClick={deleteListBtn} variant={"outlined"} style={{right:"20px",position:'absolute'}} color={"error"}>X??a</Button>
                    </Tooltip> : ''}
            </GridToolbarContainer>
        );
    }
    const submitDelete = () => {
        if(isDelList){
            deleteListApi({list_id:listDelete}).then(r => {
                setRefresh(!refresh)
                toast.success('X??a th??nh c??ng', {
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
        } else{
            deleteApi(infoDel.id).then(r => {
                toast.success('X??a th??nh c??ng', {
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
                        Qu???n l?? thay ?????i ti???n g???c
                    </Typography>
                    <div>
                        <Button onClick={()=>{setIsUpdate(false);setOpenModalEdit(true)}}  variant="outlined" startIcon={<AddIcon/>}>
                            Th??m
                        </Button>
                    </div>
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
                        <div style={{width:'30%'}}>
                            <div className={'label-input'}>Kho???ng th???i gian</div>
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
                                <div style={{margin:'0 5px'}}>?????n</div>
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
                            labelRowsPerPage={"S??? k???t qu???"}
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
