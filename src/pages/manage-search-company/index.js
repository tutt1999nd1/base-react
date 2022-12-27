import React, {useEffect, useState} from "react";
import Collapse from "@mui/material/Collapse";
import 'react-dropdown-tree-select/dist/styles.css'
import PaidIcon from '@mui/icons-material/Paid';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import 'antd/dist/antd.css';
import {TreeSelect} from 'antd';

import {
    Autocomplete,
    Button,
    Divider,
    FormControl,
    IconButton, InputAdornment,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import {toast, ToastContainer} from "react-toastify";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, viVN} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {
    capitalizeFirstLetter,
    changeVisibilityTableAll,
    checkColumnVisibility,
    convertToAutoComplete,
    currencyFormatter,
    pending, VNnum2words
} from "../../constants/utils";
import apiManagerSOF from "../../api/manage-sof";
import apiManagerCompany from "../../api/manage-company";
import apiManagerCategory from "../../api/manage-category";
import apiManagerCampaign from "../../api/manage-campaign";
import {useDispatch, useSelector} from "react-redux";
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import apiManagerSupplier from "../../api/manage-supplier";
import apiManagerAssets from "../../api/manage-assets";
import HistoryIcon from '@mui/icons-material/History';
import {NumericFormat} from "react-number-format";
import apiManagerMember from "../../api/manage-member";
import ModalConfirm from "../../components/ModalConfirm";
import {updateSelectCompany} from "../../store/user/userSlice";

