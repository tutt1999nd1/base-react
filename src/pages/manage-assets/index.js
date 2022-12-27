import React, {useEffect, useState} from "react";
import Collapse from "@mui/material/Collapse";
import {
    Button,
    Divider,
    FormControl,
    IconButton,
    MenuItem,
    Select,
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
import {toast, ToastContainer} from "react-toastify";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, viVN} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import apiManagerAssets from "../../api/manage-assets";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {changeVisibilityTableAll, checkColumnVisibility, currencyFormatter, pending} from "../../constants/utils";
import {useSelector} from "react-redux";
import {TreeSelect} from "antd";
import apiManagerAssetGroup from "../../api/manage-asset-group";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import Axios from "axios";
import API_MAP from "../../constants/api";
export default function ManageAssets() {
    const FileDownload = require('js-file-download');
    const currentUser = useSelector(state => state.currentUser)
    const navigate = useNavigate();
    //     const localizedTextsMap = {
    //     columnMenuUnsort: "não classificado",
    //     columnMenuSortAsc: "Classificar por ordem crescente",
    //     columnMenuSortDesc: "Classificar por ordem decrescente",
    //     columnMenuFilter: "Filtro",
    //     columnMenuHideColumn: "Ocultar",
    //     columnMenuShowColumns: "Mostrar colunas"
    // };
    const [listDelete, setListDelete] = useState([]);
    const [isDelList,setIsDelList] =  useState(false)
    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [openModalDel, setOpenModalDel] = useState(false)
    const [nameSearch, setNameSearch] = useState('')
    const [groupSearch, setGroupSearch] = useState()
    const [typeSearch, setTypeSearch] = useState(0)
    const [openSearch, setOpenSearch] = useState(true)
    const [listAssetGroupTree, setListAssetGroupTree] = useState([]);
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
            maxWidth: 60,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('asset','index'),
            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            field: 'asset_name',
            headerName: 'Tên tài sản',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset','asset_name'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'asset_group_name',
            headerName: 'Nhóm tài sản',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset','asset_group_name'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'initial_value',
            headerName: 'Giá trị ban đầu',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset','initial_value'),
            renderCell: (params) => {

                return <div className='content-column number'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'capital_value',
            headerName: 'Vốn vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset','capital_value'),
            renderCell: (params) => {

                return <div className='content-column number'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'current_credit_value',
            headerName: 'Gốc vay tín dụng hiện tại',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset','current_credit_value'),
            renderCell: (params) => {

                return <div className='content-column number'>
                    {params.value}
                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            field: 'max_capital_value',
            headerName: 'Số tiền vay tối đa',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset','max_capital_value'),
            renderCell: (params) => {

                return <div className='content-column number'>
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
            hide: checkColumnVisibility('asset','status'),
            flex: 1,
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
            field: 'description',
            headerName: 'Thông tin',
            headerClassName: 'super-app-theme--header',
            minWidth: 450,
            hide: checkColumnVisibility('asset','description'),
            // flex: 3,
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
            maxWidth: 130,
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('asset','action'),
            // flex: 1,
            renderCell: (params) => {

                const detailBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    navigate(`/assets/detail?id=${params.id}`)

                }
                const deleteBtn = (e) => {
                    e.stopPropagation();
                    setIsDelList(false)
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
    const uploadFile = () => {
        var el = window._protected_reference = document.createElement("INPUT");
        el.type = "file";
        el.accept = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
        // el.multiple = "multiple";
        el.addEventListener('change', function (ev2) {

            new Promise(function (resolve) {
                setTimeout(function () {
                    if(el.files.length > 0) {
                        console.log(el.files);
                        let formData = new FormData();
                        formData.append('file', el.files[0])
                        importAssetApi(formData).then(r=>{
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
                            console.log(err)
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
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
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
            if (arr[i].status === 'DRAFT') {
                arr[i].status = "Tạo mới"
            } else if (arr[i].status === 'APPROVING') {
                arr[i].status = "Đang duyệt"
            } else if (arr[i].status === 'APPROVED') {
                arr[i].status = "Đã duyệt"
            } else if (arr[i].status === 'REJECTED') {
                arr[i].status = "Đã từ chối"
            }
        }
        return arr;
    }
    const handleChangeAssetName = (e) => {
        setNameSearch(e.target.value)
    }
    const handleChangeAssetGroup = (e) => {
        setGroupSearch(e)
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
            'asset_group_id': groupSearch,
        }).then(r => {
            setLoading(false)
            console.log("r", r)
            let arr;
            if (r.data.assets)
                arr = convertArr(r.data.assets)
            else arr = [];
            console.log("arr tutt", arr)
            setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }, [listResult.page, listResult.pageSize, nameSearch, groupSearch, typeSearch, refresh, currentUser])
    useEffect(() => {

        getListAssetGroupTreeApi({paging: false}).then(r => {
            console.log("setListCategoryTree", r.data)
            setListAssetGroupTree(r.data)
        }).catch(e => {
            console.log(e)
        })
    }, [currentUser])

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
            deleteAssetApi(infoDel.id).then(r => {
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
    const deleteListBtn = () => {
        setIsDelList(true)
        setOpenModalDel(true)
    }
    const downTemplate = () => {
        Axios.get(API_MAP.DOWN_TEMPLATE_ASSETS, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` },
            responseType: 'blob'
        }).then(response => {
            let nameFile = response.headers['content-disposition'].split(`"`)[1]
            FileDownload(response.data,nameFile);

        }).catch(e=>{
        })
    }
    const deleteListApi = (data) => {
        return apiManagerAssets.deleteListAsset(data);
    }
    const getListAssetGroupTreeApi = (data) => {
        return apiManagerAssetGroup.getListAssetGroupTree(data);
    }
    const getListAssetsApi = (data) => {
        setLoading(true)
        return apiManagerAssets.getListAsset(data);
    }

    const deleteAssetApi = (id) => {
        return apiManagerAssets.deleteAsset(id);
    }
    const importAssetApi = (data) => {
        return apiManagerAssets.importAsset(data);
    }
    const downTemplateAssetApi = (data) => {
        return apiManagerAssets.downTemplateAsset(data);
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
                    <div>
                        <Tooltip title={'Tải file mẫu'}>
                            <IconButton style={{cursor: 'pointer'}} color="primary"
                                        onClick={downTemplate}>
                                <SimCardDownloadIcon></SimCardDownloadIcon>
                            </IconButton>
                        </Tooltip>

                        <Button onClick={uploadFile} variant="text" startIcon={<VerticalAlignTopIcon/>}>Nhập</Button>
                        {/*<Button onClick={pending} style={{marginLeft: '10px', marginRight: '10px'}} variant="text"*/}
                        {/*        startIcon={<VerticalAlignBottomIcon/>}>Xuất</Button>*/}

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
                            <div className={'label-input'}>Tên tài sản</div>
                            <TextField
                                fullWidth
                                size={"small"}
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
                        </div>
                        <div style={{width: '20%', marginLeft: '20px'}}>
                            <div className={'label-input'}>Nhóm tài sản</div>
                            <TreeSelect
                                style={{width: '100%'}}
                                showSearch
                                value={groupSearch}
                                treeData={listAssetGroupTree}
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                placeholder="Nhóm tài sản"
                                allowClear
                                treeDefaultExpandAll
                                onChange={handleChangeAssetGroup}
                                filterTreeNode={(search, item) => {
                                    return item.group_name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                                }}
                                fieldNames={{label: 'group_name', value: 'id', children: 'child_asset_groups'}}
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
                            getRowHeight={() => 'auto'}
                            density="standard"
                            columns={columns}
                            pagination
                            rowCount={listResult.total}
                            {...listResult}
                            onColumnVisibilityModelChange={(event) =>{
                                changeVisibilityTableAll('asset',event)
                            }}
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
                            checkboxSelection
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
    )
}

