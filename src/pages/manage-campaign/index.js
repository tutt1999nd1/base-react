import React, {useEffect, useState} from "react";
import {ClipLoader, HashLoader} from "react-spinners";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {
    Button, Collapse, css,
    Divider,
    FormControl, FormHelperText, IconButton,
    InputAdornment,
    InputLabel, MenuItem,
    Paper, Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import SearchIcon from '@mui/icons-material/Search';
import {toast, ToastContainer} from "react-toastify";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {
    DataGrid,
    viVN,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector, GridToolbarExport,
    GridToolbarFilterButton
} from "@mui/x-data-grid";
import {GridRowsProp} from "@mui/x-data-grid";
import {GridColDef} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import apiManagerAssets from "../../api/manage-assets";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import Utils, {currencyFormatter, pending} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import apiManagerCategory from "../../api/manage-category";
import apiManagerCampaign from "../../api/manage-campaign";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {TreeSelect} from "antd";
import {useSelector} from "react-redux";

export default function ManageCategory() {
    const currentUser = useSelector(state => state.currentUser)
    const [openSearch, setOpenSearch] = useState(true)
    const [nameSearch, setNameSearch] = useState(null)
    const [listAllResult, setListAllResult] = useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [campaignSearch, setCampaignSearch] = useState()
    const [refresh, setRefresh] = useState(false)
    const [openModalDel, setOpenModalDel] = useState(false)
    const [listCampaignTree, setListCampaignTree] = useState([]);
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 10,
        rows: [],
        total: 0
    });
    const handleChangeCampaign = (e) => {
        setCampaignSearch(e)
    };
    const [infoDel, setInfoDel] = useState({})

    const columns: GridColDef[] = [
        {
            sortable: false,
            field: 'index',
            headerName: 'STT',
            maxWidth: 70,
            filterable: false,
            headerClassName: 'super-app-theme--header',

            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            field: 'campaign_name',
            headerName: 'Tên mục đích vay',
            headerClassName: 'super-app-theme--header',
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
            field: 'campaign_parent_name',
            headerName: 'Mục đích cha',
            headerClassName: 'super-app-theme--header',
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
            field: 'amount',
            headerName: 'Số tiền vay',
            headerClassName: 'super-app-theme--header',
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
            field: 'description',
            headerName: 'Mô tả',
            headerClassName: 'super-app-theme--header',
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
            headerClassName: 'super-app-theme--header',

            sortable: false,
            width: 200,
            align: 'center',
            maxWidth: 130,
            // flex: 1,
            renderCell: (params) => {

                const detailBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    navigate(`/campaign/detail?id=${params.id}`)

                }
                const deleteBtn = (e) => {
                    e.stopPropagation();
                    setOpenModalDel(true)
                    setInfoDel(params.row)
                }
                const updateBtn = (e) => {
                    e.stopPropagation();
                    navigate(`/campaign/update?id=${params.id}`)
                    // });
                }
                return <div className='icon-action'>
                    <Tooltip title="Cập nhật" onClick={updateBtn}>
                        <EditOutlinedIcon style={{color: "rgb(107, 114, 128)"}}></EditOutlinedIcon>
                    </Tooltip>
                    <Tooltip title="Xóa" onClick={deleteBtn}>
                        <DeleteOutlineIcon style={{color: "rgb(107, 114, 128)"}}></DeleteOutlineIcon>
                    </Tooltip>
                    <Tooltip onClick={detailBtn} title="Xem chi tiết">
                        <ArrowForwardIcon style={{color: "rgb(107, 114, 128)"}}></ArrowForwardIcon>
                    </Tooltip>

                </div>;
            },
        },

        // { field: 'document', headerName: 'Nhóm tài sản' },
    ];

    const handleChangeNameSearch = (e) => {
        setNameSearch(e.target.value)
    }


    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const submitDelete = () => {
        // alert("tutt20")
        deleteCampaignApi(infoDel.id).then(r => {
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
    const redirectAddPage = () => {
        navigate('/campaign/create')
    }
    const convertArr = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i].index = (listResult.page) * listResult.pageSize + i + 1;
            arr[i].amount = currencyFormatter(arr[i].amount)
            if (arr[i].parent_campaign) {
                arr[i].campaign_parent_name = arr[i].parent_campaign.campaign_name
            } else arr[i].campaign_parent_name = ''
            // arr[i].asset_group_name = arr[i].asset_group?.group_name;
            // arr[i].asset_type_name = arr[i].asset_type?.asset_type_name;
            // arr[i].initial_value = currencyFormatter(arr[i].initial_value)
            // arr[i].capital_value = currencyFormatter(arr[i].capital_value)
            // arr[i].max_capital_value = currencyFormatter(arr[i].max_capital_value)
            // arr[i].capital_limit = currencyFormatter(arr[i].capital_limit)
            // arr[i].charter_capital = currencyFormatter(arr[i].charter_capital)
        }
        return arr;
    }

    useEffect(() => {
        getListCampaignApi({
            'page_size': listResult.pageSize,
            'page_index': listResult.page + 1,
            'paging': true,
            'campaign_name': nameSearch === '' ? null : nameSearch,
            'parent_id': campaignSearch ? campaignSearch :null,
        }).then(r => {
            setLoading(false)
            console.log("r", r)
            let arr = convertArr(r.data.campaigns)
            setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }, [listResult.page, listResult.pageSize, nameSearch, refresh, campaignSearch])

    useEffect(() => {
        // getListCampaignApi({
        //     'page_size': 0,
        //     // 'page_index': listResult.page + 1,
        //     'paging': false,
        //     // 'company_name': nameSearch === '' ? null : nameSearch,
        //     // 'contact_detail': contactSearch === 0 ? null : contactSearch,
        //     // 'tax_number': taxSearch === 0 ? null : taxSearch,
        // }).then(r => {
        //     setLoading(false)
        //     setListAllResult(r.data.campaigns)
        // }).catch(e => {
        //     setLoading(false)
        //     console.log(e)
        // })
        getListCampaignTreeApi({
            'page_size': 0,
            // 'page_index': listResult.page + 1,
            'paging': false,
            // 'company_name': nameSearch === '' ? null : nameSearch,
            // 'contact_detail': contactSearch === 0 ? null : contactSearch,
            // 'tax_number': taxSearch === 0 ? null : taxSearch,
        }).then(r => {
            setLoading(false)
            setListCampaignTree(r.data)
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })

    }, [refresh])
    const getListCampaignApi = (data) => {
        setLoading(true)
        return apiManagerCampaign.getListCampaign(data);
    }
    const deleteCampaignApi = (id) => {
        setLoading(true)
        return apiManagerCampaign.deleteCampaign(id);
    }
    const getListCampaignTreeApi = (data) => {
        return apiManagerCampaign.getListCampaignTree(data);
    }

    return (
        <div className={'main-content'}>
            <div className={`loading ${loading ? '' : 'hidden'}`}>
                {/*<div className={`loading    `}>*/}
                <ClipLoader
                    color={'#1d78d3'} size={50} css={css`color: #1d78d3`}/>
            </div>
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
                <ModalConfirmDel name={infoDel.campaign_name} openModalDel={openModalDel}
                                 handleCloseModalDel={handleCloseModalDel}
                                 submitDelete={submitDelete}></ModalConfirmDel>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý mục đích vay
                    </Typography>
                    <div>
                        <Button onClick={pending} variant="text" startIcon={<VerticalAlignTopIcon/>}>Nhập</Button>
                        <Button onClick={pending} style={{marginLeft: '10px',marginRight:'10px'}} variant="text"
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
                            <div className={'label-input'}>Tên mục đích vay</div>
                            <TextField
                                fullWidth
                                size={"small"}
                                placeholder={'Tên mục đích vay'}
                                value={nameSearch}
                                onChange={handleChangeNameSearch}
                                // InputProps={{
                                //     startAdornment: (
                                //         <InputAdornment position="start">
                                //             <SearchIcon />
                                //         </InputAdornment>
                                //     ),
                                // }}
                                // variant="standard"
                            />
                        </div>
                        <div style={{width: '20%', marginLeft: '20px'}}>
                            <div className={'label-input'}>Mục đích cha</div>
                            <TreeSelect
                                style={{ width: '100%' }}
                                showSearch
                                value={campaignSearch}
                                treeData={listCampaignTree}
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                placeholder="Mục đích vay"
                                allowClear
                                treeDefaultExpandAll
                                onChange={handleChangeCampaign}
                                filterTreeNode={(search, item) => {
                                    return item.campaign_name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                                }}
                                fieldNames={{label: 'campaign_name', value: 'id', children: 'child_campaigns'}}
                            >
                            </TreeSelect>
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
                                // boxShadow: 2,
                                overflowX: 'scroll',
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
