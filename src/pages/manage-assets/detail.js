import React, {useState} from "react";
import {Button, Divider, InputAdornment, Paper, TextField, Tooltip, Typography} from "@mui/material";
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
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector, GridToolbarExport,
    GridToolbarFilterButton
} from "@mui/x-data-grid";
import {GridRowsProp} from "@mui/x-data-grid";
import {GridColDef} from "@mui/x-data-grid";

export default function DetailAssets() {
    //     const localizedTextsMap = {
    //     columnMenuUnsort: "não classificado",
    //     columnMenuSortAsc: "Classificar por ordem crescente",
    //     columnMenuSortDesc: "Classificar por ordem decrescente",
    //     columnMenuFilter: "Filtro",
    //     columnMenuHideColumn: "Ocultar",
    //     columnMenuShowColumns: "Mostrar colunas"
    // };
    const [data, setData] = useState([
        {
            'name':'Tài sản 1',
            'group':'Group 1',
            'type':'Cho vay',
            'information':'Thông tin chi tiết',
            'gia_tri_ban_dau':'1000000',
            'von_vay':'1000000',
            'goc_vay_tin_dung_hien_tai':'1000000',
            'so_tien_toi_da':'1000000',
            'status':'1',
            'document':''
        }
    ])
    const rows: GridRowsProp = [
        { id:1,name: 'Tài sản 1', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},
        { id:2,name: 'Tài sản 2', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},
        { id:3,name: 'Tài sản 3', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},
        { id:4,name: 'Tài sản 4', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},
        { id:5,name: 'Tài sản 5', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},
        { id:6,name: 'Tài sản 6', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},
        { id:7,name: 'Tài sản 7', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},
        { id:8,name: 'Tài sản 8', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},
        { id:9,name: 'Tài sản 9', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},
        { id:10,name: 'Tài sản 10', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},
        { id:11,name: 'Tài sản 11', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},
        { id:12,name: 'Tài sản 12', group: 'Group1', type: 'World' ,information:'Thông tin 1',gia_tri_ban_dau:100000,von_vay:100000,goc_vay_tin_dung_hien_tai:100000,so_tien_toi_da:100000,status:'Chưa phê duyệt',document:''},


    ];

    const columns: GridColDef[] = [
        {
            field: 'id' ,
            headerName: 'STT',
            maxWidth:75,
            filterable: false,
            renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        { field: 'name', headerName: 'Tên tài sản',headerClassName: 'super-app-theme--header',minWidth: 120},
        { field: 'group', headerName: 'Nhóm tài sản' ,headerClassName: 'super-app-theme--header',minWidth: 120},
        { field: 'type', headerName: 'Nhóm tài sản' ,headerClassName: 'super-app-theme--header',minWidth: 120 },
        { field: 'gia_tri_ban_dau', headerName: 'Gía trị ban đầu',headerClassName: 'super-app-theme--header',minWidth: 120 },
        { field: 'von_vay', headerName: 'Vốn vay' ,headerClassName: 'super-app-theme--header',minWidth: 120},
        { field: 'goc_vay_tin_dung_hien_tai', headerName: 'Gốc vay tín dụng hiện tại',headerClassName: 'super-app-theme--header',minWidth: 120 },
        { field: 'so_tien_toi_da', headerName: 'Số tiền vay tối đa',headerClassName: 'super-app-theme--header',minWidth: 120 },
        { field: 'status', headerName: 'Trạng thái',headerClassName: 'super-app-theme--header',minWidth: 120 },
        { field: 'document', headerName: 'Tài liệu',headerClassName: 'super-app-theme--header' ,minWidth: 120},
        { field: 'information', headerName: 'Thông tin' ,headerClassName: 'super-app-theme--header',minWidth: 120,flex:1},

        {
            field: 'action',
            headerName: 'Thao tác',
            sortable: false,
            width: 200,
            align: 'center',
            maxWidth:130,
            // flex: 1,
            renderCell: (params) => {

                const selectProject = (e) => {
                    e.stopPropagation();
                    console.log(params)

                }
                const deleteBtn = (e) => {
                    e.stopPropagation();
                    toast.success('Xoá thành công', {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });                }
                const updateProjectBtn = (e) => {
                    e.stopPropagation();

                    // });
                }
                return <div className='icon-action'>
                    <Tooltip title="Cập nhật">
                        <BorderColorOutlinedIcon style={{color:"rgb(107, 114, 128)"}} ></BorderColorOutlinedIcon>
                    </Tooltip>
                    <Tooltip title="Xóa" onClick={deleteBtn}>
                        <DeleteOutlineIcon  style={{color:"rgb(107, 114, 128)"}}></DeleteOutlineIcon>
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                        <ArrowForwardIcon  style={{color:"rgb(107, 114, 128)"}}></ArrowForwardIcon>
                    </Tooltip>

                </div>;
            },
        },

        // { field: 'document', headerName: 'Nhóm tài sản' },
    ];
    // const { data } = useDemoData({
    //     dataSet: 'Commodity',
    //     rowLength: 20,
    //     maxColumns: 5,
    // });
    return (
        <div className={'main-content'}>
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
                <div className={'row'} style={{justifyContent:'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý tài sản
                    </Typography>
                    <Button variant="outlined" startIcon={<AddIcon />}>
                        Thêm
                    </Button>
                </div>
                <div className={'row'} style={{marginTop:'20px'}}>
                    <Button variant="text" startIcon={<VerticalAlignTopIcon />}>Import</Button>
                    <Button style={{marginLeft:'10px'}} variant="text" startIcon={<VerticalAlignBottomIcon/>}>Export</Button>
                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Tìm kiếm</h4>
                </div>
                <Divider light />
                <div className={'main-content-body-search'}>
                    <TextField
                        // label="TextField"
                        placeholder={'Tìm kiếm'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        // variant="standard"
                    />
                </div>
                <Divider light />
                <div className={'main-content-body-result'}>
                    <div style={{ height: '80vh', width: '100%' }}>
                        <DataGrid
                            density="comfortable"
                            // localeText={localizedTextsMap}
                            rows={rows} columns={columns}
                            disableSelectionOnClick
                            sx={{
                                // boxShadow: 2,
                                border: 1,
                                borderColor: 'rgb(255, 255, 255)',
                                '& .MuiDataGrid-cell:hover': {
                                    // color: 'primary.main',

                                },
                                '& .MuiDataGrid-cell': {
                                    // border: 1,
                                    borderColor: 'rgba(0, 0, 0, 0.08)',
                                },
                                '& .super-app-theme--header': {
                                    color: 'rgb(55, 65, 81)',
                                    borderBottom: 'none',
                                    fontsize: '12px',
                                    fontWeight: '600',
                                    // lineHeight: 1,
                                    letterspacing: '0.5px',
                                    textTransform: 'uppercase'
                                },

                            }}
                            {...data}
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
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    );
}
