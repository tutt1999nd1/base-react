import React, {useEffect, useState} from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {
    Autocomplete,
    Button,
    Collapse,
    Divider,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import {toast, ToastContainer} from "react-toastify";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Highlighter from "react-highlight-words";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HistoryIcon from '@mui/icons-material/History';
import {DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, viVN} from "@mui/x-data-grid";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


import {useNavigate} from "react-router-dom";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {
    capitalizeFirstLetter,
    changeVisibilityTableAll,
    checkColumnVisibility,
    convertToAutoComplete,
    currencyFormatter,
    pending,
    typeToName, VNnum2words
} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {useSelector} from "react-redux";
import Axios from "axios";
import API_MAP from "../../constants/api";
import FileDownload from "js-file-download";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import apiManagerMember from "../../api/manage-member";
import ModalViewSelected from "./modal-view-selected";
import {NumericFormat} from "react-number-format";

export default function ManageCompany() {
    const currentUser = useSelector(state => state.currentUser)
    const [openSearch, setOpenSearch] = useState(true)
    const [openUpdate, setOpenUpdate] = useState(true)
    const [openModalViewSelected, setOpenModalViewSelected] = useState(false)
    const [listDelete, setListDelete] = useState([]);
    const [isDelList,setIsDelList] =  useState(false)
    const [nameSearch,setNameSearch] =useState(null)
    const [member,setMember] =useState({memberId:'',memberName:''})
    const [council,setCouncil] =useState({memberId:'',memberName:''})
    const [represent,setRepresent] =useState({memberId:'',memberName:''})
    const [contactSearch,setContactSearch] =useState(null)
    const [taxSearch,setTaxSearch] =useState(null)
    const [listMember, setListMember] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [capitalLimit, setCapitalLimit] = useState(0)
    const [refresh, setRefresh] = useState(false)
    const [openModalDel, setOpenModalDel] = useState(false)
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 10,
        rows: [
        ],
        total: 0
    });
    const [listRowSelect, setListRowSelect] = React.useState([]);
    const [infoDel, setInfoDel] = useState({})

    const columns: GridColDef[] = [
        {
            sortable: false,
            field: 'index',
            headerName: 'STT',
            maxWidth: 60,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('company','index'),
            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            field: 'company_name',
            headerName: 'T??n c??ng ty',
            headerClassName: 'super-app-theme--header',
            minWidth: 250,
            flex:1,
            hide: checkColumnVisibility('company','company_name'),
            renderCell: (params) => {

                return <div className='content-column'>
                    <Highlighter
                        highlightClassName="test-highlight"
                        searchWords={[nameSearch]}
                        autoEscape={true}
                        textToHighlight={params.value}
                    />
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'represent',
            headerName: 'Ng?????i ?????i di???n ph??p l??',
            headerClassName: 'super-app-theme--header',
            minWidth: 250,
            flex:1,
            hide: checkColumnVisibility('company','company_name'),
            renderCell: (params) => {

                return <div className='content-column'>
                    <Highlighter
                        highlightClassName="test-highlight"
                        searchWords={[represent.memberName]}
                        autoEscape={true}
                        textToHighlight={params.value}
                    />
                </div>;
            },
        },
        ,
        {
            filterable: false,
            sortable: false,
            field: 'member',
            headerName: 'Ban ??i???u h??nh',
            headerClassName: 'super-app-theme--header',
            minWidth: 250,
            flex:1,
            hide: checkColumnVisibility('company','member'),
            renderCell: (params) => {

                return <div className='content-column row-member'>
                    <Highlighter
                        highlightClassName="test-highlight"
                        searchWords={[member.memberName]}
                        autoEscape={true}
                        textToHighlight={params.value}
                    />                </div>;
            },

        }, {
            filterable: false,
            sortable: false,
            field: 'council',
            headerName: 'H???i ?????ng qu???n tr???',
            headerClassName: 'super-app-theme--header',
            minWidth: 250,
            flex:1,
            hide: checkColumnVisibility('company','council'),
            renderCell: (params) => {

                return <div className='content-column row-member'>
                    <Highlighter
                        highlightClassName="test-highlight"
                        searchWords={[council.memberName]}
                        autoEscape={true}
                        textToHighlight={params.value}
                    />                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            field: 'tax_number',
            headerName: 'M?? s??? thu???',
            headerClassName: 'super-app-theme--header',
            minWidth: 120,
            hide: checkColumnVisibility('company','tax_number'),
            renderCell: (params) => {

                return <div className='content-column'>
                    <Highlighter
                        highlightClassName="test-highlight"
                        searchWords={[taxSearch]}
                        autoEscape={true}
                        textToHighlight={params.value}
                    />
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'capital_limit',
            headerName: 'S??? ti???n vay t???i ??a',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex:1,
            hide: checkColumnVisibility('company','capital_limit'),
            renderCell: (params) => {

                return <div className='content-column number'>
                    {params.value}
                </div>;
            },
        },        {
            filterable: false,
            sortable: false,
            field: 'remain_capital',
            headerName: 'S??? ti???n vay c??n l???i',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex:1,
            hide: checkColumnVisibility('company','remain_capital'),
            renderCell: (params) => {

                return <div className='content-column number'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'contact_detail',
            headerName: 'Th??ng tin li??n h???',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex:1,
            hide: checkColumnVisibility('company','contact_detail'),
            renderCell: (params) => {

                return <div className='content-column'>
                    <Highlighter
                        highlightClassName="test-highlight"
                        searchWords={[contactSearch]}
                        autoEscape={true}
                        textToHighlight={params.value}
                    />                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            field: 'collateral',
            headerName: 'T??i s???n ?????m b???o',
            headerClassName: 'super-app-theme--header',
            minWidth: 120,
            flex:1,
            hide: checkColumnVisibility('company','collateral'),
            renderCell: (params) => {
                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },


        {
            filterable: false,
            sortable: false,
            field: 'charter_capital',
            headerName: 'V???n ??i???u l???',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex:1,
            hide: checkColumnVisibility('company','charter_capital'),
            renderCell: (params) => {

                return <div className='content-column number'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'founding_date',
            headerName: 'Ng??y th??nh l???p',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex:1,
            hide: checkColumnVisibility('company','founding_date'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },

        // {filterable: false,sortable: false, field: 'document', headerName: 'T??i li???u',headerClassName: 'super-app-theme--header' ,minWidth: 120},

        {
            filterable: false,
            sortable: false,
            field: 'address',
            headerName: '?????a ch???',
            headerClassName: 'super-app-theme--header',
            minWidth: 200,
            flex:1,
            hide: checkColumnVisibility('company','address'),
            renderCell: (params) => {

                return <div className='content-column'>
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
            width: 170,
            minWidth: 170,
            align: 'center',
            maxWidth: 170,
            // flex: 1,
            renderCell: (params) => {

                const detailBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    navigate(`/company/detail?id=${params.id}`)

                }
                const deleteBtn = (e) => {
                    e.stopPropagation();
                    setIsDelList(false)
                    setOpenModalDel(true)
                    setInfoDel(params.row)
                }
                const updateBtn = (e) => {
                    e.stopPropagation();
                    navigate(`/company/update?id=${params.id}`)
                    // });
                }
                return <div className='icon-action'>
                    <Tooltip title="L???ch s??? thay ?????i c??ng ty" onClick={()=>navigate(`/company/history?id=${params.id}`)}>
                        <HistoryIcon style={{color: "rgb(107, 114, 128)"}}></HistoryIcon>
                    </Tooltip>
                    <Tooltip title="Th??nh vi??n" onClick={()=>navigate(`/company/member?id=${params.id}`)}>
                        <PersonOutlineIcon style={{color: "rgb(107, 114, 128)"}}></PersonOutlineIcon>
                    </Tooltip>
                    <Tooltip title="C???p nh???t" onClick={updateBtn}>
                        <BorderColorIcon style={{color: "rgb(107, 114, 128)"}}></BorderColorIcon>
                    </Tooltip>
                    <Tooltip title="X??a" onClick={deleteBtn}>
                        <DeleteForeverIcon style={{color: "rgb(107, 114, 128)"}}></DeleteForeverIcon>
                    </Tooltip>
                    <Tooltip onClick={detailBtn} title="Xem chi ti???t">
                        <RemoveRedEyeIcon style={{color: "rgb(107, 114, 128)"}}></RemoveRedEyeIcon>
                    </Tooltip>

                </div>;
            },
        },

        // { field: 'document', headerName: 'Nh??m t??i s???n' },
    ];

    const handleChangeNameSearch = (e) => {
      setNameSearch(e.target.value)
    }
    const handleChangeContactSearch = (e) => {
        setContactSearch(e.target.value)
    }
    const handleChangeTaxSearch = (e) => {
        setTaxSearch(e.target.value)
    }
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const handleCloseModalViewSelected = () => {
        setOpenModalViewSelected(false)
    }

    const redirectAddPage = () => {
        navigate('/company/create')
    }
    const convertArr = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i].index = (listResult.page) * listResult.pageSize + i + 1;
            // arr[i].asset_group_name = arr[i].asset_group?.group_name;
            // arr[i].asset_type_name = arr[i].asset_type?.asset_type_name;
            // arr[i].initial_value = currencyFormatter(arr[i].initial_value)
            // arr[i].capital_value = currencyFormatter(arr[i].capital_value)
            // arr[i].max_capital_value = currencyFormatter(arr[i].max_capital_value)
            arr[i].capital_limit = currencyFormatter(arr[i].capital_limit)
            arr[i].charter_capital = currencyFormatter(arr[i].charter_capital)
            arr[i].remain_capital = currencyFormatter(arr[i].remain_capital)
            arr[i].represent = arr[i].member?arr[i].member.name:''
            arr[i].member = "";
            arr[i].council = "";
            for(let j = 0; j < arr[i].member_response_list.length; j++){
                if(arr[i].member_response_list[j].type=="TV"){
                    if(arr[i].member_response_list[j].member_id!==member.memberId){
                        arr[i].member =arr[i].member+'- T??n th??nh vi??n: '+ arr[i].member_response_list[j].name+'\n  V??? tr??: '+(typeToName(arr[i].member_response_list[j].position))+"\n";
                    }
                    else  arr[i].member ='- T??n th??nh vi??n: '+ arr[i].member_response_list[j].name+'\n  V??? tr??: '+(typeToName(arr[i].member_response_list[j].position))+"\n"+arr[i].member;
                }
                else if(arr[i].member_response_list[j].type=="H??QT"){
                    if(arr[i].member_response_list[j].member_id!==council.memberId){
                        arr[i].council =arr[i].council+'- T??n th??nh vi??n: '+ arr[i].member_response_list[j].name+'\n  V??? tr??: '+(typeToName(arr[i].member_response_list[j].position))+"\n";
                    }
                    else  arr[i].council ='- T??n th??nh vi??n: '+ arr[i].member_response_list[j].name+'\n  V??? tr??: '+(typeToName(arr[i].member_response_list[j].position))+"\n"+arr[i].council;
                }

            }
        }
        return arr;
    }

    useEffect(() => {
        if(currentUser.token){
            getListCompanyApi({
                'page_size': listResult.pageSize,
                'page_index': listResult.page + 1,
                'paging': true,
                'company_name': nameSearch === '' ? null : nameSearch,
                'contact_detail': contactSearch === 0 ? null : contactSearch,
                'tax_number': taxSearch === 0 ? null : taxSearch,
                'member_id': member.memberId === '' ? null : member.memberId,
                'council_id': council.memberId === '' ? null : council.memberId,
                'represent_id': represent.memberId === '' ? null : represent.memberId
            }).then(r => {
                setLoading(false)
                console.log("r", r)
                let arr = convertArr(r.data.companies)
                setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
            }).catch(e => {
                setLoading(false)
                console.log(e)
            })

            getCapitalLimitApi().then(r => {
                if(r.data.length > 0) {
                    setCapitalLimit(r.data[0].amount)
                }
            })
        }

    }, [listResult.page, listResult.pageSize,nameSearch,contactSearch,taxSearch ,refresh,currentUser.token,member,represent,council])
    useEffect(()=>{
        if(currentUser.token){
            getListMemberApi({paging: false}).then(r => {
                // console.log("r.data.companies",r.data);

                if (r.data.member_entities) {
                    setListMember(convertToAutoComplete(r.data.member_entities, 'name'))

                } else {
                    setListMember([])
                }

            }).catch(e => {

            })
        }
    },[currentUser.token])
    useEffect(()=>{
        let listSelect = [];
        console.log("listDelete",listDelete)
        console.log("listResult.rows",listResult.rows)
        for (let i = 0; i < listDelete.length; i++){
            console.log("i",i)
            for (let j = 0; j < listResult.rows.length; j++){
                console.log("j",j)
                if(listDelete[i] === listResult.rows[j].id){
                    listSelect.push(listResult.rows[j]);
                }
            }
        }
        setListRowSelect(listSelect);
        console.log("listSelect",listSelect);
    },[listDelete])
    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton/>
                {/*<GridToolbarDensitySelector/>*/}
                {listDelete.length > 0 ?
                    <div style={{right:"5px",position:'absolute'}}>
                        <Tooltip title="X??a">
                            <Button onClick={deleteListBtn} variant={"outlined"}  color={"error"}>X??a</Button>
                        </Tooltip>
                        <Tooltip title="Danh s??ch ???? ch???n">
                            <Button style={{marginLeft:"10px"}} onClick={()=>{setOpenModalViewSelected(true)}} variant={"outlined"}  color={"primary"}>Danh s??ch ???? ch???n</Button>
                        </Tooltip>
                    </div>
                    : ''}
            </GridToolbarContainer>
        );
    }
    const submitDelete = () => {
        if(isDelList){
            deleteListApi({list_id:listDelete}).then(r => {
                setRefresh(!refresh)
                toast.success('X??a th??nh c??ng', {
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
        }else{
            deleteCompanyApi(infoDel.id).then(r => {
                toast.success('X??a th??nh c??ng', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setLoading(false)
                setRefresh(!refresh);
            }).catch(e => {
                setLoading(false)
                console.log(e)
            })
        }
    }
    const uploadFile = () => {
        var el = window._protected_reference = document.createElement("INPUT");
        el.type = "file";
        el.accept = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
        // el.multiple = "multiple";
        el.addEventListener('change', function (ev2) {

            new Promise(function (resolve) {
                setTimeout(function () {
                    if(el.files.length > 0) {
                        console.log(el.files);
                        let formData = new FormData();
                        formData.append('file', el.files[0])
                        importCompanyApi(formData).then(r=>{
                            console.log(r);
                            toast.success('Nh???p d??? li???u th??nh c??ng', {
                                position: "top-right",
                                autoClose: 1500,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                            setRefresh(!refresh)

                        }).catch(err => {
                            console.log(err)
                        })
                    }
                    resolve();

                }, 1000);


            })
                .then(function () {
                    // clear / free reference
                    el = window._protected_reference = undefined;
                });
        });

        el.click();
    }
    const downTemplate = () => {
        Axios.get(API_MAP.DOWN_TEMPLATE_COMPANY, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` },
            responseType: 'blob'
        }).then(response => {
            let nameFile = response.headers['content-disposition'].split(`"`)[1]
            FileDownload(response.data,nameFile);

        }).catch(e=>{
        })
    }
    const deleteListBtn = () => {
        setIsDelList(true)
        setOpenModalDel(true)
    }

    const submitUpdateCapitalLimit= () => {
        updateCapitalLimitApi(capitalLimit).then(r => {

            toast.success('C???p nh???t th??nh c??ng', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            setRefresh(!refresh)
        }).catch(e=>{

        })

    }
    const deleteListApi = (data) => {
        return apiManagerCompany.deleteListCompany(data);
    }
    const importCompanyApi = (data) => {
        return apiManagerCompany.importCompany(data);
    }
    const getListCompanyApi = (data) => {
        setLoading(true)
        return apiManagerCompany.getListCompany(data);
    }
    const getListMemberApi = (data) => {
        return apiManagerMember.getListMember(data);
    }
    const deleteCompanyApi = (id) => {
        setLoading(true)
        return apiManagerCompany.deleteCompany(id);
    }
    const updateCapitalLimitApi = (amount) => {
        setLoading(true)
        return apiManagerCompany.updateCapitalLimit(amount);
    }
    const getCapitalLimitApi = () => {
        return apiManagerCompany.getDefaultCapitalLimit();
    }
    return (
        <div className={'main-content'}>
            {/*<div className={`loading ${loading ? '' : 'hidden'}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
            {/*</div>*/}
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
            <ModalViewSelected columns={columns} listResult={listRowSelect} openModalViewSelected={openModalViewSelected} handleCloseModalViewSelected={handleCloseModalViewSelected}></ModalViewSelected>

            <div className={'main-content-header'}>
                <ModalConfirmDel name={infoDel.company_name} openModalDel={openModalDel}
                                 handleCloseModalDel={handleCloseModalDel}
                                 submitDelete={submitDelete}></ModalConfirmDel>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Qu???n l?? c??ng ty
                    </Typography>
                    <div>
                        <Tooltip title={'T???i file m???u'}>
                            <IconButton style={{cursor: 'pointer'}} color="primary"
                                        onClick={downTemplate}>
                                <SimCardDownloadIcon></SimCardDownloadIcon>
                            </IconButton>
                        </Tooltip>
                        <Button onClick={uploadFile} variant="text" startIcon={<VerticalAlignTopIcon/>}>Nh???p</Button>
                        <Button className={"d-none"} onClick={pending} style={{marginLeft: '10px',marginRight:'10px'}} variant="text"
                                startIcon={<VerticalAlignBottomIcon/>}>Xu???t</Button>
                        <Button onClick={redirectAddPage} variant="outlined" startIcon={<AddIcon/>}>
                            Th??m
                        </Button>
                    </div>
                </div>

            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>T??m ki???m</h4>
                    {openSearch ? <IconButton color="primary" style={{cursor: 'pointer'}}
                                              onClick={() => setOpenSearch(false)}>
                            <ExpandLessOutlinedIcon></ExpandLessOutlinedIcon>
                        </IconButton> :
                        <IconButton style={{cursor: 'pointer'}} color="primary"
                                    onClick={() => setOpenSearch(true)}>
                            <ExpandMoreOutlinedIcon></ExpandMoreOutlinedIcon>
                        </IconButton>
                    }

                </div>
                <Divider light/>

                <Collapse in={openSearch} timeout="auto" unmountOnExit>
                    <div className={'main-content-body-search'}>
                        <div style={{width: '20%'}}>
                            <div className={'label-input'}>T??n c??ng ty</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                placeholder={'T??n c??ng ty'}
                                value={nameSearch}
                                onChange={handleChangeNameSearch}
                                // InputProps={{
                                //     startAdornment: (
                                //         <InputAdornment position="start">
                                //             <SearchIcon />
                                //         </InputAdornment>
                                //     ),
                                // }}
                                // variant="standard"
                            />
                        </div>
                        <div style={{width: '20%',marginLeft:'20px'}}>
                            <div className={'label-input'}>Th??ng tin li??n h???</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                placeholder={'Th??ng tin li??n h???'}
                                value={contactSearch}
                                onChange={handleChangeContactSearch}
                                // InputProps={{
                                //     startAdornment: (
                                //         <InputAdornment position="start">
                                //             <SearchIcon />
                                //         </InputAdornment>
                                //     ),
                                // }}
                                // variant="standard"
                            />
                        </div>
                        <div style={{width: '20%',marginLeft:'20px'}}>
                            <div className={'label-input'}>M?? s??? thu???</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                placeholder={'M?? s??? thu???'}
                                value={taxSearch}
                                onChange={handleChangeTaxSearch}
                                // InputProps={{
                                //     startAdornment: (
                                //         <InputAdornment position="start">
                                //             <SearchIcon />
                                //         </InputAdornment>
                                //     ),
                                // }}
                                // variant="standard"
                            />
                        </div>
                        <div style={{width: '20%',marginLeft:'20px'}}>
                            <div className={'label-input'}>Ng?????i ?????i di???n ph??p lu???t</div>
                            <Autocomplete
                                id="combo-box-demo"
                                options={listMember}
                                value={{
                                    id: represent.memberId,
                                    label: represent.memberName,
                                }
                                }

                                renderInput={(params) => < TextField  {...params} />}
                                size={"small"}
                                onChange={(event, newValue) => {
                                    // setCompanySearch(newValue)
                                    console.log("new_value", newValue)
                                    if (newValue){
                                        setRepresent({memberId: newValue.id,memberName:newValue.label})
                                        // setFieldValue('capital_company_id', newValue.id)
                                        // setFieldValue('capital_campaign_name', newValue.label)
                                        // setIdCompanyCurrent(newValue.id)
                                    }
                                    else{
                                        setRepresent({memberId: '',memberName:''})
                                        // setFieldValue('capital_company_id', '')
                                        // setFieldValue('capital_campaign_name', '')
                                        // setIdCompanyCurrent(0)
                                    }
                                }}
                            />
                        </div>

                        <div style={{width: '20%',marginLeft:'20px'}}>
                            <div className={'label-input'}>Ban ??i???u h??nh</div>
                            <Autocomplete
                                id="combo-box-demo"

                                options={listMember}
                                value={{
                                    id: member.memberId,
                                    label: member.memberName,
                                }
                                }

                                renderInput={(params) => < TextField  {...params} />}
                                size={"small"}
                                onChange={(event, newValue) => {
                                    // setCompanySearch(newValue)
                                    console.log("new_value", newValue)
                                    if (newValue){
                                        setMember({memberId: newValue.id,memberName:newValue.label})
                                        // setFieldValue('capital_company_id', newValue.id)
                                        // setFieldValue('capital_campaign_name', newValue.label)
                                        // setIdCompanyCurrent(newValue.id)
                                    }
                                    else{
                                        setMember({memberId: '',memberName:''})
                                        // setFieldValue('capital_company_id', '')
                                        // setFieldValue('capital_campaign_name', '')
                                        // setIdCompanyCurrent(0)
                                    }
                                }}
                            />
                        </div>
                        <div style={{width: '20%',marginLeft:'20px'}}>
                            <div className={'label-input'}>H???i ?????ng qu???n tr???</div>
                            <Autocomplete
                                id="combo-box-demo"
                                options={listMember}
                                value={{
                                    id: council.memberId,
                                    label: council.memberName,
                                }
                                }

                                renderInput={(params) => < TextField  {...params} />}
                                size={"small"}
                                onChange={(event, newValue) => {
                                    // setCompanySearch(newValue)
                                    console.log("new_value", newValue)
                                    if (newValue){
                                        setCouncil({memberId: newValue.id,memberName:newValue.label})
                                        // setFieldValue('capital_company_id', newValue.id)
                                        // setFieldValue('capital_campaign_name', newValue.label)
                                        // setIdCompanyCurrent(newValue.id)
                                    }
                                    else{
                                        setCouncil({memberId: '',memberName:''})
                                        // setFieldValue('capital_company_id', '')
                                        // setFieldValue('capital_campaign_name', '')
                                        // setIdCompanyCurrent(0)
                                    }
                                }}
                            />
                        </div>
                    </div>

                </Collapse>
                <Divider light/>

                <div className={'main-content-body-tittle'}>
                    <h4>S??? ti???n vay t???i ??a</h4>
                    {openUpdate ? <IconButton color="primary" style={{cursor: 'pointer'}}
                                              onClick={() => setOpenUpdate(false)}>
                            <ExpandLessOutlinedIcon></ExpandLessOutlinedIcon>
                        </IconButton> :
                        <IconButton style={{cursor: 'pointer'}} color="primary"
                                    onClick={() => setOpenUpdate(true)}>
                            <ExpandMoreOutlinedIcon></ExpandMoreOutlinedIcon>
                        </IconButton>
                    }

                </div>
                <Divider light/>

                <Collapse in={openUpdate} timeout="auto" unmountOnExit>
                    <div className={'main-content-body-search'} style={{display: 'block', height: '110px',paddingTop:'20px'}}>
                        <div style={{display: 'flex'}}>
                            <div style={{width:'25%'}}>
                                <div className={'label-input'}>C???p nh???t s??? ti???n vay t???i ??a</div>
                                <div>
                                    <NumericFormat
                                        id='max_capital_value'
                                        name='max_capital_value'
                                        className={'formik-input text-right'}
                                        size={"small"}
                                        // type={"number"}
                                        // variant="standard"
                                        value={capitalLimit}
                                        // onChange={handleChange}
                                        customInput={TextField}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">VN??</InputAdornment>,

                                        }}
                                        thousandSeparator={"."}
                                        decimalSeparator={","}
                                        onValueChange={(values) => {
                                            const {formattedValue, value, floatValue} = values;
                                            // do something with floatValue
                                            const re = /^[0-9\b]+$/;
                                            if (re.test(floatValue)) {
                                                // setFieldValue('max_capital_value', floatValue)
                                                // setRemainAmount(floatValue)
                                                setCapitalLimit(floatValue)
                                            }
                                            // setFieldValue('max_capital_value', formattedValue)

                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{marginTop:"17px",marginLeft:"10px"}}>
                                <Button onClick={submitUpdateCapitalLimit}  variant={"outlined"}  color={"primary"}> C???p nh???t</Button>
                            </div>

                        </div>
                        <div style={{width:'25%'}}>
                            <Typography className={'uppercase'} variant="caption" display="block"
                                        gutterBottom>
                                {capitalLimit ? `*B???ng ch???: ${capitalizeFirstLetter(VNnum2words(capitalLimit))} ?????ng` : ''}
                            </Typography>
                        </div>
                    </div>
                </Collapse>
                <Divider light/>
                <div className={'main-content-body-result sticky-body tutt20'}>
                    <div style={{height: '100%', width: '100%'}}>
                        <DataGrid
                            onColumnVisibilityModelChange={(event) =>{
                                changeVisibilityTableAll('company',event)
                            }}
                            getRowHeight={() => 'auto'}
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                            labelRowsPerPage={"S??? k???t qu???"}
                            density="standard"
                            columns={columns}
                            pagination
                            rowCount={listResult.total}
                            {...listResult}
                            paginationMode="server"
                            // onPageChange={(page) => setCurrentPage(page)}
                            // onPageSizeChange={(pageSize) =>
                            //    setCurrentSize(pageSize)
                            // }
                            onPageChange={(page) => setListResult((prev) => ({...prev, page}))}
                            onPageSizeChange={(pageSize) =>
                                setListResult((prev) => ({...prev, pageSize}))
                            }
                            onSelectionModelChange={(newSelectionModel) => {
                                setListDelete(newSelectionModel)
                            }}
                            checkboxSelection
                            loading={loading}
                            rowsPerPageOptions={[5, 10, 25]}
                            disableSelectionOnClick
                            sx={{
                                // boxShadow: 2,
                                overflowX: 'scroll',
                                border: 1,
                                borderColor: 'rgb(255, 255, 255)',
                                '& .MuiDataGrid-iconSeparator': {
                                    display: 'none',
                                }
                            }}
                            components={{
                                Toolbar: CustomToolbar,
                            }}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}
