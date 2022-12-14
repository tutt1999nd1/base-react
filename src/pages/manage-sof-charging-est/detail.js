import React, {useEffect, useState} from "react";
import {Button, Divider, Typography} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {currencyFormatter} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";

export default function DetailSofChargingEst(props) {
    const navigate = useNavigate();
    const [location,setLocation] = useSearchParams();
    const [listGroup,setListGroup] =useState([]);
    const [listType,setListType] =useState([]);
    const [typeDefault,setTypeDefault] = useState(0)
    const [groupDefault,setGroupDefault] = useState(0)
    const [idDetail,setIdDetail] = useState(null)
    const [openModalDel,setOpenModalDel] = useState(false)

    const [info,setInfo] =useState({
        company_name:'',
        address:'',
        contact_detail:'',
        tax_number:'',
        charter_capital:'',
        capital_limit:'',
        founding_date:'',
        collateral:''
    })
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const backList = () => {
        navigate('/company')
    }
    useEffect(()=>{
        if(idDetail){
            getListCompanyApi({id:idDetail,page_size:1}).then(r=>{
                setInfo( r.data.companies[0])
                console.log(r.data.companies[0])
            }).catch(e=>{

            })
        }
    },[idDetail])
    useEffect(()=>{
        if(location.get('id')){
            setIdDetail(location.get('id'));
        }
        else navigate('/company')

    },[location])
    const submitDelete = () => {
        // alert("tutt20")
        deleteCompanyApi(info.id).then(r=>{
            toast.success('Xóa thành công', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                navigate(`/company`)
            }, 1050);

        }).catch(e=>{
            console.log(e)
        })

    }
    const getListCompanyApi = (data) => {
        return apiManagerCompany.getListCompany(data);
    }

    const update = () => {
        navigate(`/company/update?id=${idDetail}`)
    }

    const deleteCompanyBtn = () => {
        setOpenModalDel(true)
    }
    const deleteCompanyApi = (id) => {
        return apiManagerCompany.deleteCompany(id);
    }
    useEffect(()=>{
        console.log("info",info)
    },[info])
    return (
        <div className={'main-content main-content-detail'}>
            {/*<div className={`loading ${false ? '' : ''}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
            {/*</div>*/}
            <ModalConfirmDel name={info.company_name} openModalDel={openModalDel} handleCloseModalDel={handleCloseModalDel} submitDelete={submitDelete} ></ModalConfirmDel>

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
            <Button onClick={backList} style={{marginBottom:'10px'}} variant="text" startIcon={<KeyboardBackspaceIcon />}>Công ty</Button>

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
                        Tên công ty
                    </div>
                    <div className={'text-info-content'}>
                        {info.company_name}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Loại công ty
                    </div>
                    <div className={'text-info-content'}>
                        {info.company_type==='SUPPLIER'?'Công ty cho vay':'Công ty vay'}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Tài sản đảm bảo
                    </div>
                    <div className={'text-info-content'}>
                        {info.collateral}
                    </div>
                </div>
                <Divider></Divider>

                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Đại chỉ
                    </div>
                    <div className={'text-info-content'}>
                        {info.address}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Thông tin liên hệ
                    </div>
                    <div className={'text-info-content'}>
                        {info.contact_detail}

                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Mã số thuế
                    </div>
                    <div className={'text-info-content'}>
                        {info.tax_number}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Vốn điều lệ
                    </div>
                    <div className={'text-info-content'}>
                        {currencyFormatter(info.charter_capital)}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                       Số tiền vay tối đa
                    </div>
                    <div className={'text-info-content'}>
                        {currencyFormatter(info.capital_limit)}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Ngày thành lập
                    </div>
                    <div className={'text-info-content'}>
                        {info.founding_date}
                    </div>
                </div>

                <Divider></Divider>

            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Quản lý</h4>
                </div>
                <Divider light />
                <div style={{padding:'20px'}}>
                    <Button onClick={deleteCompanyBtn}  color={'error'} style={{marginBottom:'10px'}} variant="outlined" >Xóa dữ liệu</Button>
                    <div className={'text-info-content'}>
                        Thao tác này sẽ xóa toàn bộ dữ liệu của bản ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
