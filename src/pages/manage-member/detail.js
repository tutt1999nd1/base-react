import React, {useEffect, useState} from "react";
import {Button, Divider, Typography} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {currencyFormatter} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import apiManagerMember from "../../api/manage-member";

export default function DetailMember(props) {
    const navigate = useNavigate();
    const [location,setLocation] = useSearchParams();
    const [listGroup,setListGroup] =useState([]);
    const [listType,setListType] =useState([]);
    const [typeDefault,setTypeDefault] = useState(0)
    const [groupDefault,setGroupDefault] = useState(0)
    const [idDetail,setIdDetail] = useState(null)
    const [openModalDel,setOpenModalDel] = useState(false)

    const [info,setInfo] =useState({
        name:'',
        description:'',
        type:'',
    })
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const backList = () => {
        navigate('/member')
    }
    useEffect(()=>{
        if(idDetail){
            getListMemberApi({id:idDetail,page_size:1}).then(r=>{
                setInfo( r.data.member_entities[0])
                console.log(r.data.member_entities[0])
            }).catch(e=>{

            })
        }
    },[idDetail])
    useEffect(()=>{
        if(location.get('id')){
            setIdDetail(location.get('id'));
        }
        else navigate('/member')

    },[location])
    const submitDelete = () => {
        // alert("tutt20")
        deleteMemberApi(info.id).then(r=>{
            toast.success('Xóa thành công', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                navigate(`/member`)
            }, 1050);

        }).catch(e=>{
            console.log(e)
        })

    }
    const getListMemberApi = (data) => {
        return apiManagerMember.getListMember(data);
    }

    const update = () => {
        navigate(`/member/update?id=${idDetail}`)
    }

    const deleteMemberBtn = () => {
        setOpenModalDel(true)
    }
    const deleteMemberApi = (id) => {
        return apiManagerMember.deleteMember(id);
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
            <ModalConfirmDel name={info.name} openModalDel={openModalDel} handleCloseModalDel={handleCloseModalDel} submitDelete={submitDelete} ></ModalConfirmDel>

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
            <Button onClick={backList} style={{marginBottom:'10px'}} variant="text" startIcon={<KeyboardBackspaceIcon />}>Thành viên</Button>

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
                        Tên thành viên
                    </div>
                    <div className={'text-info-content'}>
                        {info.name}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Loại thành viên
                    </div>
                    <div className={'text-info-content'}>
                        {info.type==='human'?'Cá nhân':'Công'}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Mô tả
                    </div>
                    <div className={'text-info-content'}>
                        {info.description}
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
                    <Button onClick={deleteMemberBtn}  color={'error'} style={{marginBottom:'10px'}} variant="outlined" >Xóa dữ liệu</Button>
                    <div className={'text-info-content'}>
                        Thao tác này sẽ xóa toàn bộ dữ liệu của bản ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
