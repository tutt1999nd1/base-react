import React, {useEffect, useState} from "react";
import {Button, Divider, Typography} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import apiManagerCategory from "../../api/manage-category";

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
        category_name: '',
        description: '',
        parent_id: '',
        parent_category: {}
    })
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const backList = () => {
        navigate('/category')
    }
    useEffect(() => {
        if (idDetail) {
            getLisCategoryApi({id: idDetail, page_size: 1}).then(r => {
                if (r.data.categories.length > 0) {
                    setInfo(r.data.categories[0])
                } else navigate('/category')
                console.log(r.data.categories[0])
            }).catch(e => {

            })
            getLisCategoryApi({parent_id: idDetail, paging: false, page_size: 50}).then(r => {
                if (r.data.categories) {
                    setListChild(r.data.categories)
                } else setListChild([])
            }).catch(e => {

            })
        }
    }, [idDetail])
    useEffect(() => {
        if (location.get('id')) {
            setIdDetail(location.get('id'));
        } else navigate('/category')

    }, [location])
    const submitDelete = () => {
        // alert("tutt20")
        deleteCategoryApi(info.id).then(r => {
            toast.success('X??a th??nh c??ng', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                navigate(`/category`)
            }, 1050);

        }).catch(e => {
            console.log(e)
        })

    }
    const getLisCategoryApi = (data) => {
        return apiManagerCategory.getListCategory(data);
    }

    const update = () => {
        navigate(`/category/update?id=${idDetail}`)
    }

    const deleteCategoryBtn = () => {
        setOpenModalDel(true)
    }
    const deleteCategoryApi = (id) => {
        return apiManagerCategory.deleteCategory(id);
    }
    const redirectOther = (id) => {
        navigate(`/category/detail?id=${id}`)
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
            <ModalConfirmDel name={info.category_name} openModalDel={openModalDel}
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
                    startIcon={<KeyboardBackspaceIcon/>}>H???ng m???c</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        {info.category_name}
                    </Typography>
                    <Button onClick={update} style={{marginBottom: '10px'}} variant="outlined"
                            startIcon={<BorderColorOutlinedIcon/>}>C???p nh???t</Button>

                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Th??ng tin chi ti???t</h4>
                </div>
                <Divider light/>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        T??n h???ng m???c
                    </div>
                    <div className={'text-info-content'}>
                        {info.category_name}
                    </div>
                </div>
                <Divider></Divider>

                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        M?? t???
                    </div>
                    <div className={'text-info-content'}>
                        {info.description}
                    </div>
                </div>
                <Divider></Divider>
                {info.parent_category ?
                    <>
                        <div className={`row-detail`}>
                            <div className={'text-info-tittle'}>
                                H???ng m???c cha
                            </div>
                            <div className={'text-info-content text-decoration'}
                                 onClick={() => redirectOther(info.parent_category.id)}>
                                {info.parent_category.category_name}
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
                    <h4>Danh s??ch h???ng m???c con</h4>
                </div>
                <Divider light />
                {
                    listChild.map((e)=>(
                        <>
                            <div className={'row-detail'}>
                                <div className={'text-info-tittle'}>
                                    T??n m???c ????ch
                                </div>
                                <div className={'text-info-content text-decoration'} onClick={()=>redirectOther(e.id)}>
                                    {e.category_name}
                                </div>
                            </div>
                            <Divider></Divider>
                        </>
                    ))
                }



            </div>

            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Qu???n l??</h4>
                </div>
                <Divider light/>
                <div style={{padding: '20px'}}>
                    <Button onClick={deleteCategoryBtn} color={'error'} style={{marginBottom: '10px'}}
                            variant="outlined">X??a d??? li???u</Button>
                    <div className={'text-info-content'}>
                        Thao t??c n??y s??? x??a to??n b??? d??? li???u c???a b???n ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
