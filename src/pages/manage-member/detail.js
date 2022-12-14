import React, {useEffect, useState} from "react";
import {Button, Divider, FormControl, FormHelperText, MenuItem, Select, Tooltip, Typography} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {changeVisibilityTableAll, checkColumnVisibility, currencyFormatter} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import apiManagerMember from "../../api/manage-member";
import {DataGrid, GridColDef, viVN} from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import ModalAddMember from "./modal-add-member";

export default function DetailMember(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [idDetail, setIdDetail] = useState(null)
    const [openModalDel, setOpenModalDel] = useState(false)
    const [openModalRemove, setOpenModalRemove] = useState(false)
    const [openModalAddMember, setOpenModalAddMember] = useState(false)
    const [isRefresh, setIsRefresh] = useState(false)
    const [listCompany, setListCompany] = React.useState([]);
    const [idRemove, setIdRemove] = useState(0)
    const redirectToCompany = (id) => {
        navigate('/company/detail?id=' + id)
    }
    const [info, setInfo] = useState({
        name: '',
        description: '',
        type: '',
    })
    const columns: GridColDef[] = [
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
            field: 'company_name',
            headerName: 'T??n c??ng ty',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {
                return <div className='content-column text-decoration'
                            onClick={() => redirectToCompany(params.row.company_id)}>
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
            hide: checkColumnVisibility('company', 'tax_number'),
            renderCell: (params) => {

                return <div className='content-column'>
                    <FormControl fullWidth>
                        <Select
                            className={''}
                            size={'small'}
                            value={params.value}
                            onChange={(e) => handleChangePosition(e, params.row)}
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
            hide: checkColumnVisibility('company', 'action'),
            headerName: 'Thao t??c',
            sortable: false,
            width: 200,
            align: 'center',
            maxWidth: 130,
            // flex: 1,
            renderCell: (params) => {

                const detailBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    navigate(`/company/detail?id=${params.id}`)

                }
                const deleteBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    // setIsDelList(false)
                    // setOpenModalDel(true)
                    // setInfoDel(params.row)
                    setOpenModalRemove(true)
                    setIdRemove(params.id)
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
    const handleCloseModalRemove = () => {
        setOpenModalRemove(false)
    }
    const handleCloseModalAddMember = () => {
        setOpenModalAddMember(false)
    }
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const handleChangePosition = (e, row) => {
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
    const backList = () => {
        navigate('/member')
    }
    useEffect(() => {
        if (idDetail) {
            getListMemberApi({id: idDetail, page_size: 1}).then(r => {
                setInfo(r.data.member_entities[0])
            }).catch(e => {

            })
            getListCompanyOfMemberApi(idDetail).then(r => {
                console.log("Company of Member", r)
                setListCompany(r.data);
            }).catch(e => {

            })

        }
    }, [idDetail, isRefresh])
    useEffect(() => {
        if (location.get('id')) {
            setIdDetail(location.get('id'));
        } else navigate('/member')

    }, [location])
    const submitDelete = () => {
        // alert("tutt20")
        deleteMemberApi(info.id).then(r => {
            toast.success('X??a th??nh c??ng', {
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

        }).catch(e => {
            console.log(e)
        })

    }
    const submitRemove = () => {
        // alert("tutt20")
        removeMemberFromCompanyApi(idRemove).then(r => {
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

    const getListMemberApi = (data) => {
        return apiManagerMember.getListMember(data);
    }
    const getListCompanyOfMemberApi = (id) => {
        return apiManagerMember.getCompanyOfMember(id);
    }
    const updateCompanyMemberApi = (data) => {
        return apiManagerCompany.updateCompanyMember(data);
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
    const removeMemberFromCompanyApi = (id) => {
        return apiManagerMember.removeMemberFromCompany(id);
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
            <ModalConfirmDel name={info.name} openModalDel={openModalDel} handleCloseModalDel={handleCloseModalDel}
                             submitDelete={submitDelete}></ModalConfirmDel>
            <ModalConfirmDel openModalDel={openModalRemove} handleCloseModalDel={handleCloseModalRemove}
                             submitDelete={submitRemove}></ModalConfirmDel>
            <ModalAddMember isRefresh={isRefresh} setIsRefresh={setIsRefresh} openModalAddMember={openModalAddMember}
                            handleCloseModalAddMember={handleCloseModalAddMember} memberId={idDetail}></ModalAddMember>

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
                    startIcon={<KeyboardBackspaceIcon/>}>Th??nh vi??n</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        {info.asset_name}
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
                        T??n th??nh vi??n
                    </div>
                    <div className={'text-info-content'}>
                        {info.name}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Lo???i th??nh vi??n
                    </div>
                    <div className={'text-info-content'}>
                        {info.type === 'human' ? 'C?? nh??n' : 'C??ng'}
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

            </div>
            {/*<div className={'main-content-body'}>*/}
            {/*    <div className={'main-content-body-tittle'}>*/}
            {/*        <h4>Danh s??ch c??ng ty</h4>*/}
            {/*        <div>*/}
            {/*            <Button variant="outlined" onClick={() => {*/}
            {/*                setOpenModalAddMember(true)*/}
            {/*            }} startIcon={<AddIcon/>}>*/}
            {/*                Th??m th??nh vi??n v??o c??ng ty*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div style={{height: '400px', width: '100%', marginTop: '10px'}}>*/}

            {/*        <DataGrid*/}
            {/*            // getRowHeight={() => 'auto'}*/}
            {/*            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}*/}
            {/*            labelRowsPerPage={"S??? k???t qu???"}*/}
            {/*            density="standard"*/}
            {/*            rows={listCompany}*/}
            {/*            columns={columns}*/}
            {/*            pageSize={5}*/}
            {/*            rowsPerPageOptions={[5]}*/}
            {/*            // loading={loading}*/}
            {/*            disableSelectionOnClick*/}
            {/*            sx={{*/}
            {/*                // boxShadow: 2,*/}
            {/*                overflowX: 'scroll',*/}
            {/*                border: 1,*/}
            {/*                borderColor: 'rgb(255, 255, 255)',*/}
            {/*                '& .MuiDataGrid-iconSeparator': {*/}
            {/*                    display: 'none',*/}
            {/*                }*/}
            {/*            }}*/}

            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Qu???n l??</h4>
                </div>
                <Divider light/>
                <div style={{padding: '20px'}}>
                    <Button onClick={deleteMemberBtn} color={'error'} style={{marginBottom: '10px'}} variant="outlined">X??a
                        d??? li???u</Button>
                    <div className={'text-info-content'}>
                        Thao t??c n??y s??? x??a to??n b??? d??? li???u c???a b???n ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
