import React, {useEffect, useState} from "react";
import Collapse from "@mui/material/Collapse";
import 'react-dropdown-tree-select/dist/styles.css'
// import 'antd/dist/antd.css';
import {Box, Divider, FormControl, IconButton, MenuItem, Select, Tab, Tabs, Tooltip} from "@mui/material";
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {ToastContainer} from "react-toastify";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, viVN} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import {a11yProps, currencyFormatter, TabPanel} from "../../constants/utils";
import apiManagerSOF from "../../api/manage-sof";
import {useSelector} from "react-redux";
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import ModalReject from "./ModalReject";

export default function ManageApprove() {
    const currentUser = useSelector(state => state.currentUser)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [statusSearch, setStatusSearch] = useState(0)
    const [openSearch, setOpenSearch] = useState(true)
    const [openModalReject, setOpenModalReject] = useState(false)
    const [tab, setTab] = React.useState(0);
    const [idReject, setIdReject] = React.useState(0);
    const handleCloseModalReject = () => {
        setOpenModalReject(false);
    }
    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 10,
        rows: [
            // {
            //     id:1,
            //     asset_name:'2',
            //     asset_group_name:'111',
            //     asset_type_name:'111',
            //     initial_value:'111',
            //     capital_value:'111',
            //     current_credit_value:'111',
            //     max_capital_value:'111',
            //     status:'111',
            //     description:'Thông tin chứng khoán ngày hôm nay rất tệ'
            // }
        ],
        total: 0
    });
    const [infoDel, setInfoDel] = useState({})

    const columns: GridColDef[] = [
        {
            sortable: false,
            field: 'index',
            headerName: 'STT',
            maxWidth: 75,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            sortable: false,
            field: 'sof_code',
            headerName: 'Mã khoản vay',
            minWidth: 150,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            field: 'capital_company_name',
            headerName: 'Công ty vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'capital_category_name',
            headerName: 'Hạng mục',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'capital_campaign_name',
            headerName: 'Mục đích vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'status',
            headerName: 'Trạng thái',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'lending_amount',
            headerName: 'Số tiền vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'owner_full_name',
            headerName: 'Người quản lý',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            field: 'created_by',
            headerName: 'Người tạo',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            field: 'approve_name',
            // hideable: false ,
            hide: true,
            headerName: 'Người phê duyệt',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            field: 'lending_start_date',
            headerName: 'Ngày vay',
            hide: true,
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'lending_in_month',
            headerName: 'Thời gian vay',
            hide: true,
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
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
            field: 'principal_period',
            hide: true,
            headerName: 'Số kỳ trả gốc',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }, {
            filterable: false,
            sortable: false,
            hide: true,
            field: 'interest_period',
            headerName: 'Số kỳ trả lãi',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }, {
            filterable: false,
            sortable: false,
            hide: true,
            field: 'interest_rate',
            headerName: 'Lãi suất hợp đồng vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }, {
            filterable: false,
            sortable: false,
            hide: true,
            field: 'grace_principal_in_month',
            headerName: 'Thời gian ân hạn gốc',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }, {
            filterable: false,
            sortable: false,
            hide: true,
            field: 'grace_interest_in_month',
            headerName: 'Thời gian ân hạn lãi',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }, {
            filterable: false,
            sortable: false,
            hide: true,
            field: 'interest_rate_type',
            headerName: 'Loại lãi suất',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }
        , {
            filterable: false,
            sortable: false,
            hide: true,
            field: 'reference_interest_rate',
            headerName: 'Lãi suất tham chiếu',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            hide: true,
            field: 'interest_rate_rage',
            headerName: 'Biên độ lãi suất',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            field: 'status_approve',
            headerName: 'Trạng thái phê duyệt',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {
                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },
        {
            field: 'action',
            headerName: 'Thao tác',
            sortable: false,

            width: 200,
            align: 'center',
            minWidth: 150,
            headerClassName: 'super-app-theme--header',

            flex: 1,
            renderCell: (params) => {

                const detailBtn = (e) => {
                    e.stopPropagation();
                    navigate(`/sof/detail?id=${params.id}`)
                }

                const confirmBtn = (e) => {
                    e.stopPropagation();
                    confirmApproveSOFApi({id:params.id}).then(r=>{
                        setRefresh(!refresh)
                    }).catch(err=>{

                    })
                    console.log(params.row.status_approve)
                }
                const rejectBtn = (e) => {
                    e.stopPropagation();
                    setIdReject(params.id);
                    setOpenModalReject(true)
                    // rejectApproveSOFApi({id:params.id}).then(r=>{
                    //     setRefresh(!refresh)
                    // }).catch(err=>{
                    //
                    // })
                    console.log(params.row.status_approve)
                }
                return <div className='icon-action'>
                    {
                        params.row.status_approve=='Đang chờ phê duyệt'?
                            <>
                                <Tooltip title="Từ chối" >
                                    <DoDisturbIcon onClick={rejectBtn} style={{color: "rgb(107, 114, 128)"}}></DoDisturbIcon>
                                </Tooltip>
                                <Tooltip title="Phê duyệt" >
                                    <CheckIcon onClick={confirmBtn} style={{color: "rgb(107, 114, 128)"}}></CheckIcon>
                                </Tooltip>
                            </>
                            :''
                    }
                    <Tooltip onClick={detailBtn} title="Xem chi tiết">
                        <ArrowForwardIcon style={{color: "rgb(107, 114, 128)"}}></ArrowForwardIcon>
                    </Tooltip>
                </div>;
            },
        },
        // { field: 'document', headerName: 'Nhóm tài sản' },
    ];


    const convertArr = (arr) => {
        let a = []
        for (let i = 0; i < arr.length; i++) {
            arr[i].index = (listResult.page) * listResult.pageSize + i + 1;
            if (arr[i].capital_company) {
                arr[i].capital_company_name = arr[i].capital_company.company_name
            } else arr[i].capital_company_name = ''
            if (arr[i].capital_category) {
                arr[i].capital_category_name = arr[i].capital_category.category_name
            } else arr[i].capital_category_name = ''
            if (arr[i].capital_campaign) {
                arr[i].capital_campaign_name = arr[i].capital_campaign.campaign_name
            } else arr[i].capital_campaign_name = ''
            // arr[i].asset_type_name = arr[i].asset_type?.asset_type_name;
            // arr[i].initial_value = currencyFormatter(arr[i].initial_value)
            // arr[i].capital_value = currencyFormatter(arr[i].capital_value)
            // arr[i].max_capital_value = currencyFormatter(arr[i].max_capital_value)
            arr[i].lending_amount = currencyFormatter(arr[i].lending_amount)
            if (arr[i].status === 'UNPAID') {
                arr[i].status = "Chưa tất toán"
            } else if (arr[i].status === 'PAID') {
                arr[i].status = "Đã tất toán"
            } else if (arr[i].status === 'A_PART_PRINCIPAL_OFF') {
                arr[i].status = "Off 1 phần gốc"
            } else if (arr[i].status === 'PRINCIPAL_OFF_UNPAID_INTEREST') {
                arr[i].status = "Đã off gốc, chưa trả lãi"
            }
            if(arr[i].status_approve==='DRAFT'){
                arr[i].status_approve="Tạo mới"
            }
            else if(arr[i].status_approve==='APPROVING'){
                arr[i].status_approve="Đang chờ phê duyệt"
            }
            else if(arr[i].status_approve==='APPROVED'){
                arr[i].status_approve="Đã duyệt"
            }
            else if(arr[i].status_approve==='REJECTED'){
                arr[i].status_approve="Đã từ chối"
            }
            // if(arr[i].status_approve!=='Tạo mới'){
            //     a.push(arr[i])
            // }
                a.push(arr[i])

        }
        return a;
    }

    const handleChangeStatus = (e) => {
        setStatusSearch(e.target.value)
    };
    useEffect(() => {
        getListSOFApproveApi({
            'page_size': listResult.pageSize,
            'page_index': listResult.page + 1,
            'paging': true,
            'status_approve': statusSearch === 0 ? null : statusSearch,
        }).then(r => {
            setLoading(false)
            console.log("r", r)
            let arr;
            if (r.data.source_of_funds)
                arr = convertArr(r.data.source_of_funds)
            else arr = [];
            console.log("arr tutt", arr)
            setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }, [listResult.page, listResult.pageSize,statusSearch, refresh])


    // const { data } = useDemoData({
    //     dataSet: 'Commodity',
    //     rowLength: 20,
    //     maxColumns: 5,
    // });
    const getListSOFApproveApi = (data) => {
        setLoading(true)
        return apiManagerSOF.getListSOFApprove(data);
    }
    const submitReject = (e) => {
        // alert(JSON.stringify(e))
        rejectApproveSOFApi({id:e.id}).then(r=>{
            setRefresh(!refresh)
        }).catch(err=>{

        })    }
    const sendApproveSOFApi = (data) => {
        return apiManagerSOF.sendApproveSOF(data);
    }
    const cancelApproveSOFApi = (data) => {
        return apiManagerSOF.cancelApproveSOF(data);
    }
    const confirmApproveSOFApi = (data) => {
        return apiManagerSOF.confirmApproveSOF(data);
    }
    const rejectApproveSOFApi = (data) => {
        return apiManagerSOF.rejectApproveSOF(data);
    }
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                    <Tab label="Phê duyệt nguồn vốn" {...a11yProps(0)} />
                    <Tab label="Phê duyệt tài sản" {...a11yProps(1)} />
                    {/*<Tab label="Item Three" {...a11yProps(2)} />*/}
                </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
                <div style={{padding:'unset'}} className={'main-content'} >
                    {/*<div className={`loading ${true ? '' : ''}`}>*/}
                    {/*    /!*<div className={`loading    `}>*!/*/}
                    {/*    <ClipLoader*/}
                    {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
                    {/*</div>*/}
                    <ModalReject idReject={idReject} handleCloseModalReject={handleCloseModalReject} submitReject={submitReject} openModalReject={openModalReject}></ModalReject>
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

                    {/*<div className={'main-content-header'}>*/}
                    {/*    <div className={'row'} style={{justifyContent: 'space-between'}}>*/}
                    {/*        <Typography variant="h5" className={'main-content-tittle'}>*/}
                    {/*            Quản lý phê duyệt*/}
                    {/*        </Typography>*/}
                    {/*    </div>*/}

                    {/*</div>*/}
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
                                    <div className={'label-input'}>Trạng thái</div>
                                    <FormControl fullWidth >
                                        <Select
                                            labelId="asset_type_label"
                                            id='asset_type'
                                            name='asset_type'
                                            value={statusSearch}
                                            onChange={handleChangeStatus}
                                            size={"small"}
                                        >
                                            <MenuItem value={0}>Tất cả</MenuItem>
                                            <MenuItem value={'APPROVING'}>Đang chờ duyệt</MenuItem>
                                            <MenuItem value={'APPROVED'}>Đã duyệt</MenuItem>
                                            <MenuItem value={'REJECTED'}>Đã từ chối</MenuItem>

                                        </Select>
                                    </FormControl>
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
                                    loading={loading}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    disableSelectionOnClick
                                    sx={{
                                        overflowX: 'scroll',
                                        // boxShadow: 2,
                                        border: 1,
                                        borderColor: 'rgb(255, 255, 255)',
                                        '& .MuiDataGrid-iconSeparator': {
                                            display: 'none',
                                        },

                                    }}
                                    components={{
                                        Toolbar: CustomToolbar,
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={tab} index={1}>
               Phê duyệt tài sản
            </TabPanel>
        </Box>



    )
}

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton/>
            {/*<GridToolbarDensitySelector/>*/}
        </GridToolbarContainer>
    );
}
