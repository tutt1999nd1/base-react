 import React, {useEffect, useState} from "react";
import {ClipLoader, HashLoader} from "react-spinners";
 import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {
    Button, css,
    Divider,
    FormControl, FormHelperText,
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
import Utils, {currencyFormatter} from "../../constants/utils";
 import apiManagerCompany from "../../api/manage-company";
 import apiManagerCategory from "../../api/manage-category";
 import apiManagerCampaign from "../../api/manage-campaign";

export default function ManageCategory() {
    const [nameSearch,setNameSearch] =useState(null)
    const [listAllResult,setListAllResult] =useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [idParent, setIdParent] = useState(0)
    const [refresh, setRefresh] = useState(false)
    const [openModalDel, setOpenModalDel] = useState(false)
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 5,
        rows: [
        ],
        total: 0
    });
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
            field: 'id',
            headerName: 'ID',
            headerClassName: 'super-app-theme--header',
            maxWidth: 70,
        },

        {
            filterable: false,
            sortable: false,
            field: 'campaign_name',
            headerName: 'Tên mục đích vay',
            headerClassName: 'super-app-theme--header',
            flex:1
        },
        {
            filterable: false,
            sortable: false,
            field: 'amount',
            headerName: 'Số tiền vay',
            headerClassName: 'super-app-theme--header',
            flex:1
        },
        {
            filterable: false,
            sortable: false,
            field: 'status',
            headerName: 'Trạng thái',
            headerClassName: 'super-app-theme--header',
            flex:1
        },
        {
            filterable: false,
            sortable: false,
            field: 'description',
            headerName: 'Mô tả',
            headerClassName: 'super-app-theme--header',
            flex:1
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
    const handleChangeIdParent = (e) => {
        setIdParent(e.target.value)
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
            'parent_id': idParent === 0 ? null : idParent,
        }).then(r => {
            setLoading(false)
            console.log("r", r)
            let arr = convertArr(r.data.campaigns)
            setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }, [listResult.page, listResult.pageSize,nameSearch ,refresh,idParent])

    useEffect(()=>{
        getListCampaignApi({
            'page_size': 0,
            // 'page_index': listResult.page + 1,
            'paging': false,
            // 'company_name': nameSearch === '' ? null : nameSearch,
            // 'contact_detail': contactSearch === 0 ? null : contactSearch,
            // 'tax_number': taxSearch === 0 ? null : taxSearch,
        }).then(r => {
            setLoading(false)
            setListAllResult(r.data.campaigns)
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    },[refresh])
    const getListCampaignApi = (data) => {
        setLoading(true)
        return apiManagerCampaign.getListCampaign(data);
    }
    const deleteCampaignApi = (id) => {
        setLoading(true)
        return apiManagerCampaign.deleteCampaign(id);
    }
    return (
        <div className={'main-content'}>
            <div className={`loading ${loading ? '' : 'hidden'}`}>
                {/*<div className={`loading    `}>*/}
                <ClipLoader
                    color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />
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
                <ModalConfirmDel name={infoDel.category_name} openModalDel={openModalDel}
                                 handleCloseModalDel={handleCloseModalDel}
                                 submitDelete={submitDelete}></ModalConfirmDel>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý mục đích vay
                    </Typography>
                    <Button onClick={redirectAddPage} variant="outlined" startIcon={<AddIcon/>}>
                        Thêm
                    </Button>
                </div>
                <div className={'row'} >
                    <Button variant="text" startIcon={<VerticalAlignTopIcon/>}>Nhập</Button>
                    <Button style={{marginLeft: '10px'}} variant="text"
                            startIcon={<VerticalAlignBottomIcon/>}>Xuất</Button>
                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Tìm kiếm</h4>
                </div>
                <Divider light/>
                <div className={'main-content-body-search'}>
                    <TextField
                        style={{width: '20%'}}
                        label="Tên mục đích vay"
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
                    <FormControl style={{width: '20%', marginLeft: '20px'}}>
                        <InputLabel id="asset_group_label">Mục đích cha</InputLabel>
                        <Select
                            label={"Hạng mục cha"}
                            value={idParent}
                            onChange={handleChangeIdParent}
                        >
                            <MenuItem value={0}>Tất cả</MenuItem>
                            {
                                listAllResult.map((e) => (
                                    <MenuItem value={e.id}>{e.campaign_name}</MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>

                </div>
                <Divider light/>
                <div className={'main-content-body-result'}>
                    <div style={{height: '100%', width: '100%'}}>
                        <DataGrid
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
