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
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, viVN} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import apiManagerAssets from "../../api/manage-assets";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {
    changeVisibilityTableAll,
    checkColumnVisibility,
    convertToTreeTable,
    currencyFormatter,
    pending
} from "../../constants/utils";
import {useSelector} from "react-redux";
import {TreeSelect} from "antd";
import apiManagerAssetGroup from "../../api/manage-asset-group";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import Axios from "axios";
import API_MAP from "../../constants/api";
import ItemDashboard from "../../components/ItemDashboard";

export default function ManageAssets() {
    const FileDownload = require('js-file-download');
    const currentUser = useSelector(state => state.currentUser)
    const navigate = useNavigate();
    const [openTotal, setOpenTotal] = useState(true)
    //     const localizedTextsMap = {
    //     columnMenuUnsort: "n??o classificado",
    //     columnMenuSortAsc: "Classificar por ordem crescente",
    //     columnMenuSortDesc: "Classificar por ordem decrescente",
    //     columnMenuFilter: "Filtro",
    //     columnMenuHideColumn: "Ocultar",
    //     columnMenuShowColumns: "Mostrar colunas"
    // };
    const [listDelete, setListDelete] = useState([]);
    const [isDelList, setIsDelList] = useState(false)
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
    const [listAsset, setListAsset] = useState([])
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
            //     description:'Th??ng tin ch???ng kho??n ng??y h??m nay r???t t???'
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
            hide: checkColumnVisibility('asset', 'index'),
            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            field: 'asset_name',
            headerName: 'T??n t??i s???n',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset', 'asset_name'),
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
            headerName: 'Nh??m t??i s???n',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset', 'asset_group_name'),
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
            headerName: 'Gi?? tr??? ban ?????u',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset', 'initial_value'),
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
            headerName: 'V???n vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset', 'capital_value'),
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
            headerName: 'G???c vay t??n d???ng hi???n t???i',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset', 'current_credit_value'),
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
            headerName: 'S??? ti???n vay t???i ??a',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset', 'max_capital_value'),
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
            headerName: 'Tr???ng th??i',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('asset', 'status'),
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        // {filterable: false,sortable: false, field: 'document', headerName: 'T??i li???u',headerClassName: 'super-app-theme--header' ,minWidth: 120},
        {
            filterable: false,
            sortable: false,
            field: 'description',
            headerName: 'Th??ng tin',
            headerClassName: 'super-app-theme--header',
            minWidth: 450,
            hide: checkColumnVisibility('asset', 'description'),
            // flex: 3,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },

        {
            field: 'action',
            headerName: 'Thao t??c',
            sortable: false,
            width: 150,
            align: 'center',
            maxWidth: 150,
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('asset', 'action'),
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
                    <Tooltip title="C???p nh???t" onClick={updateBtn}>
                        <BorderColorIcon style={{color: "rgb(107, 114, 128)"}}></BorderColorIcon>
                    </Tooltip>
                    <Tooltip title="X??a" onClick={deleteBtn}>
                        <DeleteForeverIcon style={{color: "rgb(107, 114, 128)"}}></DeleteForeverIcon>
                    </Tooltip>
                    <Tooltip onClick={detailBtn} title="Xem chi ti???t">
                        <RemoveRedEyeIcon style={{color: "rgb(107, 114, 128)"}}></RemoveRedEyeIcon>
                    </Tooltip>
                </div>;
            },
        },
        // { field: 'document', headerName: 'Nh??m t??i s???n' },
    ];
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
                        importAssetApi(formData).then(r => {
                            console.log(r);
                            toast.success('Nh???p d??? li???u th??nh c??ng', {
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
    useEffect(() => {
        console.log(listAsset)
    }, [listAsset])
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
                arr[i].status = "T???o m???i"
            } else if (arr[i].status === 'APPROVING') {
                arr[i].status = "??ang duy???t"
            } else if (arr[i].status === 'APPROVED') {
                arr[i].status = "???? duy???t"
            } else if (arr[i].status === 'REJECTED') {
                arr[i].status = "???? t??? ch???i"
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
    }, [listResult.page, listResult.pageSize, nameSearch, groupSearch, typeSearch, refresh, currentUser.token])
    useEffect(() => {

        getListAssetGroupTreeApi({paging: false}).then(r => {
            console.log("setListCategoryTree", r.data)
            setListAssetGroupTree(r.data)
        }).catch(e => {
            console.log(e)
        })

        getListAssetApi().then(r => {
            let arr = convertToTreeTable(r.data.asset_aggregates)
            console.log("tutt 222", arr)
            setListAsset(arr)
        })


    }, [currentUser])

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton/>
                {/*<GridToolbarDensitySelector/>*/}
                {listDelete.length > 0 ?
                    <Tooltip title="X??a">
                        <Button onClick={deleteListBtn} variant={"outlined"}
                                style={{right: "20px", position: 'absolute'}} color={"error"}>X??a</Button>
                    </Tooltip> : ''}
            </GridToolbarContainer>
        );
    }

    const submitDelete = () => {
        if (isDelList) {
            deleteListApi({list_id: listDelete}).then(r => {
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
        } else {
            deleteAssetApi(infoDel.id).then(r => {
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
    const deleteListBtn = () => {
        setIsDelList(true)
        setOpenModalDel(true)
    }
    const downTemplate = () => {
        Axios.get(API_MAP.DOWN_TEMPLATE_ASSETS, {
            headers: {'Authorization': `Bearer ${currentUser.token}`},
            responseType: 'blob'
        }).then(response => {
            let nameFile = response.headers['content-disposition'].split(`"`)[1]
            FileDownload(response.data, nameFile);

        }).catch(e => {
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
    const getListAssetApi = () => {
        return apiManagerAssets.getListAssetDashboard();
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
                        Qu???n l?? t??i s???n
                    </Typography>
                    <div>
                        <Tooltip title={'T???i file m???u'}>
                            <IconButton style={{cursor: 'pointer'}} color="primary"
                                        onClick={downTemplate}>
                                <SimCardDownloadIcon></SimCardDownloadIcon>
                            </IconButton>
                        </Tooltip>

                        <Button onClick={uploadFile} variant="text" startIcon={<VerticalAlignTopIcon/>}>Nh???p</Button>
                        {/*<Button onClick={pending} style={{marginLeft: '10px', marginRight: '10px'}} variant="text"*/}
                        {/*        startIcon={<VerticalAlignBottomIcon/>}>Xu???t</Button>*/}

                        <Button onClick={redirectAddPage} variant="outlined" startIcon={<AddIcon/>}>
                            Th??m
                        </Button>
                    </div>

                </div>
                <div className={'main-content-body calculate-interest-body'}>
                    <div className={'main-content-body-tittle'}>
                        <h4>Th???ng k??</h4>
                        {openTotal ? <IconButton color="primary" style={{cursor: 'pointer'}}
                                                 onClick={() => setOpenTotal(false)}>
                                <ExpandLessOutlinedIcon></ExpandLessOutlinedIcon>
                            </IconButton> :
                            <IconButton style={{cursor: 'pointer'}} color="primary"
                                        onClick={() => setOpenTotal(true)}>
                                <ExpandMoreOutlinedIcon></ExpandMoreOutlinedIcon>
                            </IconButton>
                        }
                    </div>
                    <Divider light/>
                    <Collapse in={openTotal} timeout="auto" unmountOnExit>
                        <div className={'row'} style={{padding: '0 50px 50px 50px', justifyContent: "space-between"}}>
                            {
                                listAsset.map((e) => (
                                        <ItemDashboard tittle={e.group_name}
                                                       content={e.total_value}></ItemDashboard>
                                    )
                                )
                            }

                        </div>
                    </Collapse>


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
                        <div style={{width: '20%'}}>
                            <div className={'label-input'}>T??n t??i s???n</div>
                            <TextField
                                fullWidth
                                size={"small"}
                                // label="TextField"
                                placeholder={'T??n t??i s???n'}
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
                            <div className={'label-input'}>Nh??m t??i s???n</div>
                            <TreeSelect
                                style={{width: '100%'}}
                                showSearch
                                value={groupSearch}
                                treeData={listAssetGroupTree}
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                placeholder="Nh??m t??i s???n"
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
                <div className={'main-content-body-result sticky-body'}>
                    <div style={{height: '100%', width: '100%'}}>
                        <DataGrid
                            getRowHeight={() => 'auto'}
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                            labelRowsPerPage={"S??? k???t qu???"}
                            getRowHeight={() => 'auto'}
                            density="standard"
                            columns={columns}
                            pagination
                            rowCount={listResult.total}
                            {...listResult}
                            onColumnVisibilityModelChange={(event) => {
                                changeVisibilityTableAll('asset', event)
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