export default function ManageSearchCompany() {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.currentUser)
    const [isDelList, setIsDelList] = useState(false)
    const [listDelete, setListDelete] = useState([]);
    const navigate = useNavigate();
    const [openUpdate, setOpenUpdate] = useState(true)
    const [capitalLimit, setCapitalLimit] = useState(0)
    const [listCompany, setListCompany] = useState([]);
    const [listCompanySupplier, setListCompanySupplier] = useState([]);
    const [listCampaign, setListCampaign] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [statusSOF, setStatusSOF] = useState();
    const [listCategoryTree, setListCategoryTree] = useState([]);
    const [listMember, setListMember] = useState([]);
    const [represent, setRepresent] = useState({memberId: '', memberName: ''})
    const [listCampaignTree, setListCampaignTree] = useState([]);
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
    const [campaignSearch, setCampaignSearch] = useState()
    const [companySearch, setCompanySearch] = useState(0)
    const [companySupplierSearch, setCompanySupplierSearch] = useState(0)
    const [remainAmount, setRemainAmount] = useState(0)
    const [statusSearch, setStatusSearch] = useState(3)
    const [openSearch, setOpenSearch] = useState(true)
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 10,
        rows: [],
        total: 0
    });
    window.addEventListener("storage", message_receive);
    function message_receive(e) {
        if (e.key == 'broadcast') {
            var message = JSON.parse(e.newValue); // chỉ check với key là 'broadcast'
        }

        if (!message) return; // nếu message rỗng thì bỏ qua

        // Ở đây bạn có thể xử lý message đã nhận.
        // bạn có thể gửi object dạng { 'title': 'tiêu đề', 'message': 'nội dung' }
        // vân vân.
        // mây mây.
    };
    const [infoDel, setInfoDel] = useState({})

    const columns: GridColDef[] = [
        {
            sortable: false,
            field: 'index',
            headerName: 'STT',
            maxWidth: 60,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('sof', 'index'),
            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            sortable: false,
            field: 'company_name',
            headerName: 'Tên công ty',
            minWidth: 250,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('sof', 'sof_code'),
            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            resizable: true,
            field: 'status',
            headerName: 'Tình trạng',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('sof', 'capital_company_name'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'member_name',
            headerName: 'Đại diện pháp luật',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('sof', 'capital_category_name'),
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'capital_limit',
            headerName: 'Số tiền vay tối đa',
            headerClassName: 'super-app-theme--header',
            minWidth: 250,
            hide: checkColumnVisibility('sof', 'supplier_name'),
            renderCell: (params) => {

                return <div className='content-column number'>
                    {currencyFormatter(Number(params.value))}
                </div>;
            },
        },

        {
            filterable: false,
            sortable: false,
            field: "sof_code",
            headerName: 'Mã khoản vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 250,
            renderCell: (params) => {
                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'lending_amount',
            headerName: 'Số tiền đã vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 250,
            hide: checkColumnVisibility('sof', 'capital_campaign_name'),
            renderCell: (params) => {

                return <div className='content-column number'>
                    {currencyFormatter(Number(params.value))}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'remain_amount',
            headerName: 'Số tiền vay còn lại',
            headerClassName: 'super-app-theme--header',
            minWidth: 250,
            hide: checkColumnVisibility('sof', 'status'),
            renderCell: (params) => {

                return <div className='content-column number'>
                    {currencyFormatter(Number(params.value))}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'campaign_name',
            headerName: 'Mục đích vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            hide: checkColumnVisibility('sof', 'lending_amount'),
            renderCell: (params) => {

                return <div className='content-column '>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'supplier_name',
            headerName: 'Đối tượng cung cấp vốn',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            hide: checkColumnVisibility('sof', 'remain_lending_amount'),
            renderCell: (params) => {

                return <div className='content-column '>
                    {params.value}
                </div>;
            },
        }
        // { field: 'document', headerName: 'Nhóm tài sản' },
    ];

    const handleCloseModalConfirm = () => {
        setOpenModalConfirm(false)
    }

    const redirectAddPage = () => {
        navigate('/sof/create')
    }
    const convertArr = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i].index = (listResult.page) * listResult.pageSize + i + 1;
            arr[i].id = (listResult.page) * listResult.pageSize + i + 1;

            arr[i].status = arr[i].status == 1 ? "Đang vay" : "Chưa vay"
            if (arr[i].remain_amount == 0 || arr[i].remain_amount == null) {
                arr[i].remain_amount = arr[i].capital_limit
            }
            // arr[i].capital_limit = currencyFormatter(arr[i].lending_amount)
            // arr[i].remain_lending_amount = currencyFormatter(arr[i].remain_lending_amount)

        }
        return arr;
    }

    const handleChangeCampaign = (e) => {
        setCampaignSearch(e)
    };
    const handleChangeStatus = (e) => {
        setStatusSearch(e.target.value)
    };
    useEffect(() => {
        getListCompanySOFApi({
            'page_size': listResult.pageSize,
            'page_index': listResult.page,
            'paging': true,
            'company_id': companySearch === 0 ? null : companySearch,
            // 'supplier_id': companySupplierSearch === 0 ? null : companySupplierSearch,
            // 'capital_limit': companySupplierSearch === 0 ? null : companySupplierSearch,
            // 'member_id': campaignSearch ? campaignSearch : null,
            'remain_amount': remainAmount,
            'supplier_id': companySupplierSearch ? companySupplierSearch : null,
            'campaign_id': campaignSearch ? campaignSearch : null,
            'status': statusSearch === 3 ? null : statusSearch,
            'member_id': represent.memberId === '' ? null : represent.memberId

        }).then(r => {
            setLoading(false)
            console.log("r", r)
            let arr;
            if (r.data.custom_company_dtos)
                arr = convertArr(r.data.custom_company_dtos)
            else arr = [];
            console.log("arr tutt", arr)
            setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
        getCapitalLimitApi().then(r => {
            if (r.data.length > 0) {
                setCapitalLimit(r.data[0].amount)
            }
        })
        getListMemberApi({paging: false}).then(r => {
            // console.log("r.data.companies",r.data);

            if (r.data.member_entities) {
                setListMember(convertToAutoComplete(r.data.member_entities, 'name'))

            } else {
                setListMember([])
            }

        }).catch(e => {

        })
    }, [listResult.page, listResult.pageSize, campaignSearch, companySearch, companySupplierSearch, statusSearch, refresh, currentUser.token, remainAmount, represent])
    useEffect(() => {
        getListCategoryApi({paging: false}).then(r => {
            if (r.data.categories) {
                setListCategory(convertToAutoComplete(r.data.categories, 'category_name'))
            } else setListCategory([])

        }).catch(e => {

        })
        getListCampaignApi({paging: false}).then(r => {
            if (r.data.campaigns)
                setListCampaign(convertToAutoComplete(r.data.campaigns, 'campaign_name'))
            else setListCampaign([])

        }).catch(e => {

        })
        getListCompanyApi({paging: false}).then(r => {
            if (r.data.companies) {
                setListCompany(convertToAutoComplete(r.data.companies, 'company_name'))
            } else {
                setListCompany([])
            }

        }).catch(e => {
            console.log(e)
        })
        getListSupplierApi({paging: false}).then(r => {
            if (r.data.suppliers) {
                setListCompanySupplier(convertToAutoComplete(r.data.suppliers, 'supplier_name'))

            } else {
                setListCompanySupplier([])
            }
        }).catch(e => {
            console.log(e)
        })
        getListCategoryTreeApi({paging: false}).then(r => {
            console.log("setListCategoryTree", r.data)
            setListCategoryTree(r.data)
        }).catch(e => {
            console.log(e)
        })
        getListCampaignTreeApi({paging: false}).then(r => {
            console.log("setListCategoryTree", r.data)
            setListCampaignTree(r.data)
        }).catch(e => {
            console.log(e)
        })

    }, [currentUser.token])

    // const { data } = useDemoData({
    //     dataSet: 'Commodity',
    //     rowLength: 20,
    //     maxColumns: 5,
    // });
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
        dispatch(updateSelectCompany(listSelect))
        console.log("listSelect",listSelect);
        // localStorage.setItem("broadcast",listSelect)
        localStorage.setItem("broadcast",JSON.stringify(listSelect))
    },[listDelete])

    const submitUpdateCapitalLimit = () => {
        updateCapitalLimitApi(capitalLimit).then(r => {
            toast.success('Cập nhật thành công', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            setLoading(false)
            setOpenModalConfirm(false)
            setRefresh(!refresh)
        }).catch(e => {
            setLoading(false)
            setOpenModalConfirm(false)
        })

    }
    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton/>
                {/*<GridToolbarDensitySelector/>*/}
                {listDelete.length > 0 ?
                    <div style={{right:"5px",position:'absolute'}}>
                        <Tooltip title="Danh sách đã chọn">
                            <Button style={{marginLeft:"10px"}} variant={"outlined"}  onClick={()=>{ window.open('/search-company/view', '_blank').focus();}}  color={"primary"}>Danh sách đã chọn</Button>
                        </Tooltip>
                    </div>
                    : ''}
            </GridToolbarContainer>
        );
    }
    const deleteListApi = (data) => {
        return apiManagerSOF.deleteListSOF(data);
    }
    const getListSupplierApi = (data) => {
        return apiManagerSupplier.getListSupplier(data);
    }
    const getListSOFsApi = (data) => {
        setLoading(true)
        return apiManagerSOF.getListSOF(data);
    }
    const getListCompanyApi = (data) => {
        return apiManagerCompany.getListCompany(data);
    }
    const getListCompanySOFApi = (data) => {
        setLoading(true)
        return apiManagerCompany.getListCompanySOF(data);
    }
    const getListMemberApi = (data) => {
        return apiManagerMember.getListMember(data);
    }
    const getListCategoryApi = (data) => {
        return apiManagerCategory.getListCategory(data);
    }
    const getListCategoryTreeApi = (data) => {
        return apiManagerCategory.getListCategoryTree(data);
    }
    const getListCampaignTreeApi = (data) => {
        return apiManagerCampaign.getListCampaignTree(data);
    }
    const getListCampaignApi = (data) => {
        return apiManagerCampaign.getListCampaign(data);
    }
    const deleteSOFApi = (id) => {
        return apiManagerSOF.deleteSOF(id);
    }
    const sendApproveSOFApi = (data) => {
        return apiManagerSOF.sendApproveSOF(data);
    }
    const cancelApproveSOFApi = (data) => {
        return apiManagerSOF.cancelApproveSOF(data);
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
            {/*<div className={`loading ${true ? '' : ''}`}>*/}
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
            <div className={'main-content-header'}>
                <ModalConfirm open={openModalConfirm}
                              handleCloseModal={handleCloseModalConfirm}
                              submit={submitUpdateCapitalLimit}></ModalConfirm>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Tìm kiếm công ty
                    </Typography>
                </div>

            </div>
            <div className={'main-content-body company-manage-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Tìm kiếm</h4>
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
                            <div className={'label-input'}>Công ty vay</div>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={listCompany}
                                // sx={{ width: 300 }}
                                // onChange={}
                                renderInput={(params) => < TextField {...params} placeholder="Công ty vay"/>}
                                size={"small"}
                                onChange={(event, newValue) => {
                                    console.log("new_value", newValue)
                                    if (newValue)
                                        setCompanySearch(newValue.id)
                                    else setCompanySearch(null)
                                }}
                            />
                        </div>
                        <div style={{width: '20%', marginLeft: '20px'}}>
                            <div className={'label-input'}>Người đại diện pháp luật</div>
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
                                    if (newValue) {
                                        setRepresent({memberId: newValue.id, memberName: newValue.label})
                                        // setFieldValue('capital_company_id', newValue.id)
                                        // setFieldValue('capital_campaign_name', newValue.label)
                                        // setIdCompanyCurrent(newValue.id)
                                    } else {
                                        setRepresent({memberId: '', memberName: ''})
                                        // setFieldValue('capital_company_id', '')
                                        // setFieldValue('capital_campaign_name', '')
                                        // setIdCompanyCurrent(0)
                                    }
                                }}
                            />
                        </div>
                        <div style={{width: '20%', marginLeft: '20px'}}>
                            <div className={'label-input'}>Đối tượng cung cấp vốn</div>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={listCompanySupplier}
                                // sx={{ width: 300 }}
                                // onChange={}
                                renderInput={(params) => < TextField {...params} placeholder="Đối tượng cung cấp vốn"/>}
                                size={"small"}
                                onChange={(event, newValue) => {
                                    console.log("new_value", newValue)
                                    if (newValue)
                                        setCompanySupplierSearch(newValue.id)
                                    else setCompanySupplierSearch(null)
                                }}
                            />
                        </div>
                        <div style={{width: '20%', marginLeft: '20px'}}>
                            <div className={'label-input'}>Mục đích vay</div>
                            <TreeSelect
                                style={{width: '100%'}}
                                showSearch
                                value={campaignSearch}
                                treeData={listCampaignTree}
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                placeholder="Mục đích vay"
                                allowClear
                                treeDefaultExpandAll
                                onChange={handleChangeCampaign}
                                filterTreeNode={(search, item) => {
                                    return item.campaign_name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                                }}
                                fieldNames={{label: 'campaign_name', value: 'id', children: 'child_campaigns'}}
                            >
                            </TreeSelect>
                        </div>


                        <div style={{width: '20%', marginLeft: '20px'}}>
                            <div className={'label-input'}>Trạng thái</div>
                            <FormControl fullWidth>
                                <Select
                                    labelId="asset_type_label"
                                    id='asset_type'
                                    name='asset_type'
                                    value={statusSearch}
                                    onChange={handleChangeStatus}
                                    size={"small"}
                                >
                                    <MenuItem value={3}>Tất cả</MenuItem>
                                    <MenuItem value={false}>Đang vay</MenuItem>
                                    <MenuItem value={true}>Chưa vay</MenuItem>


                                </Select>
                            </FormControl>
                        </div>
                        <div style={{width: '20%', marginLeft: '20px'}}>
                            <div className={'label-input'}>Số tiền vay còn lại lớn hơn hoặc bằng</div>
                            <NumericFormat
                                id='max_capital_value'
                                name='max_capital_value'
                                className={'formik-input text-right'}
                                size={"small"}
                                // type={"number"}
                                // variant="standard"
                                value={remainAmount}
                                // onChange={handleChange}
                                customInput={TextField}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                }}
                                thousandSeparator={"."}
                                decimalSeparator={","}
                                onValueChange={(values) => {
                                    const {formattedValue, value, floatValue} = values;
                                    // do something with floatValue
                                    const re = /^[0-9\b]+$/;
                                    if (re.test(floatValue) || floatValue === undefined) {
                                        console.log(floatValue)
                                        // setFieldValue('max_capital_value', floatValue)
                                        setRemainAmount(floatValue)
                                    }
                                    // setFieldValue('max_capital_value', formattedValue)

                                }}
                            />
                            <Typography className={'uppercase'} variant="caption" display="block"
                                        gutterBottom>
                                {remainAmount ? `*Bằng chữ: ${capitalizeFirstLetter(VNnum2words(remainAmount))} đồng` : ''}
                            </Typography>
                        </div>
                    </div>

                </Collapse>
                <Divider light/>
                <div className={'main-content-body-tittle'}>
                    <h4>Số tiền vay tối đa</h4>
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
                                <div className={'label-input'}>Cập nhật số tiền vay tối đa</div>
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
                                            endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                        }}
                                        thousandSeparator={"."}
                                        decimalSeparator={","}
                                        onValueChange={(values) => {
                                            const {formattedValue, value, floatValue} = values;
                                            // do something with floatValue
                                            const re = /^[0-9\b]+$/;
                                            if (re.test(floatValue) || floatValue === undefined) {
                                                // setFieldValue('max_capital_value', floatValue)
                                                // setRemainAmount(floatValue)
                                                setCapitalLimit(floatValue)
                                            }
                                            // setFieldValue('max_capital_value', formattedValue)

                                        }}
                                    />

                                </div>
                            </div>
                            <div style={{marginTop: '17px', marginLeft: "30px"}}>
                                <Button
                                    disabled={capitalLimit == 0 || capitalLimit == '' || capitalLimit == null ? true : false}
                                    onClick={() => setOpenModalConfirm(true)} style={{color: "white !important"}}
                                    variant={"outlined"}  color={"primary"}>Cập nhật</Button>
                            </div>
                        </div>
                        <div style={{width:'25%'}}>
                            <Typography className={'uppercase'} variant="caption" display="block"
                                        gutterBottom>
                                {capitalLimit ? `*Bằng chữ: ${capitalizeFirstLetter(VNnum2words(capitalLimit))} đồng` : ''}
                            </Typography>
                        </div>

                    </div>

                </Collapse>
                <Divider light/>
                <div className={'main-content-body-result sticky-body'}>
                    <div style={{height: '100%', width: '100%'}}>
                        <DataGrid
                            getRowHeight={() => 'auto'}
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                            labelRowsPerPage={"Số kết quả"}
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
                            onColumnVisibilityModelChange={(event) => {
                                changeVisibilityTableAll('sof', event)
                            }}
                            onPageChange={(page) => setListResult((prev) => ({...prev, page}))}
                            onPageSizeChange={(pageSize) =>
                                setListResult((prev) => ({...prev, pageSize}))
                            }
                            loading={loading}
                            rowsPerPageOptions={[5, 10, 25]}
                            disableSelectionOnClick
                            checkboxSelection
                            onSelectionModelChange={(newSelectionModel) => {
                                setListDelete(newSelectionModel)
                            }}
                            selectionModel={listDelete}
                            sx={{
                                overflowX: 'scroll',
                                // boxShadow: 2,
                                border: 1,
                                borderColor: 'rgb(255, 255, 255)',
                                '& .MuiDataGrid-iconSeparator': {
                                    display: 'none',
                                },

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

