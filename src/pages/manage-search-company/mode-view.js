import React, {useEffect, useState} from "react";
import Collapse from "@mui/material/Collapse";
import 'react-dropdown-tree-select/dist/styles.css'
// import 'antd/dist/antd.css';
import {TreeSelect} from 'antd';

import {
    Autocomplete,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    TextField, Tooltip,
    Typography
} from "@mui/material";
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {toast, ToastContainer} from "react-toastify";
import {DataGrid, GridColDef, viVN} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import {
    capitalizeFirstLetter,
    checkColumnVisibility,
    convertToAutoComplete,
    currencyFormatter,
    VNnum2words
} from "../../constants/utils";
import apiManagerSOF from "../../api/manage-sof";
import apiManagerCompany from "../../api/manage-company";
import apiManagerCategory from "../../api/manage-category";
import apiManagerCampaign from "../../api/manage-campaign";
import {useSelector} from "react-redux";
import apiManagerSupplier from "../../api/manage-supplier";
import {NumericFormat} from "react-number-format";
import apiManagerMember from "../../api/manage-member";
import ModalConfirm from "../../components/ModalConfirm";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import RemoveIcon from '@mui/icons-material/Remove';
import dayjs from "dayjs";
export default function ModeView() {
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
    const [companySearch, setCompanySearch] = useState()
    const [companySupplierSearch, setCompanySupplierSearch] = useState()
    const [remainAmount, setRemainAmount] = useState(0)
    const [statusSearch, setStatusSearch] = useState(3)
    const [openSearch, setOpenSearch] = useState(true)
    const [listResult, setListResult] = useState([])
    const [listConvert, setListConvert] = useState([])


    window.addEventListener("storage", message_receive);


    function message_receive(e) {
        if (e.key == 'broadcast') {
            var message = JSON.parse(e.newValue); // ch??? check v???i key l?? 'broadcast'
        }

        if (!message) return; // n???u message r???ng th?? b??? qua

        // ??? ????y b???n c?? th??? x??? l?? message ???? nh???n.
        // b???n c?? th??? g???i object d???ng { 'title': 'ti??u ?????', 'message': 'n???i dung' }
        console.log("message", message);
        setListResult(message)
        // v??n v??n.
        // m??y m??y.
    };
    useEffect(() => {
        setListResult(currentUser.listSelectCompany);

    }, [])
    useEffect(() => {
        let objectCampaignSearch = listCampaign.filter(e => e.id === campaignSearch)
        let nameCampaign = undefined;
        if (objectCampaignSearch.length > 0) {
            nameCampaign = objectCampaignSearch[0].campaign_name
        }
        let listSearch = listResult.filter(e => checkSearch(e, nameCampaign, companySearch, companySupplierSearch, statusSearch, remainAmount, represent))
        for (let i = 0; i < listSearch.length; i++) {
            // listResult[i].index = i + 1;
        }
        setListConvert(listSearch);
    }, [listResult, campaignSearch, companySearch, companySupplierSearch, statusSearch, remainAmount, represent])

    function checkSearch(e, campaignSearch, companySearch, companySupplierSearch, statusSearch, remainAmount, represent) {
        let status = undefined;
        console.log("statusSearch", statusSearch)
        if (statusSearch == true) {
            status = "Ch??a vay"
        } else if (statusSearch == false) {
            status = "??ang vay"
        }

        if (campaignSearch && e.campaign_name != campaignSearch) {
            return false;
        }
        if (companySearch && e.company_name != companySearch) {
            return false;
        }
        if (companySupplierSearch && e.supplier_name != companySupplierSearch) {
            return false;
        }
        console.log("status", status)
        console.log("e.status", e.status)
        if (status && e.status != status) {
            return false;
        }
        if (represent.memberName != '' && e.member_name != represent.memberName) {
            return false;
        }

        if (parseFloat(e.remain_amount) < remainAmount) {
            return false;
        }
        return true;
    }

    const columns: GridColDef[] = [
        {
            field: 'action',
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('company', 'action'),
            headerName: '',
            sortable: false,
            width: 60,
            minWidth: 60,
            align: 'center',
            // flex: 1,
            renderCell: (params) => {

                const updateBtn = (e) => {
                    e.stopPropagation();
                    let index = params.api.getRowIndex(params.row.id)
                    setListConvert()
                    setListConvert([
                        ...listConvert.slice(0, index),
                        ...listConvert.slice(index + 1)
                    ])
                    // navigate(`/member/update?id=${params.id}`)
                    // });
                }
                return <div className='icon-action' style={{display:"flex",justifyContent:'center',alignItems:'center'}}>
                    <Tooltip title="X??a" onClick={updateBtn}>
                        <RemoveIcon style={{color: "rgb(107, 114, 128)",marginLeft:'1px'}}></RemoveIcon>
                    </Tooltip>
                </div>;
            },
        },
        {
            sortable: false,
            field: 'index',
            headerName: 'STT',
            maxWidth: 60,
            filterable: false,
            headerClassName: 'super-app-theme--header',
            hide: checkColumnVisibility('sof', 'index'),
            renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
        },
        {
            sortable: false,
            field: 'company_name',
            headerName: 'T??n c??ng ty',
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
            headerName: 'T??nh tr???ng',
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
            headerName: '?????i di???n ph??p lu???t',
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
            headerName: 'S??? ti???n vay t???i ??a',
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
            headerName: 'M?? kho???n vay',
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
            headerName: 'S??? ti???n ???? vay',
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
            headerName: 'S??? ti???n vay c??n l???i',
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
            headerName: 'M???c ????ch vay',
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
            headerName: '?????i t?????ng cung c???p v???n',
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
        // { field: 'document', headerName: 'Nh??m t??i s???n' },
    ];

    const handleCloseModalConfirm = () => {
        setOpenModalConfirm(false)
    }


    const handleChangeCampaign = (e) => {
        console.log("e", e)
        setCampaignSearch(e)
    };
    const handleChangeStatus = (e) => {
        setStatusSearch(e.target.value)
    };
    useEffect(() => {

    }, [campaignSearch, companySearch, companySupplierSearch, statusSearch, refresh, currentUser.token, remainAmount, represent])
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

    }, [currentUser.token])

    // const { data } = useDemoData({
    //     dataSet: 'Commodity',
    //     rowLength: 20,
    //     maxColumns: 5,
    // });


    const submitUpdateCapitalLimit = () => {
        updateCapitalLimitApi(capitalLimit).then(r => {
            toast.success('C???p nh???t th??nh c??ng', {
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
                        Danh s??ch l??m vi???c
                    </Typography>
                </div>

            </div>
            <div className={'main-content-body company-manage-body'}>
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
                            <div className={'label-input'}>C??ng ty vay</div>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={listCompany}
                                // sx={{ width: 300 }}
                                // onChange={}
                                renderInput={(params) => < TextField {...params} placeholder="C??ng ty vay"/>}
                                size={"small"}
                                onChange={(event, newValue) => {
                                    console.log("new_value", newValue)
                                    if (newValue)
                                        setCompanySearch(newValue.label)
                                    else setCompanySearch(null)
                                }}
                            />
                        </div>
                        <div style={{width: '20%', marginLeft: '20px'}}>
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
                            <div className={'label-input'}>?????i t?????ng cung c???p v???n</div>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={listCompanySupplier}
                                // sx={{ width: 300 }}
                                // onChange={}
                                renderInput={(params) => < TextField {...params} placeholder="?????i t?????ng cung c???p v???n"/>}
                                size={"small"}
                                onChange={(event, newValue) => {
                                    console.log("new_value", newValue)
                                    if (newValue)
                                        setCompanySupplierSearch(newValue.label)
                                    else setCompanySupplierSearch(null)
                                }}
                            />
                        </div>
                        <div style={{width: '20%', marginLeft: '20px'}}>
                            <div className={'label-input'}>M???c ????ch vay</div>
                            <TreeSelect
                                style={{width: '100%'}}
                                showSearch
                                value={campaignSearch}
                                treeData={listCampaignTree}
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                placeholder="M???c ????ch vay"
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
                            <div className={'label-input'}>Tr???ng th??i</div>
                            <FormControl fullWidth>
                                <Select
                                    labelId="asset_type_label"
                                    id='asset_type'
                                    name='asset_type'
                                    value={statusSearch}
                                    onChange={handleChangeStatus}
                                    size={"small"}
                                >
                                    <MenuItem value={3}>T???t c???</MenuItem>
                                    <MenuItem value={false}>??ang vay</MenuItem>
                                    <MenuItem value={true}>Ch??a vay</MenuItem>


                                </Select>
                            </FormControl>
                        </div>
                        <div style={{width: '20%', marginLeft: '20px'}}>
                            <div className={'label-input'}>S??? ti???n vay c??n l???i l???n h??n ho???c b???ng</div>
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
                                    endAdornment: <InputAdornment position="end">VN??</InputAdornment>,

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
                                {remainAmount ? `*B???ng ch???: ${capitalizeFirstLetter(VNnum2words(remainAmount))} ?????ng` : ''}
                            </Typography>
                        </div>
                    </div>

                </Collapse>
                <Divider light/>
                <div className={'main-content-body-result sticky-body'}>
                    <div style={{height: '100%', width: '100%'}}>
                        <DataGrid
                            // getRowHeight={() => 'auto'}
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                            labelRowsPerPage={"S??? k???t qu???"}
                            density="standard"
                            rows={listConvert}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[5]}
                            // loading={loading}
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

                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

