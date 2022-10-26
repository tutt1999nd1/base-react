import React, {useEffect, useState} from "react";
import {Button, Divider, Typography} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {currencyFormatter} from "../../constants/utils";
import apiManagerCampaign from "../../api/manage-campaign";

export default function DetailCampaign(props) {
    const navigate = useNavigate();
    const [location,setLocation] = useSearchParams();

    const [listGroup,setListGroup] =useState([]);
    const [listChild,setListChild] =useState([]);
    const [listType,setListType] =useState([]);
    const [typeDefault,setTypeDefault] = useState(0)
    const [groupDefault,setGroupDefault] = useState(0)
    const [idDetail,setIdDetail] = useState(null)
    const [openModalDel,setOpenModalDel] = useState(false)

    const [info,setInfo] =useState({
        id:0,
        campaign_name:'',
        amount:0,
        description:'',
        status:'',
        parent_id:'',
        parent_campaign:{}
    })
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const backList = () => {
        navigate('/campaign')
    }
    useEffect(()=>{
        if(idDetail){
            getListCampaignApi({id:idDetail,page_size:1}).then(r=>{
                if(r.data.campaigns.length>0){
                    setInfo( r.data.campaigns[0])
                }
                else navigate('/campaign')
                console.log(r.data.campaigns[0])
            }).catch(e=>{

            })
            getListCampaignApi({parent_id:idDetail,paging:false,page_size:100}).then(r=>{
                if(r.data.campaigns){
                    setListChild(r.data.campaigns)
                }
                else setListChild([])
            }).catch(e=>{

            })

        }
    },[idDetail])
    useEffect(()=>{
        if(location.get('id')){
            setIdDetail(location.get('id'));
        }
        else navigate('/campaign')

    },[location])
    const submitDelete = () => {
        deleteCampaignApi(info.id).then(r=>{
            toast.success('Xóa thành công', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                navigate(`/campaign`)
            }, 1050);

        }).catch(e=>{
            console.log(e)
        })

    }
    const getListCampaignApi = (data) => {
        return apiManagerCampaign.getListCampaign(data);
    }

    const update = () => {
        navigate(`/campaign/update?id=${idDetail}`)
    }

    const deleteCampaignBtn = () => {
        setOpenModalDel(true)
    }
    const deleteCampaignApi = (id) => {
        return apiManagerCampaign.deleteCampaign(id);
    }
    const redirectOther = (id) => {
      navigate(`/campaign/detail?id=${id}`)
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
            <ModalConfirmDel name={info.campaign_name} openModalDel={openModalDel} handleCloseModalDel={handleCloseModalDel} submitDelete={submitDelete} ></ModalConfirmDel>

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
            <Button onClick={backList} style={{marginBottom:'10px'}} variant="text" startIcon={<KeyboardBackspaceIcon />}>Mục đích vay</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent:'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        {info.campaign_name}
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
                        Tên mục đích vay
                    </div>
                    <div className={'text-info-content'}>
                        {info.campaign_name}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Số tiền vay
                    </div>
                    <div className={'text-info-content'}>
                        {currencyFormatter(info.amount)}
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

                {info.parent_campaign?
                <>
                    <div className={`row-detail`}>
                        <div className={'text-info-tittle'}>
                            Mục đích vay cha
                        </div>
                        <div className={'text-info-content text-decoration'} onClick={()=>redirectOther(info.parent_campaign.id)}>
                            {info.parent_campaign.campaign_name}
                        </div>
                    </div>
                    <Divider></Divider>
                </>
                    :''
                }


            </div>
            <div className={`main-content-body ${listChild.length>0?'':'hidden'}`}>
                <div className={'main-content-body-tittle'}>
                    <h4>Danh sách mục đích vay con</h4>
                </div>
                <Divider light />
                {
                    listChild.map((e)=>(
                        <>
                            <div className={'row-detail'}>
                                <div className={'text-info-tittle'}>
                                    Tên mục đích
                                </div>
                                <div className={'text-info-content text-decoration'} onClick={()=>redirectOther(e.id)}>
                                    {e.campaign_name}
                                </div>
                            </div>
                            <Divider></Divider>
                        </>
                    ))
                }



            </div>

            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Quản lý</h4>
                </div>
                <Divider light />
                <div style={{padding:'20px'}}>
                    <Button onClick={deleteCampaignBtn}  color={'error'} style={{marginBottom:'10px'}} variant="outlined" >Xóa dữ liệu</Button>
                    <div className={'text-info-content'}>
                        Thao tác này sẽ xóa toàn bộ dữ liệu của bản ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
