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
import apiManagerSOF from "../../api/manage-sof";

export default function DetailSOF(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [typeDefault, setTypeDefault] = useState(0)
    const [groupDefault, setGroupDefault] = useState(0)
    const [idDetail, setIdDetail] = useState(null)
    const [openModalDel, setOpenModalDel] = useState(false)

    const [info, setInfo] = useState({
        id: '',
        capital_company: {id: 0},
        capital_category: {id: 0},
        capital_campaign: {id: 0},
        lending_amount: null,
        owner_full_name: null,
        owner_user_id: null,
        lending_start_date: null,
        status: null,
        lending_in_month: null,
        interest_period: null,
        interest_rate: null,
        grace_principal_in_month: null,
        grace_interest_in_month: null,
        interest_rate_type: null,
        reference_interest_rate: null,
        interest_rate_rage: null,
        list_attachments:[]
    })
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const backList = () => {
        navigate('/sof')
    }
    useEffect(() => {
        if (idDetail) {
            getListSOFApi({id: idDetail, page_size: 1}).then(r => {
                setInfo(r.data.source_of_funds[0])
                console.log(r.data.source_of_funds[0])
            }).catch(e => {

            })
        }
    }, [idDetail])
    useEffect(() => {
        if (location.get('id')) {
            setIdDetail(location.get('id'));
        } else navigate('/sof')

    }, [location])
    const submitDelete = () => {
        // alert("tutt20")
        deleteSOFApi(info.id).then(r => {
            toast.success('Xóa thành công', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                navigate(`/sof`)
            }, 1050);

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
    const getListSOFApi = (data) => {
        return apiManagerSOF.getListSOF(data);
    }


    const update = () => {
        navigate(`/sof/update?id=${idDetail}`)
    }
    const back = () => {
        navigate(`/sof/update?id=${idDetail}`)
    }
    const deleteSOFBtn = () => {
        setOpenModalDel(true)
    }
    const deleteSOFApi = (id) => {
        return apiManagerSOF.deleteSOF(id);
    }
    useEffect(() => {
        console.log("info", info)
    }, [info])
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
            <ModalConfirmDel name={info.id} openModalDel={openModalDel}
                             handleCloseModalDel={handleCloseModalDel} submitDelete={submitDelete}></ModalConfirmDel>

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
            <Button onClick={backList} style={{marginBottom: '10px'}} variant="text"
                    startIcon={<KeyboardBackspaceIcon/>}>Khoản vay</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        {info.id}
                    </Typography>
                    <Button onClick={update} style={{marginBottom: '10px'}} variant="outlined"
                            startIcon={<BorderColorOutlinedIcon/>}>Cập nhật</Button>

                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Thông tin chi tiết</h4>
                </div>
                <Divider light/>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        ID
                    </div>
                    <div className={'text-info-content'}>
                        {info.id}
                    </div>
                </div>
                <Divider></Divider>

                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Công ty vay
                    </div>
                    <div className={'text-info-content'}>
                        {info.capital_company.company_name}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>Hạng mục</div>
                    <div className={'text-info-content'}>
                        {info.capital_category.category_name}

                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Mục đích vay
                    </div>
                    <div className={'text-info-content'}>
                        {info.capital_campaign.campaign_name}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Trạng thái
                    </div>
                    <div className={'text-info-content'}>
                        {info.status=='UNPAID'?'Chưa tất toán':info.status=='PAID'?'Đã tất toán':info.status==='A_PART_PRINCIPAL_OFF'?'Off 1 phần gốc':'Đã off gốc, chưa trả lã'}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>Số tiền vay</div>
                    <div className={'text-info-content'}>
                        {currencyFormatter(info.lending_amount)}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Người quản lý
                    </div>
                    <div className={'text-info-content'}>
                        {info.owner_full_name}
                    </div>
                </div>
                {/*<div className={'row-detail'}>*/}
                {/*    <div className={'text-info-tittle'}>*/}
                {/*        Trạng thái*/}
                {/*    </div>*/}
                {/*    <div className={'text-info-content'}>*/}

                {/*    </div>*/}
                {/*</div>*/}
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Ngày vay
                    </div>
                    <div className={'text-info-content'}>
                        {info.lending_start_date}
                    </div>
                </div>
                <Divider></Divider> <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Thời gian vay
                    </div>
                    <div className={'text-info-content'}>
                        {info.lending_in_month}
                    </div>
                </div>
                <Divider></Divider> <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>Số kỳ trả gốc</div>
                    <div className={'text-info-content'}>
                        {info.principal_period}
                    </div>
                </div>
                <Divider></Divider> <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Số kỳ trả lãi
                    </div>
                    <div className={'text-info-content'}>
                        {info.interest_period}
                    </div>
                </div>
                <Divider></Divider> <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Lãi suất hợp đồng vay
                    </div>
                    <div className={'text-info-content'}>
                        {info.interest_rate}
                    </div>
                </div>
                <Divider></Divider> <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>Thời gian ân hạn gốc</div>
                    <div className={'text-info-content'}>
                        {info.grace_principal_in_month}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Thời gian ân hạn lãi
                    </div>
                    <div className={'text-info-content'}>
                        {info.grace_interest_in_month}
                    </div>
                </div>
                <Divider></Divider>     <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Loại lãi suất
                    </div>
                    <div className={'text-info-content'}>
                        {info.interest_rate_type}
                    </div>
                </div>
                <Divider></Divider>     <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>Lãi suất tham chiếu</div>
                    <div className={'text-info-content'}>
                        {info.reference_interest_rate}
                    </div>
                </div>
                <Divider></Divider>     <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Biên độ lãi suất
                    </div>
                    <div className={'text-info-content'}>
                        {info.interest_rate_rage}
                    </div>
                </div>
                <Divider></Divider>


            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Tài liệu đính kèm</h4>
                </div>
                <Divider light/>
                {
                    info.list_attachments.map((e, i) => (
                        <div style={{cursor: "pointer"}} className={'row-detail'}
                             onClick={() => downloadFile(e.download_link)}>
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
                <Divider light/>
                <div style={{padding: '20px'}}>
                    <Button onClick={deleteSOFBtn} color={'error'} style={{marginBottom: '10px'}} variant="outlined">Xóa
                        dữ liệu</Button>
                    <div className={'text-info-content'}>
                        Thao tác này sẽ xóa toàn bộ dữ liệu của bản ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
