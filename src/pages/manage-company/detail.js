import React, {useEffect, useState} from "react";
import {Button, Divider, FormControl, MenuItem, Select, Tooltip, Typography} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {checkColumnVisibility, currencyFormatter} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import AddIcon from "@mui/icons-material/Add";
import {DataGrid, GridColDef, viVN} from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import apiManagerMember from "../../api/manage-member";
import ModalAddMember from "./modal-add-member";
import ModalEditHistory from "./modal-edit-histoty";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ModalAddShareholder from "./modal-add-shareholder";
import ModalAddCouncil from "./modal-add-council";

export default function DetailCategory(props) {
    const navigate = useNavigate();
    const [location,setLocation] = useSearchParams();
    const [idDetail,setIdDetail] = useState(null)
    const [idUpdateHistory,setIdUpdateHistory] = useState(0)
    const [openModalDel,setOpenModalDel] = useState(false)
    const [listMember, setListMember] = useState([]);
    const [listHistory, setListHistory] = useState([]);
    const [listShareholder, setListShareholder] = useState([]);
    const [listCouncil, setListCouncil] = useState([]);
    const [isRefresh,setIsRefresh] = useState(false)
    const [openModalAddMember,setOpenModalAddMember] = useState(false)
    const [openModalAddCouncil,setOpenModalAddCouncil] = useState(false)
    const [openModalAddHistory,setOpenModalAddHistory] = useState(false)
    const [openModalAddShareholder,setOpenModalAddShareholder] = useState(false)
    const [isAddHistory,setIsAddHistory] = useState(false)
    const [openModalRemoveMember,setOpenModalRemoveMember] = useState(false)
    const [openModalRemoveShareholder,setOpenModalRemoveShareholder] = useState(false)
    const [openModalRemoveHistory,setOpenModalRemoveHistory] = useState(false)
    const [idRemoveMember,setIdRemoveMember] = useState(0)
    const [idRemoveHistory,setIdRemoveHistory] = useState(0)
    const [idRemoveShareholder,setIdRemoveShareholder] = useState(0)


    const [info,setInfo] =useState({
        company_name:'',
        address:'',
        contact_detail:'',
        tax_number:'',
        charter_capital:'',
        capital_limit:'',
        founding_date:'',
        collateral:'',
        member:{}
    })
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const handleCloseModalAddHistory = () => {
        setOpenModalAddHistory(false)
    }
    const backList = () => {
        navigate('/company')
    }
    const redirectToMember = (id) => {
        navigate('/member/detail?id='+id)
    }
    const handleChangePosition = (e,row) => {
        // updateCompanyMemberApi
        console.log(e.target.value);
        row.position = e.target.value
        updateCompanyMemberApi(row).then(r => {
            setIsRefresh(!isRefresh)
            toast.success('C???p nh???t th??nh c??ng', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }).catch(e => {
            console.log(e)
        })
    }
    const handleChangePositionShareholder = (e,row) => {
        // updateCompanyMemberApi
        console.log(e.target.value);
        row.position = e.target.value
        updateCompanyShareholderApi(row).then(r => {
            setIsRefresh(!isRefresh)
            toast.success('C???p nh???t th??nh c??ng', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }).catch(e => {
            console.log(e)
        })
    }
    const updateCompanyMemberApi = (data) => {
        return apiManagerCompany.updateCompanyMember(data);
    }
    const updateCompanyShareholderApi = (data) => {
        return apiManagerCompany.updateCompanyShareholder(data);
    }
    const columnsMember: GridColDef[] = [
        {
            sortable: false,
            field: 'index',
            headerName: 'STT',
            maxWidth: 60,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            field: 'name',
            headerName: 'T??n th??nh vi??n ban ??i???u h??nh',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex:1,
            renderCell: (params) => {
                return <div className='content-column text-decoration' onClick={()=>redirectToMember(params.row.member_id)}>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'position',
            headerName: 'V??? tr??',
            headerClassName: 'super-app-theme--header',
            minWidth: 200,
            hide: checkColumnVisibility('company','tax_number'),
            renderCell: (params) => {
                return <div className='content-column'>
                    <FormControl fullWidth>
                        <Select
                            className={''}
                            size={'small'}
                            value={params.value}
                            onChange={(e)=>handleChangePosition(e,params.row)}
                            // size='small'
                        >
                            <MenuItem value={'TG??'}>T???ng gi??m ?????c</MenuItem>
                            <MenuItem value={'PTG??'}>Ph?? t???ng gi??m ?????c</MenuItem>
                            <MenuItem value={'KTT'}>K??? to??n tr?????ng</MenuItem>

                        </Select>
                    </FormControl>
                </div>;
            },
        },
        {
            field: 'action',
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('company','action'),
            headerName: 'Thao t??c',
            sortable: false,
            width: 200,
            align: 'center',
            maxWidth: 130,
            // flex: 1,
            renderCell: (params) => {

                const deleteBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    // setIsDelList(false)
                    // setOpenModalDel(true)
                    // setInfoDel(params.row)
                    setOpenModalRemoveMember(true)
                    setIdRemoveMember(params.id)
                }

                return <div className='icon-action'>
                    <Tooltip title="X??a" onClick={deleteBtn}>
                        <DeleteOutlineIcon style={{color: "rgb(107, 114, 128)"}}></DeleteOutlineIcon>
                    </Tooltip>
                </div>;
            },
        },

        // { field: 'document', headerName: 'Nh??m t??i s???n' },
    ];
    const columnsCouncil: GridColDef[] = [
        {
            sortable: false,
            field: 'index',
            headerName: 'STT',
            maxWidth: 60,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            field: 'name',
            headerName: 'T??n th??nh vi??n ban ??i???u h??nh',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex:1,
            renderCell: (params) => {
                return <div className='content-column text-decoration' onClick={()=>redirectToMember(params.row.member_id)}>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'position',
            headerName: 'V??? tr??',
            headerClassName: 'super-app-theme--header',
            minWidth: 200,
            hide: checkColumnVisibility('company','tax_number'),
            renderCell: (params) => {
                return <div className='content-column'>
                    <FormControl fullWidth>
                        <Select
                            className={''}
                            size={'small'}
                            value={params.value}
                            onChange={(e)=>handleChangePosition(e,params.row)}
                            // size='small'
                        >
                            <MenuItem value={'CT'}>Ch??? t???ch</MenuItem>
                            <MenuItem value={'PCT'}>Ph?? ch??? t???ch</MenuItem>
                            <MenuItem value={'H??QT'}>H???i ?????ng qu???n tr???</MenuItem>

                        </Select>
                    </FormControl>
                </div>;
            },
        },
        {
            field: 'action',
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('company','action'),
            headerName: 'Thao t??c',
            sortable: false,
            width: 200,
            align: 'center',
            maxWidth: 130,
            // flex: 1,
            renderCell: (params) => {

                const deleteBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    // setIsDelList(false)
                    // setOpenModalDel(true)
                    // setInfoDel(params.row)
                    setOpenModalRemoveMember(true)
                    setIdRemoveMember(params.id)
                }

                return <div className='icon-action'>
                    <Tooltip title="X??a" onClick={deleteBtn}>
                        <DeleteOutlineIcon style={{color: "rgb(107, 114, 128)"}}></DeleteOutlineIcon>
                    </Tooltip>
                </div>;
            },
        },

        // { field: 'document', headerName: 'Nh??m t??i s???n' },
    ];
    const columnsHistory: GridColDef[] = [
        {
            sortable: false,
            field: 'index',
            headerName: 'STT',
            maxWidth: 60,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            field: 'change_date',
            headerName: 'Ng??y thay ?????i',
            headerClassName: 'super-app-theme--header',
            minWidth: 300,
            renderCell: (params) => {
                return <div className='content-column '>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'changing_content',
            headerName: 'N???i dung thay ?????i',
            headerClassName: 'super-app-theme--header',
            minWidth: 200,
            flex:1,
            hide: checkColumnVisibility('company','tax_number'),
            renderCell: (params) => {
                return <div className='content-column '>
                    {params.value}
                </div>;
            },
        },
        {
            field: 'action',
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('company','action'),
            headerName: 'Thao t??c',
            sortable: false,
            width: 200,
            align: 'center',
            maxWidth: 130,
            // flex: 1,
            renderCell: (params) => {

                const deleteBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    // setIsDelList(false)
                    // setOpenModalDel(true)
                    // setInfoDel(params.row)
                    setIsAddHistory(true);
                    setOpenModalRemoveHistory(true)
                    setIdRemoveHistory(params.id)
                }

                const updateBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    // setIsDelList(false)
                    // setOpenModalDel(true)
                    // setInfoDel(params.row)
                    setIsAddHistory(false);
                    setIdUpdateHistory(params.id)
                    setOpenModalAddHistory(true)
                }
                return <div className='icon-action'>
                    <Tooltip title="C???p nh???t" onClick={updateBtn}>
                        <EditOutlinedIcon style={{color: "rgb(107, 114, 128)"}}></EditOutlinedIcon>
                    </Tooltip>
                    <Tooltip title="X??a" onClick={deleteBtn}>
                        <DeleteOutlineIcon style={{color: "rgb(107, 114, 128)"}}></DeleteOutlineIcon>
                    </Tooltip>
                </div>;
            },
        },

        // { field: 'document', headerName: 'Nh??m t??i s???n' },
    ];
    const columnsShareholder: GridColDef[] = [
        {
            sortable: false,
            field: 'index',
            headerName: 'STT',
            maxWidth: 60,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            field: 'name',
            headerName: 'T??n c??? ????ng',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex:1,
            renderCell: (params) => {
                return <div className='content-column text-decoration' onClick={()=>redirectToMember(params.row.member_id)}>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'position',
            headerName: 'V??? tr??',
            headerClassName: 'super-app-theme--header',
            minWidth: 200,
            hide: checkColumnVisibility('company','tax_number'),
            renderCell: (params) => {
                return <div className='content-column'>
                    <FormControl fullWidth>
                        <Select
                            className={''}
                            size={'small'}
                            value={params.value}
                            onChange={(e)=>handleChangePositionShareholder(e,params.row)}
                            // size='small'
                        >
                            <MenuItem value={'CTH??QT'}>Ch??? t???ch h???i ?????ng qu???n tr???</MenuItem>
                            <MenuItem value={'PCTH??QT'}>Ph?? ch??? t???ch h???i ?????ng qu???n tr???</MenuItem>
                            <MenuItem value={'C??'}>C??? ????ng</MenuItem>

                        </Select>
                    </FormControl>
                </div>;
            },
        },
        {
            field: 'action',
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('company','action'),
            headerName: 'Thao t??c',
            sortable: false,
            width: 200,
            align: 'center',
            maxWidth: 130,
            // flex: 1,
            renderCell: (params) => {

                const deleteBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    // setIsDelList(false)
                    // setOpenModalDel(true)
                    // setInfoDel(params.row)
                    setOpenModalRemoveShareholder(true)
                    setIdRemoveShareholder(params.id)
                }

                return <div className='icon-action'>
                    <Tooltip title="X??a" onClick={deleteBtn}>
                        <DeleteOutlineIcon style={{color: "rgb(107, 114, 128)"}}></DeleteOutlineIcon>
                    </Tooltip>
                </div>;
            },
        },

        // { field: 'document', headerName: 'Nh??m t??i s???n' },
    ];

    useEffect(()=>{
        if(idDetail){
            getListCompanyApi({id:idDetail,page_size:1}).then(r=>{
                setInfo( r.data.companies[0])
                console.log(r.data.companies[0])
            }).catch(e=>{

            })
            getChangeHistoryApi(idDetail).then(r=>{
                console.log("history",r)
                setListHistory(r.data)

            })
            getMemberApi(idDetail).then(r=>{
                console.log("member",r)
                console.log("r.data",r.data)
                let memberList = r.data.filter(e => e.type === 'TV')
                let councilList = r.data.filter(e => e.type === 'H??QT')
                setListMember(memberList)
                setListCouncil(councilList)
            })
            getShareholderApi(idDetail).then(r=>{
                console.log("member",r)
                setListShareholder(r.data)
            })
        }
    },[idDetail,isRefresh])
    useEffect(()=>{
        if(location.get('id')){
            setIdDetail(location.get('id'));
        }
        else navigate('/company')

    },[location])
    const submitDelete = () => {
        // alert("tutt20")
        deleteCompanyApi(info.id).then(r=>{
            toast.success('X??a th??nh c??ng', {
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

    useEffect(()=>{
        console.log("info",info)
    },[info])

    const submitRemove = () => {
        // alert("tutt20")
        removeMemberFromCompanyApi(idRemoveMember).then(r => {
            toast.success('X??a th??nh c??ng', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setIsRefresh(!isRefresh)
        }).catch(e => {
            console.log(e)
        })

    }
    const submitDeleteHistory = () => {
        // alert("tutt20")
        removeHistoryApi(idRemoveHistory).then(r => {
            toast.success('X??a th??nh c??ng', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setIsRefresh(!isRefresh)
        }).catch(e => {
            console.log(e)
        })

    }
    const submitDeleteShareholder = () => {
        // alert("tutt20")
        removeShareholderApi(idRemoveShareholder).then(r => {
            toast.success('X??a th??nh c??ng', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setIsRefresh(!isRefresh)
        }).catch(e => {
            console.log(e)
        })

    }
    const handleCloseModalRemoveMember = () => {
        setOpenModalRemoveMember(false)
    }
    const handleCloseModalAddMember = () => {
        setOpenModalAddMember(false)
    }
    const handleCloseModalAddCouncil = () => {
        setOpenModalAddCouncil(false)
    }
    const handleCloseModalRemoveHistory = () => {
        setOpenModalRemoveHistory(false)
    }
    const handleCloseModalRemoveShareholder = () => {
        setOpenModalRemoveShareholder(false)
    }
    const handleCloseModalAddShareholder = () => {
        setOpenModalAddShareholder(false)
    }
    const deleteCompanyApi = (id) => {
        return apiManagerCompany.deleteCompany(id);
    }
    const getChangeHistoryApi = (id) => {
        return apiManagerCompany.getChangeHistory(id);
    }
    const getMemberApi = (id) => {
        return apiManagerCompany.getMember(id);
    }
    const removeMemberFromCompanyApi = (id) => {
        return apiManagerMember.removeMemberFromCompany(id);
    }
    const removeHistoryApi = (id) => {
        return apiManagerCompany.deleteChangeHistory(id);
    }

    const removeShareholderApi = (id) => {
        return apiManagerCompany.removeShareHolder(id);
    }
    const getShareholderApi = (id) => {
        return apiManagerCompany.getShareHolder(id);
    }

    return (
        <div className={'main-content main-content-detail'}>
            {/*<div className={`loading ${false ? '' : ''}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
            {/*</div>*/}
            {/*<ModalConfirmDel name={info.company_name} openModalDel={openModalDel} handleCloseModalDel={handleCloseModalDel} submitDelete={submitDelete} ></ModalConfirmDel>*/}
            {/*<ModalConfirmDel openModalDel={openModalRemoveMember} handleCloseModalDel={handleCloseModalRemoveMember} submitDelete={submitRemove} ></ModalConfirmDel>*/}
            {/*<ModalConfirmDel openModalDel={openModalRemoveHistory} handleCloseModalDel={handleCloseModalRemoveHistory} submitDelete={submitDeleteHistory} ></ModalConfirmDel>*/}
            {/*<ModalConfirmDel openModalDel={openModalRemoveShareholder} handleCloseModalDel={handleCloseModalRemoveShareholder} submitDelete={submitDeleteShareholder} ></ModalConfirmDel>*/}
            {/*<ModalAddMember isRefresh={isRefresh} setIsRefresh={setIsRefresh} openModalAddMember={openModalAddMember} handleCloseModalAddMember={handleCloseModalAddMember} companyId={idDetail}></ModalAddMember>*/}
            {/*<ModalAddCouncil isRefresh={isRefresh} setIsRefresh={setIsRefresh} openModalAddCouncil={openModalAddCouncil} handleCloseModalAddCouncil={handleCloseModalAddCouncil} companyId={idDetail}></ModalAddCouncil>*/}
            {/*<ModalAddShareholder isRefresh={isRefresh} setIsRefresh={setIsRefresh} openModalAddShareholder={openModalAddShareholder} handleCloseModalAddShareholder={handleCloseModalAddShareholder} companyId={idDetail}></ModalAddShareholder>*/}
            {/*<ModalEditHistory idUpdateHistory={idUpdateHistory} isRefresh={isRefresh} setIsRefresh={setIsRefresh} openModalAddHistory={openModalAddHistory} handleCloseModalAddHistory={handleCloseModalAddHistory} isAddHistory={isAddHistory} companyId={idDetail}></ModalEditHistory>*/}

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
            <Button onClick={backList} style={{marginBottom:'10px'}} variant="text" startIcon={<KeyboardBackspaceIcon />}>C??ng ty</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent:'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        {info.company_name}
                    </Typography>
                    <Button onClick={update} style={{marginBottom:'10px'}} variant="outlined" startIcon={<BorderColorOutlinedIcon />}>C???p nh???t</Button>

                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Th??ng tin chi ti???t</h4>
                </div>
                <Divider light />
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        T??n c??ng ty
                    </div>
                    <div className={'text-info-content'}>
                        {info.company_name}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Lo???i c??ng ty
                    </div>
                    <div className={'text-info-content'}>
                        {info.company_type==='SUPPLIER'?'C??ng ty cho vay':'C??ng ty vay'}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        T??i s???n ?????m b???o
                    </div>
                    <div className={'text-info-content'}>
                        {info.collateral}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Ng?????i ?????i di???n ph??p lu???t
                    </div>
                    <div className={'text-info-content text-decoration'} onClick={()=>{navigate(`/member/detail?id=${info.member.id}`)}}>
                        {info.member?info.member.name:''}
                    </div>
                </div>
                <Divider></Divider>

                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        ?????i ch???
                    </div>
                    <div className={'text-info-content'}>
                        {info.address}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Th??ng tin li??n h???
                    </div>
                    <div className={'text-info-content'}>
                        {info.contact_detail}

                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        M?? s??? thu???
                    </div>
                    <div className={'text-info-content'}>
                        {info.tax_number}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        V???n ??i???u l???
                    </div>
                    <div className={'text-info-content'}>
                        {currencyFormatter(info.charter_capital)}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                       S??? ti???n vay t???i ??a
                    </div>
                    <div className={'text-info-content'}>
                        {currencyFormatter(info.capital_limit)}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Ng??y th??nh l???p
                    </div>
                    <div className={'text-info-content'}>
                        {info.founding_date}
                    </div>
                </div>
                <Divider></Divider>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Qu???n l??</h4>
                </div>
                <Divider light />
                <div style={{padding:'20px'}}>
                    <Button onClick={deleteCompanyBtn}  color={'error'} style={{marginBottom:'10px'}} variant="outlined" >X??a d??? li???u</Button>
                    <div className={'text-info-content'}>
                        Thao t??c n??y s??? x??a to??n b??? d??? li???u c???a b???n ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
