import React, {useEffect, useState} from "react";
import Collapse from "@mui/material/Collapse";
import 'react-dropdown-tree-select/dist/styles.css'
// import 'antd/dist/antd.css';
import {TreeSelect} from 'antd';

import {
    Autocomplete,
    Button,
    Divider,
    FormControl,
    IconButton,
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
import {convertToAutoComplete, currencyFormatter, pending} from "../../constants/utils";
import apiManagerSOF from "../../api/manage-sof";
import apiManagerCompany from "../../api/manage-company";
import apiManagerCategory from "../../api/manage-category";
import apiManagerCampaign from "../../api/manage-campaign";
import {useSelector} from "react-redux";
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
export default function ManageSOF() {
    const currentUser = useSelector(state => state.currentUser)
    const navigate = useNavigate();
    const [value, setValue] = useState()
    const {TreeNode} = TreeSelect;
    const onChange = (newValue: string) => {
        setValue(newValue);
    };
    const [listCompany, setListCompany] = useState([]);
    const [listCompanySupplier, setListCompanySupplier] = useState([]);
    const [listCampaign, setListCampaign] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [statusSOF, setStatusSOF] = useState();
    const [listCategoryTree, setListCategoryTree] = useState([
    ]);
    const [listCampaignTree, setListCampaignTree] = useState([]);
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [openModalDel, setOpenModalDel] = useState(false)
    const [categorySearch, setCategorySearch] = useState()
    const [campaignSearch, setCampaignSearch] = useState()
    const [companySearch, setCompanySearch] = useState(0)
    const [companySupplierSearch, setCompanySupplierSearch] = useState(0)
    const [statusSearch, setStatusSearch] = useState(0)
    const [openSearch, setOpenSearch] = useState(true)
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 10,
        rows: [
            // {
            //     id:1,
            //     asset_name:'2',
            //     asset_group_name:'111',
            //     asset_type_name:'111',
            //     initial_value:'111',
            //     capital_value:'111',
            //     current_credit_value:'111',
            //     max_capital_value:'111',
            //     status:'111',
            //     description:'Thông tin chứng khoán ngày hôm nay rất tệ'
            // }
        ],
        total: 0
    });
    const [infoDel, setInfoDel] = useState({})

    const columns: GridColDef[] = [
        {
            sortable: false,
            field: 'index',
            headerName: 'STT',
            maxWidth: 75,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            sortable: false,
            field: 'sof_code',
            headerName: 'Mã khoản vay',
            minWidth: 150,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            // renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            filterable: false,
            sortable: false,
            field: 'capital_company_name',
            headerName: 'Công ty vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
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
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'capital_category_name',
            headerName: 'Hạng mục',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'capital_campaign_name',
            headerName: 'Mục đích vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'status',
            headerName: 'Trạng thái',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
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
            headerName: 'Số tiền vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'owner_full_name',
            headerName: 'Người quản lý',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            field: 'approve_name',
            headerName: 'Người phê duyệt',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },{
            filterable: false,
            sortable: false,
            field: 'created_by',
            headerName: 'Người tạo',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            field: 'lending_start_date',
            headerName: 'Ngày vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'lending_in_month',
            headerName: 'Thời gian vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },
        },
        // {filterable: false,sortable: false, field: 'document', headerName: 'Tài liệu',headerClassName: 'super-app-theme--header' ,minWidth: 120},
        {
            filterable: false,
            sortable: false,
            field: 'principal_period',
            headerName: 'Số kỳ trả gốc',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }, {
            filterable: false,
            sortable: false,
            field: 'interest_period',
            headerName: 'Số kỳ trả lãi',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }, {
            filterable: false,
            sortable: false,
            field: 'interest_rate',
            headerName: 'Lãi suất hợp đồng vay',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }, {
            filterable: false,
            sortable: false,
            field: 'grace_principal_in_month',
            headerName: 'Thời gian ân hạn gốc',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }, {
            filterable: false,
            sortable: false,
            field: 'grace_interest_in_month',
            headerName: 'Thời gian ân hạn lãi',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }, {
            filterable: false,
            sortable: false,
            field: 'interest_rate_type',
            headerName: 'Loại lãi suất',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        }
        , {
            filterable: false,
            sortable: false,
            field: 'reference_interest_rate',
            headerName: 'Lãi suất tham chiếu',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            field: 'interest_rate_rage',
            headerName: 'Biên độ lãi suất',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {

                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },
        {
            filterable: false,
            sortable: false,
            field: 'status_approve',
            headerName: 'Trạng thái phê duyệt',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => {
                return <div className='content-column'>
                    {params.value}
                </div>;
            },

        },
        {
            field: 'action',
            headerName: 'Thao tác',
            sortable: false,
            width: 200,
            align: 'center',
            minWidth: 150,
            headerClassName: 'super-app-theme--header',

            flex: 1,
            renderCell: (params) => {

                const detailBtn = (e) => {
                    e.stopPropagation();
                    console.log(params)
                    navigate(`/sof/detail?id=${params.id}`)

                }
                const deleteBtn = (e) => {
                    e.stopPropagation();
                    setOpenModalDel(true)
                    setInfoDel(params.row)
                }
                const updateBtn = (e) => {
                    e.stopPropagation();
                    navigate(`/sof/update?id=${params.id}`)
                    // });
                }
                const sendBtn = (e) => {
                    e.stopPropagation();
                    sendApproveSOFApi({id:params.id}).then(r=>{
                        setRefresh(!refresh)
                    }).catch(err=>{

                    })
                    console.log(params.row.status_approve)
                }
                const cancelBtn = (e) => {
                    e.stopPropagation();

                    cancelApproveSOFApi({id:params.id}).then(r=>{
                        setRefresh(!refresh)
                    }).catch(err=>{

                    })
                    console.log(params.row.status_approve)
                }
                return <div className='icon-action'>
                    {
                        params.row.created_by !== currentUser.username?'': params.row.status_approve=='Tạo mới'|| params.row.status_approve=='Đã từ chối'?
                        <Tooltip title="Đề xuát phê duyệt" >
                            <CheckBoxOutlinedIcon onClick={sendBtn} style={{color: "rgb(107, 114, 128)"}}></CheckBoxOutlinedIcon>
                        </Tooltip> :
                            params.row.status_approve=='Đang chờ phê duyệt'?
                            <Tooltip title="Hủy phê duyệt" >
                                <CancelPresentationOutlinedIcon onClick={cancelBtn} style={{color: "rgb(107, 114, 128)"}}></CancelPresentationOutlinedIcon>
                            </Tooltip>:''
                    }


                    <Tooltip title="Cập nhật" onClick={updateBtn}>
                        <EditOutlinedIcon style={{color: "rgb(107, 114, 128)"}}></EditOutlinedIcon>
                    </Tooltip>
                    <Tooltip title="Xóa" onClick={deleteBtn}>
                        <DeleteOutlineIcon style={{color: "rgb(107, 114, 128)"}}></DeleteOutlineIcon>
                    </Tooltip>
                    <Tooltip onClick={detailBtn} title="Xem chi tiết">
                        <ArrowForwardIcon style={{color: "rgb(107, 114, 128)"}}></ArrowForwardIcon>
                    </Tooltip>
                </div>;
            },
        },
        // { field: 'document', headerName: 'Nhóm tài sản' },
    ];

    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const submitDelete = () => {
        // alert("tutt20")
        deleteSOFApi(infoDel.id).then(r => {
            toast.success('Xóa thành công', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setRefresh(!refresh);
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
    const redirectAddPage = () => {
        navigate('/sof/create')
    }
    const convertArr = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i].index = (listResult.page) * listResult.pageSize + i + 1;
            if (arr[i].capital_company) {
                arr[i].capital_company_name = arr[i].capital_company.company_name
            } else arr[i].capital_company_name = ''
            if (arr[i].capital_category) {
                arr[i].capital_category_name = arr[i].capital_category.category_name
            } else arr[i].capital_category_name = ''
            if (arr[i].capital_campaign) {
                arr[i].capital_campaign_name = arr[i].capital_campaign.campaign_name
            }
            else arr[i].capital_campaign_name = ''

            if (arr[i].supplier) {
                arr[i].supplier_name = arr[i].supplier.supplier_name
            }
            else arr[i].capital_campaign_name = ''
            // arr[i].asset_type_name = arr[i].asset_type?.asset_type_name;
            // arr[i].initial_value = currencyFormatter(arr[i].initial_value)
            // arr[i].capital_value = currencyFormatter(arr[i].capital_value)
            // arr[i].max_capital_value = currencyFormatter(arr[i].max_capital_value)
            arr[i].lending_amount = currencyFormatter(arr[i].lending_amount)
            if (arr[i].status === 'UNPAID') {
                arr[i].status = "Chưa tất toán"
            } else if (arr[i].status === 'PAID') {
                arr[i].status = "Đã tất toán"
            } else if (arr[i].status === 'A_PART_PRINCIPAL_OFF') {
                arr[i].status = "Off 1 phần gốc"
            } else if (arr[i].status === 'PRINCIPAL_OFF_UNPAID_INTEREST') {
                arr[i].status = "Đã off gốc, chưa trả lãi"
            }
            if(arr[i].status_approve==='DRAFT'){
                arr[i].status_approve="Tạo mới"
            }
            else if(arr[i].status_approve==='APPROVING'){
                arr[i].status_approve="Đang chờ phê duyệt"
            }
            else if(arr[i].status_approve==='APPROVED'){
                arr[i].status_approve="Đã duyệt"
            }
            else if(arr[i].status_approve==='REJECTED'){
                arr[i].status_approve="Đã từ chối"
            }
        }
        return arr;
    }
    const handleChangeCompany = (e) => {
        setCompanySearch(e)
    }
    const handleChangeCategory = (e) => {
        setCategorySearch(e)
    };
    const handleChangeCampaign = (e) => {
        setCampaignSearch(e)
    };
    const handleChangeStatus = (e) => {
        setStatusSearch(e.target.value)
    };
    useEffect(() => {
        getListSOFsApi({
            'page_size': listResult.pageSize,
            'page_index': listResult.page + 1,
            'paging': true,
            'capital_company_id': companySearch === 0 ? null : companySearch,
            'supplier_company_id': companySupplierSearch === 0 ? null : companySupplierSearch,
            'capital_category_id': categorySearch ? categorySearch : null,
            'capital_campaign_id': campaignSearch ? campaignSearch : null,
            'status': statusSearch === 0 ? null : statusSearch,
        }).then(r => {
            setLoading(false)
            console.log("r", r)
            let arr;
            if (r.data.source_of_funds)
                arr = convertArr(r.data.source_of_funds)
            else arr = [];
            console.log("arr tutt", arr)
            setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }, [listResult.page, listResult.pageSize, campaignSearch, categorySearch, companySearch,companySupplierSearch, statusSearch, refresh,currentUser.token])
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
                let arr = r.data.companies.filter(e=> e.company_type==='SUPPLIER')
                let arrSupplier = r.data.companies.filter(e=> e.company_type!=='SUPPLIER')
                setListCompany(convertToAutoComplete(arrSupplier, 'company_name'))
                setListCompanySupplier(convertToAutoComplete(arr, 'company_name'))
                } else {
                setListCompany([])
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
    const getListSOFsApi = (data) => {
        setLoading(true)
        return apiManagerSOF.getListSOF(data);
    }
    const getListCompanyApi = (data) => {
        return apiManagerCompany.getListCompany(data);
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
                <ModalConfirmDel name={infoDel.id+''} openModalDel={openModalDel}
                                 handleCloseModalDel={handleCloseModalDel}
                                 submitDelete={submitDelete}></ModalConfirmDel>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý nguồn vốn
                    </Typography>
                    <div>
                        <Button onClick={pending} variant="text" startIcon={<VerticalAlignTopIcon/>}>Nhập</Button>
                        <Button onClick={pending} style={{marginLeft: '10px',marginRight:'10px'}} variant="text"
                                startIcon={<VerticalAlignBottomIcon/>}>Xuất</Button>
                        <Button onClick={redirectAddPage} variant="outlined" startIcon={<AddIcon/>}>
                            Thêm
                        </Button>
                    </div>
                </div>

            </div>
            <div className={'main-content-body'}>
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
                        <div style={{width: '20%',marginLeft: '20px'}}>
                            <div className={'label-input'}>Công ty cho vay</div>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={listCompanySupplier}
                                // sx={{ width: 300 }}
                                // onChange={}
                                renderInput={(params) => < TextField {...params} placeholder="Công ty vay"/>}
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
                                style={{ width: '100%' }}
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
                        {/*<TreeSelect*/}
                        {/*    showSearch*/}
                        {/*    value={value}*/}
                        {/*    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}*/}
                        {/*    placeholder="Mục đích vay"*/}
                        {/*    allowClear*/}
                        {/*    treeDefaultExpandAll*/}
                        {/*    onChange={onChange}*/}
                        {/*    style={{width: '20%', marginLeft: '20px'}}*/}
                        {/*>*/}
                        {/*    {test}*/}

                        {/*</TreeSelect>*/}
                        <div style={{width: '20%', marginLeft: '20px'}}>
                            <div className={'label-input'}>Hạng mục</div>
                            <TreeSelect
                                style={{ width: '100%' }}
                                showSearch
                                value={categorySearch}
                                treeData={listCategoryTree}
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                placeholder="Hạng mục"
                                allowClear
                                treeDefaultExpandAll
                                onChange={handleChangeCategory}
                                filterTreeNode={(search, item) => {
                                    return item.category_name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                                }}
                                fieldNames={{label: 'category_name', value: 'id', children: 'child_categories'}}
                            >
                            </TreeSelect>
                        </div>

                        <div style={{width: '20%', marginLeft: '20px'}}>
                            <div className={'label-input'}>Trạng thái</div>
                            <FormControl fullWidth >
                                <Select
                                    labelId="asset_type_label"
                                    id='asset_type'
                                    name='asset_type'
                                    value={statusSearch}
                                    onChange={handleChangeStatus}
                                    size={"small"}
                                >
                                    <MenuItem value={0}>Tất cả</MenuItem>
                                    <MenuItem value={'UNPAID'}>Chưa tất toán</MenuItem>
                                    <MenuItem value={'PAID'}>Đã tất toán</MenuItem>
                                    <MenuItem value={'A_PART_PRINCIPAL_OFF'}>Off 1 phần gốc</MenuItem>
                                    <MenuItem value={'PRINCIPAL_OFF_UNPAID_INTEREST'}>Đã off gốc, chưa trả lãi</MenuItem>

                                </Select>
                            </FormControl>
                        </div>

                    </div>

                </Collapse>
                <Divider light/>
                <div className={'main-content-body-result'}>
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
                            onPageChange={(page) => setListResult((prev) => ({...prev, page}))}
                            onPageSizeChange={(pageSize) =>
                                setListResult((prev) => ({...prev, pageSize}))
                            }
                            loading={loading}
                            rowsPerPageOptions={[5, 10, 25]}
                            disableSelectionOnClick
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

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton/>
            {/*<GridToolbarDensitySelector/>*/}
        </GridToolbarContainer>
    );
}
