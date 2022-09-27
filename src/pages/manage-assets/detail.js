import React, {useEffect, useState} from "react";
import {
    Box,
    Button, css,
    Divider,
    FormControl, FormHelperText,
    Grid,
    InputAdornment, InputLabel, MenuItem,
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
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector, GridToolbarExport,
    GridToolbarFilterButton
} from "@mui/x-data-grid";
import {GridRowsProp} from "@mui/x-data-grid";
import {GridColDef} from "@mui/x-data-grid";
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import {useNavigate, useSearchParams} from "react-router-dom";
import apiManagerAssets from "../../api/manage-assets";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {ClipLoader} from "react-spinners";
import {currencyFormatter} from "../../constants/utils";
export default function DetailAsset(props) {
    const navigate = useNavigate();
    const [location,setLocation] = useSearchParams();
    const [listGroup,setListGroup] =useState([]);
    const [listType,setListType] =useState([]);
    const [typeDefault,setTypeDefault] = useState(0)
    const [groupDefault,setGroupDefault] = useState(0)
    const [idDetail,setIdDetail] = useState(null)
    const [openModalDel,setOpenModalDel] = useState(false)

    const [info,setInfo] =useState({
        asset_name:'',
        asset_type:{id:0},
        asset_group:{id:0},
        description:'',
        initial_value:'',
        capital_value:'',
        max_capital_value:'',
        current_credit_value:'',
        list_attachments:[]
    })
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const backList = () => {
        navigate('/assets')
    }
    useEffect(()=>{
        if(idDetail){
            getListAssetsApi({id:idDetail,page_size:1}).then(r=>{
                setInfo( r.data.assets[0])
                console.log(r.data.assets[0])
            }).catch(e=>{

            })
        }
    },[idDetail])
    useEffect(()=>{
        if(location.get('id')){
            setIdDetail(location.get('id'));
        }
        else navigate('/assets')

    },[location])
    const submitDelete = () => {
        // alert("tutt20")
        deleteAssetApi(info.id).then(r=>{
            toast.success('Xóa thành công', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                navigate(`/assets`)
            }, 1050);

        }).catch(e=>{
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
    const getListAssetsApi = (data) => {
        return apiManagerAssets.getListAsset(data);
    }


    const getListAssetGroupApi = (data) => {
        return apiManagerAssets.getAssetGroup(data);
    }
    const getListAssetTypeApi = (data) => {
        return apiManagerAssets.getAssetType(data);
    }
    const update = () => {
        navigate(`/assets/update?id=${idDetail}`)
    }
    const back = () => {
        navigate(`/assets/update?id=${idDetail}`)
    }
    const deleteAssetBtn = () => {
        setOpenModalDel(true)
    }
    const deleteAssetApi = (id) => {
        return apiManagerAssets.deleteAsset(id);
    }
    useEffect(()=>{
        console.log("info",info)
    },[info])
    const downloadFile = (url) => {
        window.open(url, '_blank');
    }
    return (
        <div className={'main-content main-content-detail'}>
            {/*<div className={`loading ${false ? '' : ''}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
            {/*</div>*/}
            <ModalConfirmDel name={info.asset_name} openModalDel={openModalDel} handleCloseModalDel={handleCloseModalDel} submitDelete={submitDelete} ></ModalConfirmDel>

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
            <Button onClick={backList} style={{marginBottom:'10px'}} variant="text" startIcon={<KeyboardBackspaceIcon />}>Tài sản</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent:'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        {info.asset_name}
                    </Typography>
                    <Button onClick={update} style={{marginBottom:'10px'}} variant="outlined" startIcon={<BorderColorOutlinedIcon />}>Cập nhật</Button>

                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Thông tin chi tiết</h4>
                </div>
                <Divider light />
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Tên tài sản
                    </div>
                    <div className={'text-info-content'}>
                        {info.asset_name}
                    </div>
                </div>
                <Divider></Divider>

                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Nhóm tài sản
                    </div>
                    <div className={'text-info-content'}>
                        {info.asset_group.group_name}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Loại tài sản
                    </div>
                    <div className={'text-info-content'}>
                        {info.asset_type.asset_type_name}

                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Gía trị ban đầu
                    </div>
                    <div className={'text-info-content'}>
                        {currencyFormatter(info.initial_value)}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Vốn vay
                    </div>
                    <div className={'text-info-content'}>
                        {currencyFormatter(info.capital_value)}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Gốc vay tín dụng hiện tại
                    </div>
                    <div className={'text-info-content'}>
                        {currencyFormatter(info.current_credit_value)}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Số tiền vay tối đa
                    </div>
                    <div className={'text-info-content'}>
                        {currencyFormatter(info.max_capital_value)}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Trạng thái
                    </div>
                    <div className={'text-info-content'}>

                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Thông tin
                    </div>
                    <div className={'text-info-content'}>
                        {info.description}
                    </div>
                </div>
                <Divider></Divider>

            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Tài liệu đính kèm</h4>
                </div>
                <Divider light />
                {
                    info.list_attachments.map((e,i)=>(
                        <div style={{cursor:"pointer"}} className={'row-detail'} onClick={()=>downloadFile(e.download_link)}>
                            <div className={'text-info-content'}>
                                {e.file_name}
                            </div>
                        </div>
                    ))
                }

                <Divider></Divider>



            </div>

            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Quản lý</h4>
                </div>
                <Divider light />
                <div style={{padding:'20px'}}>
                    <Button onClick={deleteAssetBtn}  color={'error'} style={{marginBottom:'10px'}} variant="outlined" >Xóa dữ liệu</Button>
                    <div className={'text-info-content'}>
                        Thao tác này sẽ xóa toàn bộ dữ liệu của bản ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
