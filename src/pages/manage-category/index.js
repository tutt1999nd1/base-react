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
import Utils, {currencyFormatter} from "../../constants/utils";
 import apiManagerCompany from "../../api/manage-company";
 import apiManagerCategory from "../../api/manage-category";
 import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
 import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

export default function ManageCategory() {
    const [nameSearch,setNameSearch] =useState(null)
    const [listAllCategory,setListAllCategory] =useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [idParent, setIdParent] = useState(0)
    const [refresh, setRefresh] = useState(false)
    const [openModalDel, setOpenModalDel] = useState(false)
    const [openSearch, setOpenSearch] = useState(true)

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
            field: 'category_name',
            headerName: 'Tên hạng mục',
            headerClassName: 'super-app-theme--header',
            flex:1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        }, {
            filterable: false,
            sortable: false,
            field: 'parent_category_name',
            headerName: 'Hạng mục cha',
            headerClassName: 'super-app-theme--header',
            flex:1,
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
            flex:1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            field: 'action',
            headerClassName: 'super-app-theme--header',

            headerName: 'Thao tác',
            sortable: false,
            width: 200,
            align: 'center',
            maxWidth: 130,
            // flex: 1,
            renderCell: (params) => {

                const detailBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    navigate(`/category/detail?id=${params.id}`)

                }
                const deleteBtn = (e) => {
                    e.stopPropagation();
                    setOpenModalDel(true)
                    setInfoDel(params.row)
                }
                const updateBtn = (e) => {
                    e.stopPropagation();
                    navigate(`/category/update?id=${params.id}`)
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
        deleteCategoryApi(infoDel.id).then(r => {
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
        navigate('/category/create')
    }
    const convertArr = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i].index = (listResult.page) * listResult.pageSize + i + 1;
            // arr[i].asset_group_name = arr[i].asset_group?.group_name;
            if(arr[i].parent_category){
                arr[i].parent_category_name = arr[i].parent_category.category_name
            }
            else  arr[i].parent_category_name=''
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
        getListCategoryApi({
            'page_size': listResult.pageSize,
            'page_index': listResult.page + 1,
            'paging': true,
            'category_name': nameSearch === '' ? null : nameSearch,
            'parent_id': idParent === 0 ? null : idParent,
        }).then(r => {
            setLoading(false)
            console.log("r", r)
            let arr = convertArr(r.data.categories)
            setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }, [listResult.page, listResult.pageSize,nameSearch ,refresh,idParent])

    useEffect(()=>{
        getListCategoryApi({
            'page_size': 0,
            // 'page_index': listResult.page + 1,
            'paging': false,
            // 'company_name': nameSearch === '' ? null : nameSearch,
            // 'contact_detail': contactSearch === 0 ? null : contactSearch,
            // 'tax_number': taxSearch === 0 ? null : taxSearch,
        }).then(r => {
            setLoading(false)
            setListAllCategory(r.data.categories)
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    },[refresh])
    const getListCategoryApi = (data) => {
        setLoading(true)
        return apiManagerCategory.getListCategory(data);
    }
    const deleteCategoryApi = (id) => {
        setLoading(true)
        return apiManagerCategory.deleteCategory(id);
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
                            <div className={'label-input'}>Tên hạng mục</div>
                            <TextField
                                fullWidth
                                size={"small"}
                                placeholder={'Tên hạng mục'}
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
                            <div className={'label-input'}>Hạng mục cha</div>
                            <FormControl fullWidth>
                                <Select
                                    size={"small"}
                                    value={idParent}
                                    onChange={handleChangeIdParent}
                                >
                                    <MenuItem value={0}>Tất cả</MenuItem>
                                    {
                                        listAllCategory.map((e) => (
                                            <MenuItem value={e.id}>{e.category_name}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
                        </div>


                    </div>

                </Collapse>
                <Divider light/>
                <div className={'main-content-body-result'}>
                    <div style={{height: '100%', width: '100%'}}>
                        <DataGrid
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                            labelRowsPerPage={"Số kết quả"}
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
