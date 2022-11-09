import React, {useEffect, useState} from "react";
import {Button, Divider, Typography} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {useNavigate, useSearchParams} from "react-router-dom";
import apiManagerAssets from "../../api/manage-assets";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {currencyFormatter} from "../../constants/utils";
import Axios from "axios";
import API_MAP from "../../constants/api";
import FileDownload from "js-file-download";
import {useSelector} from "react-redux";

export default function DetailAsset(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [typeDefault, setTypeDefault] = useState(0)
    const [groupDefault, setGroupDefault] = useState(0)
    const [idDetail, setIdDetail] = useState(null)
    const [openModalDel, setOpenModalDel] = useState(false)
    const currentUser = useSelector(state => state.currentUser)

    const [info, setInfo] = useState({
        asset_name: '',
        asset_group: {id: 0},
        description: '',
        initial_value: '',
        capital_value: '',
        max_capital_value: '',
        current_credit_value: '',
        list_attachments: []
    })
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const backList = () => {
        navigate('/assets')
    }
    useEffect(() => {
        if (idDetail) {
            getListAssetsApi({id: idDetail, page_size: 1}).then(r => {
                setInfo(r.data.assets[0])
                console.log(r.data.assets[0])
            }).catch(e => {

            })
        }
    }, [idDetail])
    useEffect(() => {
        if (location.get('id')) {
            setIdDetail(location.get('id'));
        } else navigate('/assets')

    }, [location])
    const submitDelete = () => {
        // alert("tutt20")
        deleteAssetApi(info.id).then(r => {
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

        }).catch(e => {
            console.log(e)
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
    useEffect(() => {
        console.log("info", info)
    }, [info])

    const downloadFile = (e) => {
        if(e.attachment_type ==='REFERENCE'){
            window.open(e.download_link, '_blank');
        }
        else {
            Axios.get(e.download_link, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` },
                responseType: 'blob'
            }).then(response => {
                console.log('response.data',response.headers)
                let nameFile ;
                if(response.headers['content-disposition']){
                    nameFile = response.headers['content-disposition'].split(`"`)[1]
                    console.log("1",nameFile)

                }
                if(response.headers['Content-Disposition']){
                    nameFile = response.headers['Content-Disposition'].split(`"`)[1]
                    console.log("2",nameFile)

                }
                const url = window.URL || window.webkitURL;
                const href = url.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', nameFile); //or any other extension
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // FileDownload(response.data,nameFile);
            }).catch(e=>{
                console.log(e)
            })
        }




    }
    return (
        <div className={'main-content main-content-detail'}>
            {/*<div className={`loading ${false ? '' : ''}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
            {/*</div>*/}
            <ModalConfirmDel name={info.asset_name} openModalDel={openModalDel}
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
                    startIcon={<KeyboardBackspaceIcon/>}>Tài sản</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        {info.asset_name}
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
                <Divider light/>
                {
                    info.list_attachments.map((e, i) => (
                        <div style={{cursor: "pointer"}} className={'row-detail'}
                             onClick={() => downloadFile(e)}>
                            <div className={'text-info-content text-decoration'}>
                                {e.file_name||e.download_link}
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
                    <Button onClick={deleteAssetBtn} color={'error'} style={{marginBottom: '10px'}} variant="outlined">Xóa
                        dữ liệu</Button>
                    <div className={'text-info-content'}>
                        Thao tác này sẽ xóa toàn bộ dữ liệu của bản ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
