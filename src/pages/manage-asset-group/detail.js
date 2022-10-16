import React, {useEffect, useState} from "react";
import {Button, Divider, Typography} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import apiManagerCategory from "../../api/manage-category";
import apiManagerAssetGroup from "../../api/manage-asset-group";

export default function DetailCompany(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [listChild, setListChild] = useState([]);
    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [typeDefault, setTypeDefault] = useState(0)
    const [groupDefault, setGroupDefault] = useState(0)
    const [idDetail, setIdDetail] = useState(null)
    const [openModalDel, setOpenModalDel] = useState(false)

    const [info, setInfo] = useState({
        id: 0,
        group_name: '',
        description: '',
        parent_id: '',
        parent_asset_group: {}
    })
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const backList = () => {
        navigate('/asset-group')
    }
    useEffect(() => {
        if (idDetail) {
            getLisAssetGroupApi({id: idDetail, page_size: 1}).then(r => {
                if (r.data.asset_groups.length > 0) {
                    setInfo(r.data.asset_groups[0])
                } else navigate('/asset-group')
                console.log(r.data.asset_groups[0])
            }).catch(e => {

            })
            getLisAssetGroupApi({parent_id: idDetail, paging: false, page_size: 50}).then(r => {
                if (r.data.asset_groups) {
                    setListChild(r.data.asset_groups)
                } else setListChild([])
            }).catch(e => {

            })
        }
    }, [idDetail])
    useEffect(() => {
        if (location.get('id')) {
            setIdDetail(location.get('id'));
        } else navigate('/asset-group')

    }, [location])
    const submitDelete = () => {
        // alert("tutt20")
        deleteAssetGroupApi(info.id).then(r => {
            toast.success('Xóa thành công', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                navigate(`/asset-group`)
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
    const getLisAssetGroupApi = (data) => {
        return apiManagerAssetGroup.getListAssetGroup(data);
    }

    const update = () => {
        navigate(`/asset-group/update?id=${idDetail}`)
    }

    const deleteAssetGroupBtn = () => {
        setOpenModalDel(true)
    }
    const deleteAssetGroupApi = (id) => {
        return apiManagerAssetGroup.deleteAssetGroup(id);
    }
    const redirectOther = (id) => {
        navigate(`/asset-group/detail?id=${id}`)
    }
    useEffect(() => {
        console.log("info", info)
    }, [info])
    return (
        <div className={'main-content main-content-detail'}>
            {/*<div className={`loading ${false ? '' : ''}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
            {/*</div>*/}
            <ModalConfirmDel name={info.group_name} openModalDel={openModalDel}
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
                    startIcon={<KeyboardBackspaceIcon/>}>Nhóm tài sản</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        {info.group_name}
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
                        Tên nhóm tài sản
                    </div>
                    <div className={'text-info-content'}>
                        {info.group_name}
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
                {info.parent_asset_group ?
                    <>
                        <div className={`row-detail`}>
                            <div className={'text-info-tittle'}>
                                Nhóm tài sản cha
                            </div>
                            <div className={'text-info-content text-decoration'}
                                 onClick={() => redirectOther(info.parent_asset_group.id)}>
                                {info.parent_asset_group.group_name}
                            </div>
                        </div>
                        <Divider></Divider>
                    </>
                    : ''
                }

                <Divider></Divider>

            </div>
            <div className={`main-content-body ${listChild.length>0?'':'hidden'}`}>
                <div className={'main-content-body-tittle'}>
                    <h4>Danh sách hạng mục con</h4>
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
                                    {e.group_name}
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
                <Divider light/>
                <div style={{padding: '20px'}}>
                    <Button onClick={deleteAssetGroupBtn} color={'error'} style={{marginBottom: '10px'}}
                            variant="outlined">Xóa dữ liệu</Button>
                    <div className={'text-info-content'}>
                        Thao tác này sẽ xóa toàn bộ dữ liệu của bản ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
