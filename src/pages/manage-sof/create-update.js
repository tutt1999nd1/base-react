import React, {useEffect, useState} from "react";

import {
    Autocomplete,
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {NumericFormat} from 'react-number-format';

import {toast, ToastContainer} from "react-toastify";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PropTypes from "prop-types";
import {
    capitalizeFirstLetter,
    convertToAutoComplete,
    convertToAutoCompleteMail,
    currencyFormatter,
    listOptionMonth,
    VNnum2words
} from "../../constants/utils";
import apiManagerSOF from "../../api/manage-sof";
import apiManagerCompany from "../../api/manage-company";
import apiManagerCategory from "../../api/manage-category";
import apiManagerCampaign from "../../api/manage-campaign";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {TreeSelect} from "antd";
import TextFieldLink from "../../components/TextFieldLink";
import Axios from "axios";
import {useSelector} from "react-redux";
import apiManagerSupplier from "../../api/manage-supplier";
import {DataGrid, GridColDef, viVN} from "@mui/x-data-grid";
import Checkbox from '@mui/material/Checkbox';
export default function EditSOF(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [companySearch, setCompanySearch] = useState();
    const [companyCurrent, setCompanyCurrent] = useState({})
    const [idCompanyCurrent, setIdCompanyCurrent] = useState(0);
    const [listCompany, setListCompany] = useState([]);
    const [listCompanySupplier, setListCompanySupplier] = useState([]);
    const [listFileLocal, setListFileLocal] = useState([])
    const [listLink, setListLink] = useState([])
    const [listLinkServer, setListLinkServer] = useState([])
    const [listDeleteLinkServer, setListDeleteLinkServer] = useState([])
    const [listFileServer, setListFileServer] = useState([])
    const [currentAmount, setCurrentAmount] = useState(0)
    const [listDeletedAttachment, setListDeletedAttachment] = useState([])
    const [listCategoryTree, setListCategoryTree] = useState([]);
    const [categorySearch, setCategorySearch] = useState()
    const [isGrace, setIsGrace] = useState(false);
    const [campaignSearch, setCampaignSearch] = useState()
    const [listCampaignTree, setListCampaignTree] = useState([]);
    const [listPrincipalConfig, setListPrincipalConfig] = useState([]);
    const [listInterestConfig, setListInterestConfig] = useState([]);
    const currentUser = useSelector(state => state.currentUser)
    const [listUser, setListUser] = useState([{id: '1', 'label': '1'}])

    const [info, setInfo] = useState({
        id: '',
        capital_company: {},
        capital_category: {},
        capital_campaign: {},
        supplier: {},
        supplier_id: '',
        capital_company_id: '',
        capital_category_id: '',
        capital_campaign_id: '',
        lending_amount: '',
        owner_full_name: '',
        approve_name: '',
        lending_start_date: new dayjs,
        status: '',
        lending_in_month: '',
        interest_period: '',
        principal_period: '',
        interest_rate: '',
        grace_principal_in_month: '',
        grace_interest_in_month: '',
        interest_rate_type: 'C??? ?????nh',
        reference_interest_rate: '',
        interest_rate_rage: '',
        changing_date: new dayjs,
        list_attachments: [],
        payable_principal_config_entities: [],
        payable_interest_config_entities: [],
        is_grace: '',
    })
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        capital_company_id: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        capital_campaign_id: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        capital_category_id: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        supplier_id: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        approve_name: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        principal_period: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'), // .matches( /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,"Nh???p ????ng ?????nh d???ng s??? ??i???n tho???i"),
        lending_amount: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        owner_full_name: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        lending_start_date: yup.string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        status: yup.string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        lending_in_month: yup.string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        interest_period: yup.string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        interest_rate: yup.string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        grace_principal_in_month: yup.string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        grace_interest_in_month: yup.string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),
        interest_rate_type: yup.string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng'),

    });

    const [lendingStartDate, setLendingStartDate] = useState(new dayjs)
    const [lendingAmount, setLendingAmount] = useState('')
    const [gracePrincipalInMonth, setGracePrincipalInMonth] = useState('')
    const [graceInterestInMonth, setGraceInterestInMonth] = useState('')
    const [lendingInMonth, setLendingInMonth] = useState('')
    const [principalPeriod, setPrincipalPeriod] = useState('')
    const [interestPeriod, setInterestPeriod] = useState('')
    useEffect(() => {
        defaultPayable(lendingStartDate, lendingInMonth, gracePrincipalInMonth, principalPeriod, lendingAmount, interestPeriod, graceInterestInMonth)
    }, [lendingStartDate, lendingAmount, gracePrincipalInMonth, graceInterestInMonth, lendingInMonth, principalPeriod, interestPeriod])
    const backList = () => {
        navigate('/sof')
    }
    useEffect(() => {
        if (isUpdate) {
            if (location.get('id')) {
                setIdUpdate(location.get('id'));
            } else navigate('/sof')
        }

    }, [location])
    useEffect(() => {
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

        Axios.get('https://graph.microsoft.com/v1.0/users?$top=999', {
            headers: {'Authorization': `Bearer ${currentUser.tokenGraphApi}`},
            // responseType: 'blob'
        }).then(users => {
            console.log('users.value', users.data.value)
            let arrConvert = convertToAutoCompleteMail(users.data.value, 'mail')
            setListUser(arrConvert)
        }).catch(e => {
            // window.location.reload();
            localStorage.clear()
        })
    }, [])
    useEffect(() => {
        getListCompanyApi({paging: false}).then(r => {
            if (r.data.companies) {
                setListCompany(convertToAutoComplete(r.data.companies, 'company_name'))
            } else {
                setListCompany([])
            }
        }).catch(e => {
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

    }, [currentAmount])
    useEffect(() => {
        if (isUpdate && idUpdate) {
            getListSOFApi({id: idUpdate, page_size: 1}).then(r => {
                setInfo(r.data.source_of_funds[0])
                console.log("r.data.source_of_funds[0]",r.data.source_of_funds[0])

            }).catch(e => {

            })
        }
    }, [idUpdate])
    useEffect(() => {
        console.log("listPrincipalConfig",listPrincipalConfig)
        console.log("listInterestConfig",listInterestConfig)
    }, [listPrincipalConfig,listInterestConfig])
    const handleChangeIsGrace = (event) => {
        setIsGrace(event.target.checked);
    }
    const createSOFApi = (data) => {
        return apiManagerSOF.createSOF(data);
    }
    const updateSOFApi = (data) => {
        return apiManagerSOF.updateSOF(idUpdate, data);
    }
    const getListSOFApi = (data) => {
        return apiManagerSOF.getListSOF(data);
    }
    const getListCompanyApi = (data) => {
        return apiManagerCompany.getListCompany(data);
    }

    const getListSupplierApi = (data) => {
        return apiManagerSupplier.getListSupplier(data);
    }
    const getListCategoryApi = (data) => {
        return apiManagerCategory.getListCategory(data);
    }
    const getListCampaignApi = (data) => {
        return apiManagerCampaign.getListCampaign(data);
    }
    const getListCategoryTreeApi = (data) => {
        return apiManagerCategory.getListCategoryTree(data);
    }
    const getListCampaignTreeApi = (data) => {
        return apiManagerCampaign.getListCampaignTree(data);
    }
    const back = () => {
        navigate('/sof')
    }
    const convert = () => {

    }
    useEffect(() => {
        setListFileServer(info.list_attachments.filter(e => e.attachment_type === 'LOCAL'))
        setListLinkServer(info.list_attachments.filter(e => e.attachment_type === "REFERENCE"))
        setCategorySearch(info.capital_category.id)
        setCampaignSearch(info.capital_campaign.id)
        setCompanySearch({id: info.capital_company.id, label: info.capital_company.company_name})
        setLendingStartDate(dayjs(info.lending_start_date, 'DD-MM-YYYY'))
        setLendingInMonth(info.lending_in_month)
        setGraceInterestInMonth(info.grace_interest_in_month)
        setGracePrincipalInMonth(info.grace_principal_in_month)
        setPrincipalPeriod(info.principal_period)
        setInterestPeriod(info.interest_period)
        setLendingAmount(info.lending_amount)
        if(info.is_grace==null){
            setIsGrace(false)
        }else
        setIsGrace(!info.is_grace)
        setTimeout(()=>{
            setListPrincipalConfig(info.payable_principal_config_entities)
            setListInterestConfig(info.payable_interest_config_entities)
        },500)

    }, [info])
    useEffect(() => {
        getListCompanyApi({id: idCompanyCurrent, paging: false}).then(r => {
            if (r.data.companies) {
                console.log("r.data.companies", r.data.companies)
                setCompanyCurrent(r.data.companies[0])
            } else {
                setCompanyCurrent(null)
            }
        }).catch(e => {

        })
    }, [idCompanyCurrent])
    const deleteFileLocal = (name) => {
        let arr = [...listFileLocal]
        let indexRemove = listFileLocal.findIndex(e => e.name === name)
        if (indexRemove !== -1) {
            arr.splice(indexRemove, 1);
            setListFileLocal(arr)
        }

    }
    const addNewLink = () => {
        setListLink([...listLink, {download_link: '', attachment_type: ''}])
    }
    const deleteValueLink = (index, item) => {
        setListLink([...listLink.slice(0, index), ...listLink.slice(index + 1)
        ])
    }
    const deleteValueLinkServer = (index, item) => {
        setListLinkServer([...listLinkServer.slice(0, index), ...listLinkServer.slice(index + 1)
        ])
        setListDeleteLinkServer([...listDeleteLinkServer, item.id])
    }
    const changeValueLink = (value, index) => {
        setListLink([...listLink.slice(0, index), {
            ...listLink[index],
            download_link: value
        }, ...listLink.slice(index + 1)
        ])
    }
    const deleteFileServer = (id, name) => {
        let arr = [...listFileServer]
        console.log("Arr", arr)
        let indexRemove = listFileServer.findIndex(e => e.file_name === name)
        if (indexRemove !== -1) {
            arr.splice(indexRemove, 1);
            setListFileServer(arr)
        }
        let copyListDeleteServer = [...listDeletedAttachment]
        copyListDeleteServer.push(id)
        setListDeletedAttachment(copyListDeleteServer)
    }
    const checkFileLocaleAlready = (name) => {
        let index = listFileLocal.findIndex(e => e.name === name)
        let index2 = listFileServer.findIndex(e => e.file_name === name)
        if (index2 !== -1) {
            return true
        }
        if (index !== -1) {
            return true
        }
        return false;
    }
    const uploadFile = () => {
        var el = window._protected_reference = document.createElement("INPUT");
        el.type = "file";
        // el.accept = "image/*,.txt";
        el.multiple = "multiple";
        el.addEventListener('change', function (ev2) {
            let result = [];
            let resultFiles = [];
            if (el.files.length) {
                for (let i = 0; i < el.files.length; i++) {
                    if (!checkFileLocaleAlready(el.files[i].name)) {
                        resultFiles.push(el.files[i])
                    }
                }
            }
            new Promise(function (resolve) {
                setTimeout(function () {
                    console.log(el.files);
                    resolve();

                }, 1000);

                let copyState = [...listFileLocal];
                // copyState.concat(resultFiles)
                copyState.push.apply(copyState, resultFiles);

                setListFileLocal(copyState)
            })
                .then(function () {
                    // clear / free reference
                    el = window._protected_reference = undefined;
                });
        });

        el.click();
    }

    const columnsInterest: GridColDef[] = [
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
            field: 'end_date',
            headerName: 'Ng??y tr???',
            headerClassName: 'super-app-theme--header',
            minWidth: 250,
            flex: 1,
            renderCell: (params) => {
                return <div className='content-column'>

                    <LocalizationProvider style={{width: '100%'}} dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            style={{width: '100% !important'}}
                            inputFormat="DD-MM-YYYY"
                            value={dayjs(params.value, 'DD-MM-YYYY')}
                            // maxDate={dayjs(params.value, 'DD-MM-YYYY')}
                            minDate={params.api.getRowIndex(params.row.id) == 0 ? lendingStartDate.add(graceInterestInMonth, 'month') : dayjs(listInterestConfig[params.api.getRowIndex(params.row.id) - 1].end_date, 'DD-MM-YYYY').add(1, 'day')}
                            maxDate={lendingStartDate.add(lendingInMonth, 'month')}
                            // minDate={dayjs(listPrincipalConfig[0].end_date,'DD-MM-YYYY')}
                            // onChange={(values) => {
                            //     console.log(values)
                            //
                            // }}
                            onChange={value => handleChangeDateInterestConfig(params.api.getRowIndex(params.row.id), value)}
                            renderInput={(params) => <TextField size={"small"} fullWidth {...params} />}
                        />
                    </LocalizationProvider>
                </div>;
            },
        }

        // { field: 'document', headerName: 'Nh??m t??i s???n' },
    ];
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
            field: 'end_date',
            headerName: 'Ng??y tr???',
            headerClassName: 'super-app-theme--header',
            minWidth: 250,
            flex: 1,
            renderCell: (params) => {
                return <div className='content-column'>

                    <LocalizationProvider style={{width: '100%'}} dateAdapter={AdapterDayjs}>
                        {/*{console.log('listPrincipalConfig[params.api.getRowIndex(params.row.id)-1].end_date',listPrincipalConfig[params.api.getRowIndex(params.row.id)-1].end_date)}*/}
                        {console.log('listPrincipalConfig1', listPrincipalConfig[0].end_date)}
                        {console.log('listPrincipalConfig2', dayjs(listPrincipalConfig[0].end_date, 'DD-MM-YYYY'))}
                        <DesktopDatePicker
                            style={{width: '100% !important'}}
                            inputFormat="DD-MM-YYYY"
                            value={dayjs(params.value, 'DD-MM-YYYY')}
                            // maxDate={dayjs(params.value, 'DD-MM-YYYY')}
                            minDate={params.api.getRowIndex(params.row.id) == 0 ? lendingStartDate.add(gracePrincipalInMonth, 'month') : dayjs(listPrincipalConfig[params.api.getRowIndex(params.row.id) - 1].end_date, 'DD-MM-YYYY').add(1, 'day')}
                            maxDate={lendingStartDate.add(lendingInMonth, 'month')}
                            // minDate={dayjs(listPrincipalConfig[0].end_date,'DD-MM-YYYY')}
                            // onChange={(values) => {
                            //     console.log(values)
                            //
                            // }}
                            onChange={value => handleChangeDatePrincipalConfig(params.api.getRowIndex(params.row.id), value)}
                            renderInput={(params) => <TextField size={"small"} fullWidth {...params} />}
                        />
                    </LocalizationProvider>
                </div>;
            },
        },
        {
            filterable: false,
            sortable: false,
            field: 'amount',
            headerName: 'S??? ti???n tr???',
            headerClassName: 'super-app-theme--header',
            minWidth: 250,
            flex: 1,
            renderCell: (params) => {
                return <div className='content-column'>
                    <NumericFormat
                        size={'small'}
                        customInput={TextField}
                        name='lending_amount'
                        className={'formik-input text-right'}
                        thousandSeparator={"."}
                        decimalSeparator={","}
                        value={params.value}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">VN??</InputAdornment>,
                        }}
                        onValueChange={(values) => {
                            const {formattedValue, value, floatValue} = values;
                            // do something with floatValue
                            console.log(floatValue)

                            const re = /^[0-9\b]+$/;
                            if (re.test(floatValue) || floatValue === undefined) {
                                // setFieldValue('lending_amount', floatValue)
                                // setCurrentAmount(floatValue)
                                handleChangeAmountPrincipalConfig(params.api.getRowIndex(params.row.id), floatValue)
                            }
                            // setFieldValue('max_capital_value', formattedValue)

                        }}

                    />
                </div>;
            },
        }

        // { field: 'document', headerName: 'Nh??m t??i s???n' },
    ];
    const handleChangeAmountPrincipalConfig = (index, amount) => {
        console.log("index", index)
        console.log("amount", amount)

        setListPrincipalConfig([
            ...listPrincipalConfig.slice(0, index),
            {
                ...listPrincipalConfig[index],
                amount: amount
            },
            ...listPrincipalConfig.slice(index + 1)
        ])
    }
    useEffect(() => {
        console.log(listPrincipalConfig)
    }, [listPrincipalConfig])
    const handleChangeDatePrincipalConfig = (index, date) => {
        // console.log("index",index)
        // console.log("amount",amount)
        console.log('date', dayjs(date).format('DD-MM-YYYY'))
        setListPrincipalConfig([
            ...listPrincipalConfig.slice(0, index),
            {
                ...listPrincipalConfig[index],
                end_date: dayjs(date).format('DD-MM-YYYY')
            },
            ...listPrincipalConfig.slice(index + 1)
        ])
    }
    const handleChangeDateInterestConfig = (index, date) => {
        // console.log("index",index)
        // console.log("amount",amount)
        setListInterestConfig([
            ...listInterestConfig.slice(0, index),
            {
                ...listInterestConfig[index],
                end_date: dayjs(date).format('DD-MM-YYYY')
            },
            ...listInterestConfig.slice(index + 1)
        ])
    }
    const defaultPayable = (lendingStartDate, lendingInMonth, gracePrincipalInMonth, principalPeriod, lendingAmount, interestPeriod, graceInterestInMonth) => {
        console.log("lendingStartDate", lendingStartDate)
        console.log("lendingInMonth", lendingInMonth)
        console.log("gracePrincipalInMonth", gracePrincipalInMonth)
        console.log("principalPeriod", principalPeriod)
        console.log("lendingAmount", lendingAmount)
        console.log("interestPeriod", interestPeriod)
        console.log("graceInterestInMonth", graceInterestInMonth)
        let monthOfPeriodPrincipal = (lendingInMonth - gracePrincipalInMonth) / principalPeriod;
        console.log("monthOfPeriodPrincipal", monthOfPeriodPrincipal)
        //ng??y b???t ?????u tr??? g???c ph???i t??nh t??? sau ??n h???n
        // let afterGracePrincipal = DatetimeUtils.getCalendar(entity.getLendingStartDate(), Calendar.MONTH, entity.getGracePrincipalInMonth()).getTime();
        let afterGracePrincipal = lendingStartDate.add(gracePrincipalInMonth, 'month');
        // console.log("afterGracePrincipal",dayjs(afterGracePrincipal).format('DD-MM-YYYY'))
        //s??? ti???n g???c ph???i tr??? m???c ?????nh qua c??c k??? khi ch??a c?? thay ?????i g???c
        // let amountPeriod = (entity.getLendingAmount()).divide(new BigDecimal(entity.getPrincipalPeriod()), RoundingMode.HALF_UP);
        let amountPeriod = lendingAmount / principalPeriod
        // //ng??y b???t ?????u
        let startDatePrincipal = afterGracePrincipal;
        // //ng??y tr??? g???c
        let payableDatePrincipal = null;
        // //ng??y tr??? g???c ph???
        let extraPayableDatePrincipal = null;
        let listConfigPrincipal = [];
        for (let i = 0; i < principalPeriod; i++) {
            //ng??y k???t th??c
            payableDatePrincipal = afterGracePrincipal.add((i + 1) * monthOfPeriodPrincipal, 'month')
            if (i > 0) {
                startDatePrincipal = extraPayableDatePrincipal;
            }
            if (getSpecialDate(payableDatePrincipal) > 0 && i < principalPeriod - 1) {
                // payableDatePrincipal = DatetimeUtils.getCalendar(payableDatePrincipal, Calendar.DATE, getSpecialDate(payableDatePrincipal)).getTime();
                payableDatePrincipal = payableDatePrincipal.add(getSpecialDate(payableDatePrincipal), 'day')
            }
            extraPayableDatePrincipal = payableDatePrincipal;
            listConfigPrincipal.push({
                id: i,
                start_date: dayjs(startDatePrincipal).format('DD-MM-YYYY'),
                end_date: dayjs(payableDatePrincipal).format('DD-MM-YYYY'),
                amount: Math.round(amountPeriod)
            });
        }
        setListPrincipalConfig(listConfigPrincipal);
        console.log("listConfigPrincipal", listConfigPrincipal)
        let listConfigInterest = [];
        let monthOfPeriodInterest = (lendingInMonth - graceInterestInMonth) / interestPeriod;
        //ng??y b???t ?????u t??nh l??i sau ??n h???n
        let afterGraceInterest = lendingStartDate.add(graceInterestInMonth, 'month')
        //s??? ti???n l??i m???c ?????nh khi ch??a thay ?????i l??i su???t
        //ng??y b???t ?????u t??nh l??i l??i, c??ng l?? ng??y b???t ?????u t??nh l??i c???a k??? ti???p theo
        let startDateInterest = afterGraceInterest;
        //ng??y cu???i c??ng t??nh l??i c???a 1 k???
        let payableDateInterest = null;
        //set ng??y tr??? l??i ph???
        let extraPayableDateInterest = null;
        //add c??c k??? tr??? l??i v??o b???ng payable period
        for (let i = 0; i < interestPeriod; i++) {
            //ng??y k???t th??c
            payableDateInterest = afterGraceInterest.add((i + 1) * monthOfPeriodInterest, 'month')
            //             //n???u i > th?? set ng??y b???t ?????u = ng??y tr??? l??i ph???
            if (i > 0) {
                startDateInterest = extraPayableDateInterest;
            }
            //ki???m tra n???u c?? ng??y ?????c bi???t v?? i ch??a ?????n index cu???i c??ng
            if (getSpecialDate(payableDateInterest) > 0 && i < interestPeriod - 1) {
                payableDateInterest = payableDateInterest.add(getSpecialDate(payableDateInterest), 'day')
            }
            extraPayableDateInterest = payableDateInterest;

            listConfigInterest.push({
                id: i,
                start_date: dayjs(startDateInterest).format('DD-MM-YYYY'),
                end_date: dayjs(payableDateInterest).format('DD-MM-YYYY'),
            });
        }
        console.log("listConfigInterest", listConfigInterest)
        setListInterestConfig(listConfigInterest)
    }
    const getSpecialDate = (date) => {
        let dateConvert = date.toDate();
        let number = 0;
        if (dateConvert.getDay() == 0) {
            number = 1;
        } else if (dateConvert.getDay() == 6) {
            number = 2;
        }
        return number;
    }
    return (<div className={'main-content'}>
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
        <Button onClick={back} style={{marginBottom: '10px'}} variant="text" startIcon={<KeyboardBackspaceIcon/>}>Ngu???n
            v???n
        </Button>

        <div className={'main-content-header'}>
            <div className={'row'} style={{justifyContent: 'space-between'}}>
                <Typography variant="h5" className={'main-content-tittle'}>
                    Qu???n l?? ngu???n v???n
                </Typography>
            </div>
        </div>
        <div className={'main-content-body'}>
            <div className={'main-content-body-tittle'}>
                <h4>{isUpdate ? 'C???p nh???t' : 'Th??m m???i'} </h4>
            </div>
            <Divider light/>
            <Formik
                enableReinitialize
                initialValues={{
                    capital_company_id: idUpdate ? info.capital_company.id : info.capital_company_id,
                    capital_category_id: idUpdate ? info.capital_category.id : info.capital_category_id,
                    capital_campaign_id: idUpdate ? info.capital_campaign.id : info.capital_campaign_id,
                    capital_campaign_name: info.capital_company.company_name || '',
                    supplier_id: idUpdate ? info.supplier.id : info.supplier_id,
                    supplier_name: info.supplier.supplier_name || '',
                    // asset_group:info.asset_group.id,
                    lending_amount: info.lending_amount,
                    owner_full_name: info.owner_full_name,
                    principal_period: info.principal_period,
                    // lending_start_date: idUpdate?dayjs(info.lending_start_date).format('DD-MM-YYYY'):info.lending_start_date,
                    lending_start_date: idUpdate ? dayjs(info.lending_start_date, 'DD-MM-YYYY') : info.lending_start_date,
                    status: info.status,
                    lending_in_month: info.lending_in_month,
                    interest_period: info.interest_period,
                    interest_rate: info.interest_rate,
                    approve_name: info.approve_name,
                    grace_principal_in_month: info.grace_principal_in_month,
                    grace_interest_in_month: info.grace_interest_in_month,
                    interest_rate_type: info.interest_rate_type,
                    reference_interest_rate: info.reference_interest_rate,
                    interest_rate_rage: info.interest_rate_rage,
                    changing_date: info.changing_date,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    // setInfoAccount();
                    // submitAccount();
                    // defaultPayable(values.lending_start_date,values.lending_in_month,values.grace_principal_in_month,values.principal_period,values.lending_amount)
                    if (campaignSearch && categorySearch) {
                        let valueConvert = values;
                        let formData = new FormData();

                        for (let i = 0; i < listFileLocal.length; i++) {
                            formData.append('newAttachment', listFileLocal[i])
                        }
                        for (let i = 0; i < listLink.length; i++) {
                            formData.append('newReferenceLink', listLink[i].download_link)
                        }
                        dayjs(values.founding_date).format('DD-MM-YYYY')
                        formData.append('capitalCampaignId', values.capital_campaign_id)
                        formData.append('capitalCategoryId', values.capital_category_id)
                        formData.append('capitalCompanyId', values.capital_company_id)
                        formData.append('status', values.status)
                        formData.append('ownerFullName', values.owner_full_name)
                        formData.append('createdBy', currentUser.username)
                        formData.append('lendingStartDate', dayjs(values.lending_start_date).format('DD-MM-YYYY'))
                        formData.append('lendingInMonth', values.lending_in_month)
                        formData.append('principalPeriod', values.principal_period)
                        formData.append('interestPeriod', values.interest_period)
                        formData.append('interestRate', values.interest_rate)
                        formData.append('lendingAmount', values.lending_amount)
                        formData.append('approveName', values.approve_name)
                        formData.append('gracePrincipalInMonth', values.grace_principal_in_month)
                        formData.append('graceInterestInMonth', values.grace_interest_in_month)
                        formData.append('interestRateType', values.interest_rate_type)
                        formData.append('isGrace', !isGrace)
                        if (values.reference_interest_rate)
                            formData.append('referenceInterestRate', values.reference_interest_rate)
                        if (values.interest_rate_rage)
                            formData.append('interestRateRage', values.interest_rate_rage)
                        formData.append('supplierId', values.supplier_id)
                        for (let i = 0; i < listPrincipalConfig.length; i++) {
                            formData.append('listTimePrincipal', listPrincipalConfig[i].end_date)
                            formData.append('listAmountPrincipal', listPrincipalConfig[i].amount)
                        }
                        for (let i = 0; i < listInterestConfig.length; i++) {
                            formData.append('listTimeInterest', listInterestConfig[i].end_date)
                        }

                        // formData.append('listPrincipalConfig', listPrincipalConfig)
                        // formData.append('listInterestConfig', listInterestConfig)

                        // formData.append('currentCreditValue',values.)
                        if (isUpdate) {
                            formData.append('changingDate', dayjs(values.changing_date).format('DD-MM-YYYY'))
                            console.log("listDeletedAttachment", listDeletedAttachment)
                            for (let i = 0; i < listDeletedAttachment.length; i++) {
                                formData.append('listDeletedAttachment', listDeletedAttachment[i])
                            }
                            for (let i = 0; i < listDeleteLinkServer.length; i++) {
                                formData.append('listDeletedAttachment', listDeleteLinkServer[i])
                            }
                            updateSOFApi(formData).then(r => {
                                toast.success('C???p nh???t th??nh c??ng', {
                                    position: "top-right",
                                    autoClose: 1500,
                                    hideProgressBar: true,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                });
                                setTimeout(() => {
                                    // navigate(`/sof/detail?id=${idUpdate}`)
                                    navigate(`/sof`)

                                }, 1050);

                            }).catch(e => {
                                console.log(e)
                            })


                        } else {

                            createSOFApi(formData).then(r => {
                                toast.success('Th??m m???i th??nh c??ng', {
                                    position: "top-right",
                                    autoClose: 1500,
                                    hideProgressBar: true,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                });
                                setTimeout(() => {
                                    // navigate(`/sof/detail?id=${r.data.id}`)
                                    navigate(`/sof`)
                                }, 1050);

                            }).catch(e => {
                                console.log(e)
                            })
                        }
                    }

                }}
            >
                {props => {
                    const {
                        values, touched, errors, handleChange, setFieldValue, handleSubmit
                    } = props;
                    return (<Form onSubmit={handleSubmit}>
                        <Box sx={{flexGrow: 1}} className={'form-content'}>
                            <Grid container spacing={4}>

                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>C??ng ty vay<span className={'error-message'}>*</span>
                                    </div>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={listCompany}
                                        value={{
                                            id: values.capital_company_id,
                                            label: values.capital_campaign_name
                                        }
                                        }

                                        renderInput={(params) => < TextField  {...params} id='capital_company_id'
                                                                              name='capital_company_id'
                                                                              placeholder="C??ng ty vay"
                                                                              error={touched.capital_company_id && Boolean(errors.capital_company_id)}
                                                                              helperText={touched.capital_company_id && errors.capital_company_id}/>}
                                        size={"small"}
                                        onChange={(event, newValue) => {
                                            // setCompanySearch(newValue)
                                            console.log("new_value", newValue)
                                            if (newValue) {
                                                setFieldValue('capital_company_id', newValue.id)
                                                setFieldValue('capital_campaign_name', newValue.label)
                                                setIdCompanyCurrent(newValue.id)
                                            } else {
                                                setFieldValue('capital_company_id', '')
                                                setFieldValue('capital_campaign_name', '')
                                                setIdCompanyCurrent(0)
                                            }
                                        }}
                                    />
                                    <Typography style={{marginTop: '5px'}} variant="caption" display="block"
                                                gutterBottom>
                                        {
                                            companyCurrent ?
                                                `S??? ti???n vay c??n l???i ${currencyFormatter(companyCurrent.remain_capital)} VN??` : ''
                                        }
                                    </Typography>
                                    {/*<FormControl fullWidth>*/}
                                    {/*    <Select*/}
                                    {/*        size={'small'}*/}
                                    {/*        id='capital_company_id'*/}
                                    {/*        name='capital_company_id'*/}
                                    {/*        value={values.capital_company_id}*/}
                                    {/*        onChange={handleChange}*/}
                                    {/*        error={touched.capital_company_id && Boolean(errors.capital_company_id)}*/}
                                    {/*        helperText={touched.capital_company_id && errors.capital_company_id}*/}
                                    {/*        // size='small'*/}
                                    {/*    >*/}
                                    {/*        {listCompany.map((e) => (*/}
                                    {/*            <MenuItem value={e.id}>{e.company_name}</MenuItem>))}*/}

                                    {/*    </Select>*/}
                                    {/*    <FormHelperText*/}
                                    {/*        className={'error-message'}>{errors.capital_company_id}</FormHelperText>*/}
                                    {/*</FormControl>*/}
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>?????i t?????ng cung c???p v???n<span
                                        className={'error-message'}>*</span>
                                    </div>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={listCompanySupplier}
                                        value={{
                                            id: values.supplier_id,
                                            label: values.supplier_name
                                        }
                                        }
                                        // defaultValue={[{
                                        //     id: info.id: info.capital_company.id,,
                                        //     label: info.capital_company.company_name
                                        // }]}
                                        // sx={{ width: 300 }}
                                        // onChange={}
                                        renderInput={(params) => < TextField  {...params} id='capital_company_id'
                                                                              name='capital_company_id'
                                                                              placeholder="?????i t?????ng cung c???p v???n"
                                                                              error={touched.supplier_id && Boolean(errors.supplier_id)}
                                                                              helperText={touched.supplier_id && errors.supplier_id}/>}
                                        size={"small"}
                                        onChange={(event, newValue) => {
                                            // setCompanySearch(newValue)
                                            console.log("new_value", newValue)
                                            if (newValue) {
                                                setFieldValue('supplier_id', newValue.id)
                                                setFieldValue('supplier_name', newValue.label)

                                            } else {
                                                setFieldValue('supplier_id', '')
                                                setFieldValue('supplier_name', '')
                                            }
                                        }}
                                    />
                                    {/*<FormControl fullWidth>*/}
                                    {/*    <Select*/}
                                    {/*        size={'small'}*/}
                                    {/*        id='supplier_id'*/}
                                    {/*        name='supplier_id'*/}
                                    {/*        value={values.supplier_id}*/}
                                    {/*        onChange={handleChange}*/}
                                    {/*        error={touched.supplier_id && Boolean(errors.supplier_id)}*/}
                                    {/*        helperText={touched.supplier_id && errors.supplier_id}*/}
                                    {/*        // size='small'*/}
                                    {/*    >*/}
                                    {/*        {listCompanySupplier.map((e) => (*/}
                                    {/*            <MenuItem value={e.id}>{e.supplier_name}</MenuItem>))}*/}

                                    {/*    </Select>*/}
                                    {/*    <FormHelperText*/}
                                    {/*        className={'error-message'}>{errors.supplier_id}</FormHelperText>*/}
                                    {/*</FormControl>*/}
                                </Grid>

                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>M???c ????ch vay<span
                                        className={'error-message'}>*</span></div>
                                    <TreeSelect
                                        style={{width: '100%'}}
                                        showSearch
                                        value={campaignSearch}
                                        treeData={listCampaignTree}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        placeholder="M???c ????ch vay"
                                        allowClear
                                        treeDefaultExpandAll
                                        onChange={(values) => {
                                            setCampaignSearch(values)
                                            setFieldValue('capital_campaign_id', values)
                                        }}
                                        filterTreeNode={(search, item) => {
                                            return item.campaign_name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                                        }}
                                        fieldNames={{label: 'campaign_name', value: 'id', children: 'child_campaigns'}}
                                    >
                                    </TreeSelect>
                                    <FormHelperText style={{marginLeft: '15px'}}
                                                    className={'error-message'}>{campaignSearch ? '' : 'Kh??ng ???????c ????? tr???ng'}</FormHelperText>
                                </Grid>

                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>H???ng m???c vay<span
                                        className={'error-message'}>*</span></div>
                                    <TreeSelect
                                        style={{width: '100%'}}
                                        showSearch
                                        value={categorySearch}
                                        treeData={listCategoryTree}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        placeholder="H???ng m???c"
                                        allowClear
                                        treeDefaultExpandAll
                                        onChange={(values) => {
                                            setCategorySearch(values)
                                            setFieldValue('capital_category_id', values)
                                        }}
                                        filterTreeNode={(search, item) => {
                                            return item.category_name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                                        }}
                                        fieldNames={{label: 'category_name', value: 'id', children: 'child_categories'}}
                                    >
                                    </TreeSelect>
                                    <FormHelperText style={{marginLeft: '15px'}}
                                                    className={'error-message'}>{categorySearch ? '' : 'Kh??ng ???????c ????? tr???ng'}</FormHelperText>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>Tr???ng th??i<span className={'error-message'}>*</span>
                                    </div>
                                    <FormControl fullWidth>
                                        <Select
                                            size={'small'}
                                            labelId="asset_type_label"
                                            id='status'
                                            name='status'
                                            value={values.status}
                                            onChange={handleChange}
                                            error={touched.status && Boolean(errors.status)}
                                            helperText={touched.status && errors.status}
                                            // size='small'
                                        >
                                            <MenuItem value={'UNPAID'}>Ch??a t???t to??n</MenuItem>
                                            <MenuItem value={'PAID'}>???? t???t to??n</MenuItem>
                                            <MenuItem value={'A_PART_PRINCIPAL_OFF'}>Off 1 ph???n g???c</MenuItem>
                                            <MenuItem value={'PRINCIPAL_OFF_UNPAID_INTEREST'}>???? off g???c, ch??a tr???
                                                l??i</MenuItem>

                                        </Select>
                                        <FormHelperText
                                            className={'error-message'}>{errors.status}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    {/*<TextField*/}
                                    {/*    id='founding_date'*/}
                                    {/*    name='founding_date'*/}
                                    {/*    className={'formik-input'}*/}
                                    {/*    label="Ng??y th??nh l???p*"*/}
                                    {/*    placeholder={'Ng??y th??nh l???p*'}*/}
                                    {/*    // variant="standard"*/}
                                    {/*    value={values.founding_date}*/}
                                    {/*    onChange={handleChange}*/}
                                    {/*    error={touched.founding_date && Boolean(errors.founding_date)}*/}
                                    {/*    helperText={touched.founding_date && errors.founding_date}*/}

                                    {/*/>*/}
                                    <div className={'label-input'}>Ng??y vay(DD-MM-YYYY)<span
                                        className={'error-message'}>*</span>
                                    </div>
                                    <LocalizationProvider style={{width: '100%'}} dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            style={{width: '100% !important'}}
                                            inputFormat="DD-MM-YYYY"
                                            value={values.lending_start_date}
                                            // onChange={(values) => {
                                            //     console.log(values)
                                            //
                                            // }}

                                            onChange={value => {
                                                props.setFieldValue("lending_start_date", value);
                                                setLendingStartDate(value);
                                            }}
                                            error={touched.lending_start_date && Boolean(errors.lending_start_date)}
                                            helperText={touched.lending_start_date && errors.lending_start_date}
                                            renderInput={(params) => <TextField size={"small"} fullWidth {...params} />}
                                        />
                                    </LocalizationProvider>

                                </Grid>
                                <Grid className={`${isUpdate ? '' : 'hidden'}`} item xs={6} md={6}>
                                    {/*<TextField*/}
                                    {/*    id='founding_date'*/}
                                    {/*    name='founding_date'*/}
                                    {/*    className={'formik-input'}*/}
                                    {/*    label="Ng??y th??nh l???p*"*/}
                                    {/*    placeholder={'Ng??y th??nh l???p*'}*/}
                                    {/*    // variant="standard"*/}
                                    {/*    value={values.founding_date}*/}
                                    {/*    onChange={handleChange}*/}
                                    {/*    error={touched.founding_date && Boolean(errors.founding_date)}*/}
                                    {/*    helperText={touched.founding_date && errors.founding_date}*/}

                                    {/*/>*/}
                                    <div className={'label-input'}>Ng??y ??p d???ng g???c/l??i m???i(DD-MM-YYYY)</div>
                                    <LocalizationProvider style={{width: '100%'}} dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            style={{width: '100% !important'}}
                                            inputFormat="DD-MM-YYYY"
                                            value={values.changing_date}
                                            // onChange={(values) => {
                                            //     console.log(values)
                                            //
                                            // }}

                                            onChange={value => props.setFieldValue("changing_date", value)}
                                            renderInput={(params) => <TextField size={"small"} fullWidth {...params} />}
                                        />
                                    </LocalizationProvider>

                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>S??? ti???n vay (VN??)<span
                                        className={'error-message'}>*</span></div>
                                    <NumericFormat
                                        size={'small'}
                                        id='lending_amount'
                                        customInput={TextField}
                                        name='lending_amount'
                                        className={'formik-input text-right'}
                                        // variant="standard"
                                        thousandSeparator={"."}
                                        decimalSeparator={","}
                                        value={values.lending_amount}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">VN??</InputAdornment>,
                                        }}
                                        onValueChange={(values) => {
                                            const {formattedValue, value, floatValue} = values;
                                            // do something with floatValue
                                            console.log(floatValue)

                                            const re = /^[0-9\b]+$/;
                                            if (re.test(floatValue) || floatValue === undefined) {
                                                setFieldValue('lending_amount', floatValue)
                                                setCurrentAmount(floatValue)
                                                setLendingAmount(floatValue)
                                            }
                                            // setFieldValue('max_capital_value', formattedValue)

                                        }}
                                        error={touched.lending_amount && Boolean(errors.lending_amount)}
                                        helperText={touched.lending_amount && errors.lending_amount}
                                        // helperText={VNnum2words(values.initial_value)==='kh??ng'?'':`${VNnum2words(values.initial_value)} ?????ng`}
                                    />
                                    {/*<div>{</div>*/}
                                    <Typography className={'uppercase'} variant="caption" display="block"
                                                gutterBottom>
                                        {values.lending_amount ? `*B???ng ch???: ${capitalizeFirstLetter(VNnum2words(values.lending_amount))} ?????ng` : ''}
                                    </Typography>

                                </Grid>
                                {/*<Grid item xs={6} md={6}>*/}
                                {/*    <div className={'label-input'}>Ng?????i qu???n l??<span*/}
                                {/*        className={'error-message'}>*</span></div>*/}
                                {/*    <TextField*/}
                                {/*        size={'small'}*/}
                                {/*        id='owner_full_name'*/}
                                {/*        name='owner_full_name'*/}
                                {/*        className={'formik-input'}*/}
                                {/*        // variant="standard"*/}
                                {/*        value={values.owner_full_name}*/}
                                {/*        onChange={handleChange}*/}
                                {/*        error={touched.owner_full_name && Boolean(errors.owner_full_name)}*/}
                                {/*        helperText={touched.owner_full_name && errors.owner_full_name}*/}

                                {/*    />*/}
                                {/*</Grid>*/}
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>Ng?????i qu???n l?? <span
                                        className={'error-message'}>*</span></div>
                                    <Autocomplete
                                        value={{
                                            id: values.owner_full_name,
                                            label: values.owner_full_name + ''
                                        }
                                        }
                                        size={"small"}
                                        disablePortal
                                        id="combo-box-demo"
                                        options={listUser}
                                        renderInput={(params) =>
                                            <TextField
                                                size={"small"}
                                                {...params}
                                                error={touched.owner_full_name && Boolean(errors.owner_full_name)}
                                                helperText={touched.owner_full_name && errors.owner_full_name}
                                            />
                                        }

                                        onChange={(event, newValue) => {
                                            console.log("new-value", newValue)
                                            if (newValue) {
                                                setFieldValue('owner_full_name', newValue.label)
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>Ng?????i ph?? duy???t <span
                                        className={'error-message'}>*</span></div>
                                    <Autocomplete
                                        value={{
                                            id: values.approve_name,
                                            label: values.approve_name + ''
                                        }
                                        }
                                        size={"small"}
                                        disablePortal
                                        id="combo-box-demo"
                                        options={listUser}
                                        renderInput={(params) =>
                                            <TextField
                                                size={"small"}
                                                {...params}
                                                error={touched.approve_name && Boolean(errors.approve_name)}
                                                helperText={touched.approve_name && errors.approve_name}
                                            />
                                        }

                                        onChange={(event, newValue) => {
                                            console.log("new-value", newValue)
                                            if (newValue) {
                                                setFieldValue('approve_name', newValue.label)
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>Th???i gian vay (Th??ng)<span
                                        className={'error-message'}>*</span></div>
                                    {/*<NumericFormat*/}
                                    {/*    size={'small'}*/}
                                    {/*    id='lending_in_month'*/}
                                    {/*    customInput={TextField}*/}
                                    {/*    name='lending_in_month'*/}
                                    {/*    className={'formik-input'}*/}
                                    {/*    // variant="standard"*/}
                                    {/*    value={values.lending_in_month}*/}

                                    {/*    onValueChange={(values) => {*/}
                                    {/*        const {formattedValue, value, floatValue} = values;*/}
                                    {/*        // do something with floatValue*/}
                                    {/*        console.log(floatValue)*/}

                                    {/*        const re = /^[0-9\b]+$/;*/}
                                    {/*        if (re.test(floatValue) || floatValue === undefined) {*/}
                                    {/*            setFieldValue('lending_in_month', floatValue)*/}
                                    {/*        }*/}
                                    {/*        // setFieldValue('max_capital_value', formattedValue)*/}

                                    {/*    }}*/}
                                    {/*    error={touched.lending_in_month && Boolean(errors.lending_in_month)}*/}
                                    {/*    helperText={touched.lending_in_month && errors.lending_in_month}*/}
                                    {/*    // helperText={VNnum2words(values.initial_value)==='kh??ng'?'':`${VNnum2words(values.initial_value)} ?????ng`}*/}
                                    {/*/>*/}
                                    <Autocomplete
                                        value={isUpdate ? {
                                            id: values.lending_in_month,
                                            label: values.lending_in_month + ''
                                        } : listOptionMonth[0]}
                                        id="free-solo-demo"
                                        size={"small"}
                                        freeSolo
                                        inputValue={values.lending_in_month}
                                        options={listOptionMonth}
                                        onInputChange={(event, value) => {
                                            const re = /^[0-9\b]+$/;
                                            if (re.test(value) || value === '') {
                                                setFieldValue('lending_in_month', value)
                                                setLendingInMonth(value)
                                            }
                                        }
                                        }

                                        renderInput={(params) =>
                                            <TextField
                                                size={"small"}
                                                {...params}
                                                error={touched.lending_in_month && Boolean(errors.lending_in_month)}
                                                helperText={touched.lending_in_month && errors.lending_in_month}
                                                //     helperText={touched.lending_in_month && errors.lending_in_month}
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>S??? k??? tr??? g???c<span
                                        className={'error-message'}>*</span></div>
                                    <NumericFormat
                                        size={'small'}
                                        id='principal_period'
                                        customInput={TextField}
                                        name='principal_period'
                                        className={'formik-input'}
                                        // variant="standard"
                                        value={values.principal_period}

                                        onValueChange={(values) => {
                                            const {formattedValue, value, floatValue} = values;
                                            // do something with floatValue
                                            console.log(floatValue)

                                            const re = /^[0-9\b]+$/;
                                            if (re.test(floatValue) || floatValue === undefined) {
                                                setFieldValue('principal_period', floatValue)
                                                setPrincipalPeriod(floatValue)
                                            }
                                            // setFieldValue('max_capital_value', formattedValue)

                                        }}
                                        error={touched.principal_period && Boolean(errors.principal_period)}
                                        helperText={touched.principal_period && errors.principal_period}
                                        // helperText={VNnum2words(values.initial_value)==='kh??ng'?'':`${VNnum2words(values.initial_value)} ?????ng`}
                                    />
                                    {/*<div>{</div>*/}
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>S??? k??? tr??? l??i<span
                                        className={'error-message'}>*</span></div>
                                    <NumericFormat
                                        size={'small'}
                                        id='interest_period'
                                        customInput={TextField}
                                        name='interest_period'
                                        className={'formik-input'}
                                        // variant="standard"
                                        value={values.interest_period}

                                        onValueChange={(values) => {
                                            const {formattedValue, value, floatValue} = values;
                                            // do something with floatValue
                                            console.log(floatValue)

                                            const re = /^[0-9\b]+$/;
                                            if (re.test(floatValue) || floatValue === undefined) {
                                                setFieldValue('interest_period', floatValue)
                                                setInterestPeriod(floatValue)
                                            }
                                            // setFieldValue('max_capital_value', formattedValue)

                                        }}
                                        error={touched.interest_period && Boolean(errors.interest_period)}
                                        helperText={touched.interest_period && errors.interest_period}
                                        // helperText={VNnum2words(values.initial_value)==='kh??ng'?'':`${VNnum2words(values.initial_value)} ?????ng`}
                                    />
                                    {/*<div>{</div>*/}
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>L??i su???t h???p ?????ng vay (%/n??m)<span
                                        className={'error-message'}>*</span></div>
                                    <NumericFormat
                                        disabled={values.interest_rate_type === 'Bi??n ?????'}
                                        id='interest_rate'
                                        customInput={TextField}
                                        name='interest_rate'
                                        size={'small'}
                                        className={'formik-input'}
                                        // variant="standard"
                                        value={values.interest_rate}
                                        InputProps={{

                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                        onValueChange={(values) => {
                                            const {formattedValue, value, floatValue} = values;
                                            // do something with floatValue

                                            setFieldValue('interest_rate', floatValue)
                                            // setFieldValue('max_capital_value', formattedValue)
                                            // alert(floatValue)

                                        }}
                                        error={touched.interest_rate && Boolean(errors.interest_rate)}
                                        helperText={touched.interest_rate && errors.interest_rate}
                                        // helperText={VNnum2words(values.initial_value)==='kh??ng'?'':`${VNnum2words(values.initial_value)} ?????ng`}
                                    />
                                    {/*<div>{</div>*/}
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>Th???i gian ??n h???n g???c (Th??ng)<span
                                        className={'error-message'}>*</span></div>
                                    <Autocomplete
                                        value={isUpdate ? {
                                            id: values.grace_principal_in_month,
                                            label: values.grace_principal_in_month + ''
                                        } : listOptionMonth[0]}

                                        id="free-solo-demo"
                                        size={"small"}
                                        freeSolo
                                        inputValue={values.grace_principal_in_month}
                                        options={listOptionMonth}
                                        onInputChange={(event, value) => {
                                            // console.log("value",value)}
                                            // do something with floatValue

                                            const re = /^[0-9\b]+$/;
                                            if (re.test(value) || value === '') {
                                                setFieldValue('grace_principal_in_month', value)
                                                setGracePrincipalInMonth(value)
                                            }
                                            // setFieldValue('lending_in_month', value)
                                        }
                                        }

                                        renderInput={(params) =>
                                            <TextField
                                                size={"small"}
                                                {...params}
                                                error={touched.grace_principal_in_month && Boolean(errors.grace_principal_in_month)}
                                                helperText={touched.grace_principal_in_month && errors.grace_principal_in_month}
                                                //     helperText={touched.lending_in_month && errors.lending_in_month}
                                            />
                                        }
                                    />

                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>Th???i gian ??n h???n l??i (Th??ng)<span
                                        className={'error-message'}>*</span></div>
                                    <Autocomplete
                                        value={isUpdate ? {
                                            id: values.grace_interest_in_month,
                                            label: values.grace_interest_in_month + ''
                                        } : listOptionMonth[0]}

                                        id="free-solo-demo"
                                        size={"small"}
                                        freeSolo
                                        inputValue={values.grace_interest_in_month}
                                        options={listOptionMonth}
                                        onInputChange={(event, value) => {
                                            // console.log("value",value)}
                                            // do something with floatValue

                                            const re = /^[0-9\b]+$/;
                                            if (re.test(value) || value === '') {
                                                setFieldValue('grace_interest_in_month', value)
                                                setGraceInterestInMonth(value)
                                            }
                                            // setFieldValue('lending_in_month', value)
                                        }
                                        }

                                        renderInput={(params) =>
                                            <TextField
                                                size={"small"}
                                                {...params}
                                                error={touched.grace_interest_in_month && Boolean(errors.grace_interest_in_month)}
                                                helperText={touched.grace_interest_in_month && errors.grace_interest_in_month}
                                                //     helperText={touched.lending_in_month && errors.lending_in_month}
                                            />
                                        }
                                    />


                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>Lo???i l??i su???t<span
                                        className={'error-message'}>*</span></div>
                                    <FormControl fullWidth>
                                        <Select
                                            size={'small'}
                                            labelId="asset_type_label"
                                            id='interest_rate_type'
                                            name='interest_rate_type'
                                            value={values.interest_rate_type}
                                            onChange={handleChange}
                                            error={touched.interest_rate_type && Boolean(errors.interest_rate_type)}
                                            helperText={touched.interest_rate_type && errors.interest_rate_type}
                                            // size='small'
                                        >
                                            <MenuItem value={'C??? ?????nh'}>C??? ?????nh</MenuItem>
                                            <MenuItem value={'Bi??n ?????'}>Bi??n ?????</MenuItem>
                                        </Select>
                                        <FormHelperText
                                            className={'error-message'}>{errors.interest_rate_type}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'}>Tr??? l??i ??n h???n k??? ?????u</div>
                                    <Checkbox
                                        checked={isGrace}
                                        onChange={handleChangeIsGrace}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    ></Checkbox>


                                </Grid>

                                <Grid className={`${values.interest_rate_type === 'C??? ?????nh' ? 'hidden' : ''}`} item
                                      xs={6} md={6}>
                                    <div className={'label-input'}>L??i su???t tham chi???u (%/n??m)<span
                                        className={'error-message'}>*</span></div>
                                    <NumericFormat
                                        size={'small'}
                                        id='reference_interest_rate'
                                        customInput={TextField}
                                        name='reference_interest_rate'
                                        className={'formik-input'}
                                        // variant="standard"
                                        value={values.reference_interest_rate}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                        onValueChange={(value) => {
                                            const {floatValue} = value;
                                            // do something with floatValue
                                            console.log(floatValue)

                                            const re = /^[0-9\b]+$/;
                                            // if (re.test(floatValue) || floatValue === undefined) {
                                            //     setFieldValue('reference_interest_rate', floatValue)
                                            //         setFieldValue('interest_rate',(values.interest_rate_rage||0)+(floatValue||0))
                                            // }
                                            setFieldValue('reference_interest_rate', floatValue)
                                            setFieldValue('interest_rate', ((values.interest_rate_rage || 0) + (floatValue || 0)).toFixed(2))
                                            // setFieldValue('max_capital_value', formattedValue)

                                        }}
                                        error={touched.reference_interest_rate && Boolean(errors.reference_interest_rate)}
                                        helperText={touched.reference_interest_rate && errors.reference_interest_rate}
                                        // helperText={VNnum2words(values.initial_value)==='kh??ng'?'':`${VNnum2words(values.initial_value)} ?????ng`}
                                    />
                                    {/*<div>{</div>*/}
                                </Grid>
                                <Grid className={`${values.interest_rate_type === 'C??? ?????nh' ? 'hidden' : ''}`} item
                                      xs={6} md={6}>
                                    <div className={'label-input'}>Bi??n ????? l??i su???t (%)<span
                                        className={'error-message'}>*</span></div>
                                    <NumericFormat
                                        // style={{width: '200px'}}
                                        size={'small'}
                                        id='interest_rate_rage'
                                        customInput={TextField}
                                        name='interest_rate_rage'
                                        className={'formik-input'}
                                        // variant="standard"
                                        value={values.interest_rate_rage}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                        onValueChange={(value) => {
                                            const {floatValue} = value;
                                            // do something with floatValue

                                            const re = /^[0-9\b]+$/;
                                            if (re.test(floatValue) || floatValue === undefined) {

                                            }
                                            setFieldValue('interest_rate_rage', floatValue)
                                            setFieldValue('interest_rate', ((values.reference_interest_rate || 0) + (floatValue || 0)).toFixed(2))
                                            // setFieldValue('max_capital_value', formattedValue)

                                        }}
                                        error={touched.interest_rate_rage && Boolean(errors.interest_rate_rage)}
                                        helperText={touched.interest_rate_rage && errors.interest_rate_rage}
                                        // helperText={VNnum2words(values.initial_value)==='kh??ng'?'':`${VNnum2words(values.initial_value)} ?????ng`}
                                    />
                                    {/*<div>{</div>*/}
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={'label-input'} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        // justifyContent: 'space-between'
                                    }}>Link t??i li???u<ControlPointIcon
                                        style={{cursor: "pointer", marginLeft: '10px'}}
                                        color="primary"
                                        onClick={addNewLink}
                                    > </ControlPointIcon></div>
                                    <div className={'list-file'}>
                                        {
                                            listLinkServer.map((e, index) => (
                                                <TextFieldLink disable={true} index={index}
                                                               deleteValueLink={deleteValueLinkServer}
                                                               item={e}></TextFieldLink>
                                            ))
                                        }
                                        {
                                            listLink.map((e, index) => (
                                                <TextFieldLink disable={false} changeValue={changeValueLink}
                                                               index={index}
                                                               deleteValueLink={deleteValueLink}
                                                               item={e}></TextFieldLink>
                                            ))
                                        }
                                    </div>

                                </Grid>

                                <Grid item xs={6} md={6}>
                                    <div style={{display: "flex", alignItems: "center"}}>T???p ????nh
                                        k??m <ControlPointIcon style={{cursor: "pointer", marginLeft: '10px'}}
                                                              color="primary"
                                                              onClick={uploadFile}> </ControlPointIcon></div>
                                    <div className={'list-file'}>
                                        {
                                            listFileLocal.map((e) => (
                                                <>
                                                    <div className={'item-file'}>
                                                        <div className={'name-file '}>{e.name}</div>
                                                        <div className={'delete-file'}><DeleteOutlineIcon
                                                            style={{cursor: "pointer"}}
                                                            color={"error"}
                                                            onClick={() => {
                                                                deleteFileLocal(e.name)
                                                            }}></DeleteOutlineIcon></div>
                                                    </div>
                                                    <Divider light/>
                                                </>

                                            ))
                                        }
                                        {
                                            listFileServer.map((e) => (
                                                <>
                                                    <div className={'item-file'}>
                                                        <div className={'name-file '}>{e.file_name}</div>
                                                        <div className={'delete-file'}><DeleteOutlineIcon
                                                            style={{cursor: "pointer"}}
                                                            color={"error"}
                                                            onClick={() => {
                                                                deleteFileServer(e.id, e.file_name)
                                                            }}></DeleteOutlineIcon></div>
                                                    </div>
                                                    <Divider light/>
                                                </>

                                            ))
                                        }
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={12}>
                                    <div className={'main-content-body-tittle'}>
                                        <h4>Chi ti???t c??c k??? tr??? </h4>
                                    </div>
                                    <Divider light/>
                                </Grid>
                                <Grid item xs={6} md={6} style={{height: "400px"}}>
                                    <div className={'label-input'}>Danh s??ch c??c k??? tr??? g???c</div>
                                    <DataGrid
                                        // getRowHeight={() => 'auto'}
                                        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                        labelRowsPerPage={"S??? k???t qu???"}
                                        density="standard"
                                        rows={listPrincipalConfig}
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
                                </Grid>
                                <Grid item xs={6} md={6} style={{height: "400px"}}>
                                    <div className={'label-input'}>Danh s??ch c??c k??? tr??? l??i</div>
                                    <DataGrid
                                        // getRowHeight={() => 'auto'}
                                        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                        labelRowsPerPage={"S??? k???t qu???"}
                                        density="standard"
                                        rows={listInterestConfig}
                                        columns={columnsInterest}
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
                                </Grid>
                                {/*<Grid item xs={6} md={6}>*/}
                                {/*    <input type="file"/>*/}
                                {/*</Grid>*/}
                                <Grid item xs={6} md={12}>
                                    <div className={''} style={{display: "flex", justifyContent: "center"}}>
                                        <Button style={{marginRight: '10px'}} onClick={backList}
                                                variant="outlined">H???y</Button>
                                        <Button variant="contained" type='submit'>L??u</Button>

                                    </div>
                                </Grid>
                            </Grid>
                        </Box>

                    </Form>)
                }}
            </Formik>

        </div>
    </div>)
}

function NumberFormatCustom(props) {
    const {inputRef, onChange, ...other} = props;

    return (<NumericFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
            onChange({
                target: {
                    value: values.value
                }
            });
        }}
        thousandSeparator={","}
        decimalSeparator={"."}
        isNumericString
        prefix={props.prefix} //"$"
    />);
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired, onChange: PropTypes.func.isRequired
};