import React, {useEffect, useState} from "react";
import {ClipLoader} from "react-spinners";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {Button, Collapse, css, Divider, IconButton, TextField, Tooltip, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import {toast, ToastContainer} from "react-toastify";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
    DataGrid,
    GridColDef,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    viVN
} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {changeVisibilityTableAll, checkColumnVisibility, pending} from "../../constants/utils";
import apiManagerCategory from "../../api/manage-category";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {TreeSelect} from "antd";
import {useSelector} from "react-redux";
import apiManagerAssetGroup from "../../api/manage-asset-group";
import apiManagerAssets from "../../api/manage-assets";

export default function ManageCategory() {
    const currentUser = useSelector(state => state.currentUser)
    const [nameSearch,setNameSearch] =useState(null)
    const [listAllCategory,setListAllCategory] =useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [idParent, setIdParent] = useState(0)
    const [refresh, setRefresh] = useState(false)
    const [openModalDel, setOpenModalDel] = useState(false)
    const [openSearch, setOpenSearch] = useState(true)
    const [listAssetGroupTree, setListAssetGroupTree] = useState([]);
    const [assetGroupSearch, setAssetGroupSearch] = useState()
    const [listDelete, setListDelete] = useState([]);
    const [isDelList, setIsDelList] = useState(false)
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 10,
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
            hide: checkColumnVisibility('asset-group','index'),
            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        // {
        //     filterable: false,
        //     sortable: false,
        //     field: 'id',
        //     headerName: 'ID',
        //     headerClassName: 'super-app-theme--header',
        //     maxWidth: 70,
        // },

        {
            filterable: false,
            sortable: false,
            field: 'group_name',
            headerName: 'T??n nh??m t??i s???n',
            headerClassName: 'super-app-theme--header',
            flex:1,
            hide: checkColumnVisibility('asset-group','group_name'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        }, {
            filterable: false,
            sortable: false,
            field: 'parent_asset_group_name',
            headerName: 'Nh??m t??i s???n cha',
            headerClassName: 'super-app-theme--header',
            flex:1,
            hide: checkColumnVisibility('asset-group','parent_asset_group_name'),
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
            headerName: 'M?? t???',
            headerClassName: 'super-app-theme--header',
            flex:1,
            hide: checkColumnVisibility('asset-group','description'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            field: 'action',
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('asset-group','action'),
            headerName: 'Thao t??c',
            sortable: false,
            width: 200,
            align: 'center',
            maxWidth: 150,
            // flex: 1,
            renderCell: (params) => {

                const detailBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    navigate(`/asset-group/detail?id=${params.id}`)

                }
                const deleteBtn = (e) => {
                    e.stopPropagation();
                    console.log("del",params.row)
                    setIsDelList(false)
                    setOpenModalDel(true)
                    setInfoDel(params.row)
                }
                const updateBtn = (e) => {
                    e.stopPropagation();
                    navigate(`/asset-group/update?id=${params.id}`)
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

    const handleChangeNameSearch = (e) => {
      setNameSearch(e.target.value)
    }
    const handleChangeIdParent = (e) => {
        setIdParent(e.target.value)
    }

    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }

    const redirectAddPage = () => {
        navigate('/asset-group/create')
    }
    const convertArr = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i].index = (listResult.page) * listResult.pageSize + i + 1;
            // arr[i].asset_group_name = arr[i].asset_group?.group_name;
            if(arr[i].parent_asset_group){
                arr[i].parent_asset_group_name = arr[i].parent_asset_group.group_name
            }
            else  arr[i].parent_asset_group_name=''
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
        if(currentUser.token){
            getListAssetGroupApi({
                'page_size': listResult.pageSize,
                'page_index': listResult.page + 1,
                'paging': true,
                'group_name': nameSearch === '' ? null : nameSearch,
                'parent_id': assetGroupSearch ? assetGroupSearch : null,
            }).then(r => {
                setLoading(false)
                console.log("r", r)
                let arr = convertArr(r.data.asset_groups)
                setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
            }).catch(e => {
                setLoading(false)
                console.log(e)
            })
        }

    }, [listResult.page, listResult.pageSize,nameSearch ,refresh,assetGroupSearch,currentUser.token])

    useEffect(()=>{
        getListAssetGroupTreeApi({paging: false}).then(r => {
            console.log("setListCategoryTree", r.data)
            setListAssetGroupTree(r.data)
        }).catch(e => {
            console.log(e)
        })
    },[refresh])
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
        }else{
            deleteAssetGroupApi(infoDel.id).then(r => {
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

    const deleteListApi = (data) => {
        return apiManagerAssetGroup.deleteListAssetGroup(data);
    }
    const getListAssetGroupApi = (data) => {
        setLoading(true)
        return apiManagerAssetGroup.getListAssetGroup(data);
    }
    const deleteAssetGroupApi = (id) => {
        setLoading(true)
        return apiManagerAssetGroup.deleteAssetGroup(id);
    }
    const getListAssetGroupTreeApi = (data) => {
        return apiManagerAssetGroup.getListAssetGroupTree(data);
    }
    const handleChangeAssetGroup = (e) => {
        setAssetGroupSearch(e)
    };
    return (
        <div className={'main-content'}>
            {/*<div className={`loading ${loading ? '' : 'hidden'}`}>*/}
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
                <ModalConfirmDel name={infoDel.group_name} openModalDel={openModalDel}
                                 handleCloseModalDel={handleCloseModalDel}
                                 submitDelete={submitDelete}></ModalConfirmDel>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Qu???n l?? nh??m t??i s???n
                    </Typography>
                    <div>
                        <Button className={"d-none"} onClick={pending} variant="text" startIcon={<VerticalAlignTopIcon/>}>Nh???p</Button>
                        <Button className={"d-none"} onClick={pending} style={{marginLeft: '10px',marginRight:'10px'}} variant="text"
                                startIcon={<VerticalAlignBottomIcon/>}>Xu???t</Button>
                        <Button onClick={redirectAddPage} variant="outlined" startIcon={<AddIcon/>}>
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
                        <div style={{width: '20%'}}>
                            <div className={'label-input'}>T??n nh??m t??i s???n</div>
                            <TextField
                                fullWidth
                                size={"small"}
                                placeholder={'T??n nh??m t??i s???n'}
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
                        <div style={{width: '20%',marginLeft: '20px'}}>
                            <div className={'label-input'}>Nh??m t??i s???n cha</div>
                            <TreeSelect
                                style={{ width: '100%' }}
                                showSearch
                                value={assetGroupSearch}
                                treeData={listAssetGroupTree}
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                placeholder="Nh??m t??i s???n cha"
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
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                            labelRowsPerPage={"S??? k???t qu???"}
                            getRowHeight={() => 'auto'}
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
                            onSelectionModelChange={(newSelectionModel) => {
                                setListDelete(newSelectionModel)
                            }}
                            onPageChange={(page) => setListResult((prev) => ({...prev, page}))}
                            onPageSizeChange={(pageSize) =>
                                setListResult((prev) => ({...prev, pageSize}))
                            }
                            onColumnVisibilityModelChange={(event) =>{
                                changeVisibilityTableAll('asset-group',event)
                            }}
                            checkboxSelection
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

