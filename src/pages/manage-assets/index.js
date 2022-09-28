import React, {useEffect, useState} from "react";
import {ClipLoader, HashLoader} from "react-spinners";
import Collapse from "@mui/material/Collapse";
import {
    Badge,
    Button, css,
    Divider,
    FormControl, FormHelperText, IconButton,
    InputAdornment,
    InputLabel, MenuItem,
    Paper, Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
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
import NotificationsIcon from "@mui/icons-material/Notifications";
import {red} from "@mui/material/colors";

export default function ManageAssets() {
    const navigate = useNavigate();
    //     const localizedTextsMap = {
    //     columnMenuUnsort: "não classificado",
    //     columnMenuSortAsc: "Classificar por ordem crescente",
    //     columnMenuSortDesc: "Classificar por ordem decrescente",
    //     columnMenuFilter: "Filtro",
    //     columnMenuHideColumn: "Ocultar",
    //     columnMenuShowColumns: "Mostrar colunas"
    // };

    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [openModalDel, setOpenModalDel] = useState(false)
    const [nameSearch, setNameSearch] = useState('')
    const [groupSearch, setGroupSearch] = useState(0)
    const [typeSearch, setTypeSearch] = useState(0)
    const [openSearch, setOpenSearch] = useState(true)
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 5,
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
            filterable: false,
            sortable: false,
            field: 'asset_name',
            headerName: 'Tên tài sản',
            headerClassName: 'super-app-theme--header',
            flex:1
        },
        {
            filterable: false,
            sortable: false,
            field: 'asset_group_name',
            headerName: 'Nhóm tài sản',
            headerClassName: 'super-app-theme--header',
            flex:1
        },
        {
            filterable: false,
            sortable: false,
            field: 'asset_type_name',
            headerName: 'Loại tài sản',
            headerClassName: 'super-app-theme--header',
            flex:1
        },
        {
            filterable: false,
            sortable: false,
            field: 'initial_value',
            headerName: 'Gía trị ban đầu',
            headerClassName: 'super-app-theme--header',
            flex:1
        },
        {
            filterable: false,
            sortable: false,
            field: 'capital_value',
            headerName: 'Vốn vay',
            headerClassName: 'super-app-theme--header',
            flex:1
        },
        {
            filterable: false,
            sortable: false,
            field: 'current_credit_value',
            headerName: 'Gốc vay tín dụng hiện tại',
            headerClassName: 'super-app-theme--header',
            flex:1
        },
        {
            filterable: false,
            sortable: false,
            field: 'max_capital_value',
            headerName: 'Số tiền vay tối đa',
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
        // {filterable: false,sortable: false, field: 'document', headerName: 'Tài liệu',headerClassName: 'super-app-theme--header' ,minWidth: 120},
        {
            filterable: false,
            sortable: false,
            field: 'description',
            headerName: 'Thông tin',
            headerClassName: 'super-app-theme--header',
            minWidth: 120,
            flex:3,

        },

        {
            field: 'action',
            headerName: 'Thao tác',
            sortable: false,
            width: 200,
            align: 'center',
            maxWidth: 130,
            headerClassName: 'super-app-theme--header',

            // flex: 1,
            renderCell: (params) => {

                const detailBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    navigate(`/assets/detail?id=${params.id}`)

                }
                const deleteBtn = (e) => {
                    e.stopPropagation();
                    setOpenModalDel(true)
                    setInfoDel(params.row)
                }
                const updateBtn = (e) => {
                    e.stopPropagation();
                    navigate(`/assets/update?id=${params.id}`)
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

    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const submitDelete = () => {
        // alert("tutt20")
        deleteAssetApi(infoDel.id).then(r => {
            toast.success('Xóa thành công', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setRefresh(!refresh);
        }).catch(e => {
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
        navigate('/assets/create')
    }
    const convertArr = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i].index = (listResult.page) * listResult.pageSize + i + 1;
            arr[i].asset_group_name = arr[i].asset_group?.group_name;
            arr[i].asset_type_name = arr[i].asset_type?.asset_type_name;
            arr[i].initial_value = currencyFormatter(arr[i].initial_value)
            arr[i].capital_value = currencyFormatter(arr[i].capital_value)
            arr[i].max_capital_value = currencyFormatter(arr[i].max_capital_value)
            arr[i].current_credit_value = currencyFormatter(arr[i].current_credit_value)
        }
        return arr;
    }
    const handleChangeAssetName = (e) => {
        setNameSearch(e.target.value)
    }
    const handleChangeAssetGroup = (e) => {
        setGroupSearch(e.target.value)
    };
    const handleChangeAssetType = (e) => {
        setTypeSearch(e.target.value)
    };
    useEffect(() => {
        getListAssetsApi({
            'page_size': listResult.pageSize,
            'page_index': listResult.page + 1,
            'paging': true,
            'asset_name': nameSearch === '' ? null : nameSearch,
            'asset_group_id': groupSearch === 0 ? null : groupSearch,
            'asset_type_id': typeSearch === 0 ? null : typeSearch,
        }).then(r => {
            setLoading(false)
            console.log("r", r)
            let arr;
            if(r.data.assets)
                arr = convertArr(r.data.assets)
            else arr=[]
            setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }, [listResult.page, listResult.pageSize, nameSearch, groupSearch, typeSearch, refresh])
    useEffect(() => {
        getListAssetTypeApi().then(r => {
            setListType(r.data.asset_types)
            if (r.data.asset_types.length > 0) {
                // setTypeSearch(r.data.asset_types[0].id)
            }
        }).catch(e => {

        })
        getListAssetGroupApi().then(r => {
            setListGroup(r.data.asset_groups)
            if (r.data.asset_groups.length > 0) {
                // setGroupSearch(r.data.asset_groups[0].id)
            }
        }).catch(e => {

        })
    }, [])

    // const { data } = useDemoData({
    //     dataSet: 'Commodity',
    //     rowLength: 20,
    //     maxColumns: 5,
    // });
    const getListAssetsApi = (data) => {
        setLoading(true)
        return apiManagerAssets.getListAsset(data);
    }
    const getListAssetGroupApi = (data) => {
        return apiManagerAssets.getAssetGroup(data);
    }
    const getListAssetTypeApi = (data) => {
        return apiManagerAssets.getAssetType(data);
    }
    const deleteAssetApi = (id) => {
        return apiManagerAssets.deleteAsset(id);
    }
    return (
        <div className={'main-content'}>
            {/*<div className={`loading ${true ? '' : ''}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
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
                <ModalConfirmDel name={infoDel.asset_name} openModalDel={openModalDel}
                                 handleCloseModalDel={handleCloseModalDel}
                                 submitDelete={submitDelete}></ModalConfirmDel>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý tài sản
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
                    {openSearch ?  <IconButton color="primary" style={{cursor: 'pointer'}}
                                               onClick={() => setOpenSearch(false)}>
                            <ExpandLessOutlinedIcon  ></ExpandLessOutlinedIcon>
                        </IconButton>:
                        <IconButton style={{cursor: 'pointer'}} color="primary"
                                    onClick={() => setOpenSearch(true)}>
                            <ExpandMoreOutlinedIcon></ExpandMoreOutlinedIcon>
                        </IconButton>
                    }


                </div>
                <Divider light/>
                <Collapse in={openSearch} timeout="auto" unmountOnExit>
                    <div className={'main-content-body-search'}>
                        <TextField
                            style={{width: '20%'}}
                            // label="TextField"
                            placeholder={'Tên tài sản'}
                            value={nameSearch}
                            onChange={handleChangeAssetName}
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
                            <InputLabel id="asset_group_label">Nhóm tài sản </InputLabel>

                            <Select
                                label={"Nhóm tài sản"}
                                id='asset_group'
                                name='asset_group'
                                value={groupSearch}
                                onChange={handleChangeAssetGroup}
                            >
                                <MenuItem value={0}>Tất cả</MenuItem>

                                {
                                    listGroup.map((e) => (
                                        <MenuItem value={e.id}>{e.group_name}</MenuItem>
                                    ))
                                }

                            </Select>
                        </FormControl>
                        <FormControl style={{width: '20%', marginLeft: '20px'}}>
                            <InputLabel id="asset_type_label">Loại tài sản</InputLabel>
                            <Select
                                labelId="asset_type_label"
                                id='asset_type'
                                name='asset_type'
                                label='Loại tài sản'
                                value={typeSearch}
                                onChange={handleChangeAssetType}
                            >
                                <MenuItem value={0}>Tất cả</MenuItem>

                                {
                                    listType.map((e) => (
                                        <MenuItem value={e.id}>{e.asset_type_name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
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
            {/*<GridToolbarDensitySelector/>*/}
        </GridToolbarContainer>
    );
}
