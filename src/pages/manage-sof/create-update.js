import React, {useEffect, useState} from "react";
import {default as VNnum2words} from 'vn-num2words';
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {NumericFormat} from 'react-number-format';
import AddIcon from '@mui/icons-material/Add';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import SearchIcon from '@mui/icons-material/Search';
import {toast, ToastContainer} from "react-toastify";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {
    DataGrid,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton
} from "@mui/x-data-grid";
import {GridRowsProp} from "@mui/x-data-grid";
import {GridColDef} from "@mui/x-data-grid";
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import {useNavigate, useSearchParams} from "react-router-dom";
import apiManagerAssets from "../../api/manage-assets";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PropTypes from "prop-types";
import {capitalizeFirstLetter, currencyFormatter} from "../../constants/utils";
import apiManagerSOF from "../../api/manage-sof";
import apiManagerCompany from "../../api/manage-company";
import apiManagerCategory from "../../api/manage-category";
import apiManagerCampaign from "../../api/manage-campaign";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function EditSOF(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [listCompany, setListCompany] = useState([]);
    const [listCampaign, setListCampaign] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [typeDefault, setTypeDefault] = useState(0)
    const [groupDefault, setGroupDefault] = useState(0)
    const [listFileLocal, setListFileLocal] = useState([])
    const [listFileServer, setListFileServer] = useState([])
    const [currentAmount, setCurrentAmount] = useState(0)
    const [listDeletedAttachment, setListDeletedAttachment] = useState([])
    const [info, setInfo] = useState({
        id: '',
        capital_company: {id:0},
        capital_category: {id:0},
        capital_campaign: {id:0},

        capital_company_id: '',
        capital_category_id: '',
        capital_campaign_id: '',
        lending_amount: '',
        owner_full_name: '',
        lending_start_date:new dayjs,
        status: '',
        lending_in_month: '',
        interest_period: '',
        principal_period: '',
        interest_rate: '',
        grace_principal_in_month: '',
        grace_interest_in_month: '',
        interest_rate_type: '',
        reference_interest_rate:'',
        interest_rate_rage: '',
        list_attachments: []
    })
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        capital_company_id: yup
            .string()
            .trim()
            .required('Không được để trống'),
        capital_campaign_id: yup
            .string()
            .trim()
            .required('Không được để trống'),
        capital_category_id: yup
            .string()
            .trim()
            .required('Không được để trống'),
        principal_period: yup
            .string()
            .trim()
            .required('Không được để trống'), // .matches( /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,"Nhập đúng định dạng số điện thoại"),
        lending_amount: yup
            .string()
            .trim()
            .required('Không được để trống'),
        owner_full_name: yup
            .string()
            .trim()
            .required('Không được để trống'),
        lending_start_date: yup.string()
            .trim()
            .required('Không được để trống'),
        status: yup.string()
            .trim()
            .required('Không được để trống'),
        lending_in_month: yup.string()
            .trim()
            .required('Không được để trống'),
        interest_period: yup.string()
            .trim()
            .required('Không được để trống'),
        interest_rate: yup.string()
            .trim()
            .required('Không được để trống'),
        grace_principal_in_month: yup.string()
            .trim()
            .required('Không được để trống'),
        grace_interest_in_month: yup.string()
            .trim()
            .required('Không được để trống'),
        interest_rate_type: yup.string()
            .trim()
            .required('Không được để trống'),
        reference_interest_rate: yup.string()
            .trim()
            .required('Không được để trống'),
        interest_rate_rage: yup.string()
            .trim()
            .required('Không được để trống'),
    });
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
        getListCategoryApi({paging:false}).then(r => {
            if (r.data.categories) {
                setListCategory(r.data.categories)
            } else setListCategory([])

        }).catch(e => {

        })
        getListCampaignApi({paging:false}).then(r => {
            if (r.data.campaigns)
                setListCampaign(r.data.campaigns)
            else setListCampaign([])

        }).catch(e => {

        })


    }, [])
    useEffect(() => {

        getListCompanyApi({lending_amount:currentAmount||0}).then(r => {
            if (r.data)
                setListCompany(r.data)
            else setListCompany([])

        }).catch(e => {

        })

    }, [currentAmount])
    useEffect(() => {
        if (isUpdate && idUpdate) {
            getListSOFApi({id: idUpdate, page_size: 1}).then(r => {
                setInfo(r.data.source_of_funds[0])
                console.log(r.data.source_of_funds[0])
            }).catch(e => {

            })
        }
    }, [idUpdate])
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
        return apiManagerCompany.getListCompanyAvai(data);
    }
    const getListCategoryApi = (data) => {
        return apiManagerCategory.getListCategory(data);
    }
    const getListCampaignApi = (data) => {
        return apiManagerCampaign.getListCampaign(data);
    }



    const back = () => {
        navigate('/sof')
    }
    useEffect(() => {
        console.log(info)
        setListFileServer(info.list_attachments)
    }, [info])

    useEffect(() => {
        console.log(VNnum2words(10000));
    }, [listFileServer])

    const deleteFileLocal = (name) => {
        let arr = [...listFileLocal]
        let indexRemove = listFileLocal.findIndex(e => e.name === name)
        if (indexRemove !== -1) {
            arr.splice(indexRemove, 1);
            setListFileLocal(arr)
        }

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
            <Button onClick={back} style={{marginBottom: '10px'}} variant="text" startIcon={<KeyboardBackspaceIcon/>}>Khoản vay
                </Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý khoản vay
                    </Typography>
                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>{isUpdate ? 'Cập nhật' : 'Thêm mới'} </h4>
                </div>
                <Divider light/>
                <Formik
                    enableReinitialize
                    initialValues={{
                        capital_company_id: idUpdate?info.capital_company.id:info.capital_company_id,
                        capital_category_id: idUpdate?info.capital_category.id:info.capital_category_id ,
                        capital_campaign_id:idUpdate?info.capital_campaign.id:info.capital_campaign_id ,
                        // asset_group:info.asset_group.id,
                        lending_amount: info.lending_amount,
                        owner_full_name: info.owner_full_name,
                        principal_period:info.principal_period,
                        // lending_start_date: idUpdate?dayjs(info.lending_start_date).format('DD-MM-YYYY'):info.lending_start_date,
                        lending_start_date: idUpdate?dayjs(info.lending_start_date,'DD-MM-YYYY'):info.lending_start_date,
                        status: info.status,
                        lending_in_month: info.lending_in_month,
                        interest_period: info.interest_period,
                        interest_rate: info.interest_rate,
                        grace_principal_in_month: info.grace_principal_in_month,
                        grace_interest_in_month: info.grace_interest_in_month,
                        interest_rate_type: info.interest_rate_type,
                        reference_interest_rate: info.reference_interest_rate,
                        interest_rate_rage: info.interest_rate_rage,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        // setInfoAccount();
                        // submitAccount();
                        console.log('values', values)
                        let valueConvert = values;
                        let formData = new FormData();

                        for (let i = 0; i < listFileLocal.length; i++) {
                            formData.append('newAttachment', listFileLocal[i])
                        }
                        dayjs(values.founding_date).format('DD-MM-YYYY')
                        formData.append('capitalCampaignId', values.capital_campaign_id)
                        formData.append('capitalCategoryId', values.capital_category_id)
                        formData.append('capitalCompanyId', values.capital_company_id)
                        formData.append('status', values.status)
                        formData.append('ownerFullName', values.owner_full_name)
                        formData.append('lendingStartDate',  dayjs(values.lending_start_date).format('DD-MM-YYYY'))
                        formData.append('lendingInMonth', values.lending_in_month)
                        formData.append('principalPeriod', values.principal_period)
                        formData.append('interestPeriod', values.interest_period)
                        formData.append('interestRate', values.interest_rate)
                        formData.append('lendingAmount', values.lending_amount)
                        formData.append('gracePrincipalInMonth', values.grace_principal_in_month)
                        formData.append('graceInterestInMonth', values.grace_interest_in_month)
                        formData.append('interestRateType', values.interest_rate_type)
                        formData.append('referenceInterestRate', values.reference_interest_rate)
                        formData.append('interestRateRage', values.interest_rate_rage)

                        // formData.append('currentCreditValue',values.)
                        if (isUpdate) {
                            formData.append('description', values.description)
                            console.log("listDeletedAttachment", listDeletedAttachment)
                            for (let i = 0; i < listDeletedAttachment.length; i++) {
                                formData.append('listDeletedAttachment', listDeletedAttachment[i])
                            }
                            updateSOFApi(formData).then(r => {
                                toast.success('Cập nhật thành công', {
                                    position: "top-right",
                                    autoClose: 1500,
                                    hideProgressBar: true,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                });
                                setTimeout(() => {
                                    navigate(`/sof/detail?id=${idUpdate}`)
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


                        } else {

                            createSOFApi(formData).then(r => {
                                toast.success('Thêm mới thành công', {
                                    position: "top-right",
                                    autoClose: 1500,
                                    hideProgressBar: true,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                });
                                setTimeout(() => {
                                    navigate('/sof')
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
                                            <FormControl fullWidth>
                                                <InputLabel id="asset_group_label">Công ty vay*</InputLabel>
                                                <Select
                                                    label={"Công ty vay*"}
                                                    id='capital_company_id'
                                                    name='capital_company_id'
                                                    value={values.capital_company_id}
                                                    onChange={handleChange}
                                                    error={touched.capital_company_id && Boolean(errors.capital_company_id)}
                                                    helperText={touched.capital_company_id && errors.capital_company_id}
                                                    // size='small'
                                                >
                                                    {listCompany.map((e) => (
                                                        <MenuItem value={e.id}>{e.company_name}</MenuItem>))}

                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.capital_company_id}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="asset_type_label">Mục đích vay*</InputLabel>
                                                <Select

                                                    labelId="asset_type_label"
                                                    id='capital_campaign_id'
                                                    name='capital_campaign_id'
                                                    label='Mục đích vay*'
                                                    value={values.capital_campaign_id}
                                                    onChange={handleChange}
                                                    error={touched.capital_campaign_id && Boolean(errors.capital_campaign_id)}
                                                    helperText={touched.capital_campaign_id && errors.capital_campaign_id}
                                                    // size='small'
                                                >
                                                    {listCampaign.map((e) => (
                                                        <MenuItem value={e.id}>{e.campaign_name}</MenuItem>))}

                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.capital_campaign_id}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="asset_type_label">Hạng mục vay*</InputLabel>
                                                <Select
                                                    labelId="asset_type_label"
                                                    id='capital_category_id'
                                                    name='capital_category_id'
                                                    label='Hạng mục vay*'
                                                    value={values.capital_category_id}
                                                    onChange={handleChange}
                                                    error={touched.capital_category_id && Boolean(errors.capital_category_id)}
                                                    helperText={touched.capital_category_id && errors.capital_category_id}
                                                    // size='small'
                                                >
                                                    {listCategory.map((e) => (
                                                        <MenuItem value={e.id}>{e.category_name}</MenuItem>))}

                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.capital_category_id}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="asset_type_label">Trạng thái*</InputLabel>
                                                <Select

                                                    labelId="asset_type_label"
                                                    id='status'
                                                    name='status'
                                                    label='Trạng thái*'
                                                    value={values.status}
                                                    onChange={handleChange}
                                                    error={touched.status && Boolean(errors.status)}
                                                    helperText={touched.status && errors.status}
                                                    // size='small'
                                                >
                                                    <MenuItem value={'UNPAID'}>Chưa tất toán</MenuItem>
                                                    <MenuItem value={'PAID'}>Đã tất toán</MenuItem>
                                                    <MenuItem value={'A_PART_PRINCIPAL_OFF'}>Off 1 phần gốc</MenuItem>
                                                    <MenuItem value={'PRINCIPAL_OFF_UNPAID_INTEREST'}>Đã off gốc, chưa trả lãi</MenuItem>

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
                                            {/*    label="Ngày thành lập*"*/}
                                            {/*    placeholder={'Ngày thành lập*'}*/}
                                            {/*    // variant="standard"*/}
                                            {/*    value={values.founding_date}*/}
                                            {/*    onChange={handleChange}*/}
                                            {/*    error={touched.founding_date && Boolean(errors.founding_date)}*/}
                                            {/*    helperText={touched.founding_date && errors.founding_date}*/}

                                            {/*/>*/}
                                            <LocalizationProvider style={{width:'100%'}} dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    style={{width:'100% !important'}}
                                                    label="Ngày vay"
                                                    inputFormat="MM-DD-YYYY"
                                                    value={values.lending_start_date}
                                                    // onChange={(values) => {
                                                    //     console.log(values)
                                                    //
                                                    // }}

                                                    onChange={value => props.setFieldValue("lending_start_date", value)}
                                                    error={touched.lending_start_date && Boolean(errors.lending_start_date)}
                                                    helperText={touched.lending_start_date && errors.lending_start_date}
                                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                                />
                                            </LocalizationProvider>

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='lending_amount'
                                                customInput={TextField}
                                                name='lending_amount'
                                                className={'formik-input text-right'}
                                                label="Số tền vay *"
                                                placeholder={'Số tiền vay *'}
                                                // variant="standard"
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                value={values.lending_amount}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                                                }}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    console.log(floatValue)

                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        setFieldValue('lending_amount', floatValue)
                                                        setCurrentAmount(floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.lending_amount && Boolean(errors.lending_amount)}
                                                helperText={touched.lending_amount && errors.lending_amount}
                                                // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                            />
                                            {/*<div>{</div>*/}
                                            <Typography className={'uppercase'} variant="caption" display="block"
                                                        gutterBottom>
                                                {values.lending_amount ? `*Bằng chữ: ${capitalizeFirstLetter(VNnum2words(values.lending_amount))} đồng` : ''}
                                            </Typography>

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                id='owner_full_name'
                                                name='owner_full_name'
                                                className={'formik-input'}
                                                label="Người quản lý*"
                                                placeholder={'Người quản lý*'}
                                                // variant="standard"
                                                value={values.owner_full_name}
                                                onChange={handleChange}
                                                error={touched.owner_full_name && Boolean(errors.owner_full_name)}
                                                helperText={touched.owner_full_name && errors.owner_full_name}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='lending_in_month'
                                                customInput={TextField}
                                                name='lending_in_month'
                                                className={'formik-input'}
                                                label="Thời gian vay*"
                                                placeholder={'Thời gian vay*'}
                                                // variant="standard"
                                                value={values.lending_in_month}

                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    console.log(floatValue)

                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        setFieldValue('lending_in_month', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.lending_in_month && Boolean(errors.lending_in_month)}
                                                helperText={touched.lending_in_month && errors.lending_in_month}
                                                // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                            />
                                            {/*<div>{</div>*/}

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='principal_period'
                                                customInput={TextField}
                                                name='principal_period'
                                                className={'formik-input'}
                                                label="Số kỳ trả gốc *"
                                                placeholder={'Số kỳ trả gốc *'}
                                                // variant="standard"
                                                value={values.principal_period}

                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    console.log(floatValue)

                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        setFieldValue('principal_period', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.principal_period && Boolean(errors.principal_period)}
                                                helperText={touched.principal_period && errors.principal_period}
                                                // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                            />
                                            {/*<div>{</div>*/}
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='interest_period'
                                                customInput={TextField}
                                                name='interest_period'
                                                className={'formik-input'}
                                                label="Số kỳ trả lãi*"
                                                placeholder={'Số kỳ trả lãi*'}
                                                // variant="standard"
                                                value={values.interest_period}

                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    console.log(floatValue)

                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        setFieldValue('interest_period', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.interest_period && Boolean(errors.interest_period)}
                                                helperText={touched.interest_period && errors.interest_period}
                                                // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                            />
                                            {/*<div>{</div>*/}
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='interest_rate'
                                                customInput={TextField}
                                                name='interest_rate'
                                                className={'formik-input'}
                                                label="Lãi suất hợp đồng vay*"
                                                placeholder={'Lãi suất hợp đồng vay*'}
                                                // variant="standard"
                                                value={values.interest_rate}

                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    console.log(floatValue)

                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        setFieldValue('interest_rate', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.interest_rate && Boolean(errors.interest_rate)}
                                                helperText={touched.interest_rate && errors.interest_rate}
                                                // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                            />
                                            {/*<div>{</div>*/}
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='grace_principal_in_month'
                                                customInput={TextField}
                                                name='grace_principal_in_month'
                                                className={'formik-input'}
                                                label="Thời gian ân hạn gốc*"
                                                placeholder={'Thời gian ân hạn gốc*'}
                                                // variant="standard"
                                                value={values.grace_principal_in_month}

                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    console.log(floatValue)

                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        setFieldValue('grace_principal_in_month', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.grace_principal_in_month && Boolean(errors.grace_principal_in_month)}
                                                helperText={touched.grace_principal_in_month && errors.grace_principal_in_month}
                                                // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                            />
                                            {/*<div>{</div>*/}
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='grace_interest_in_month'
                                                customInput={TextField}
                                                name='grace_interest_in_month'
                                                className={'formik-input'}
                                                label="Thời gian ân hạn lãi*"
                                                placeholder={'Thời gian ân hạn lãi*'}
                                                // variant="standard"
                                                value={values.grace_interest_in_month}

                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    console.log(floatValue)

                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        setFieldValue('grace_interest_in_month', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.grace_interest_in_month && Boolean(errors.grace_interest_in_month)}
                                                helperText={touched.grace_interest_in_month && errors.grace_interest_in_month}
                                                // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                            />
                                            {/*<div>{</div>*/}
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="asset_type_label">Loại lãi suất*</InputLabel>
                                                <Select

                                                    labelId="asset_type_label"
                                                    id='interest_rate_type'
                                                    name='interest_rate_type'
                                                    label='Loại lãi suất*'
                                                    value={values.interest_rate_type}
                                                    onChange={handleChange}
                                                    error={touched.interest_rate_type && Boolean(errors.interest_rate_type)}
                                                    helperText={touched.interest_rate_type && errors.interest_rate_type}
                                                    // size='small'
                                                >
                                                    <MenuItem value={'Cố định'}>Cố định</MenuItem>
                                                    <MenuItem value={'Biên độ'}>Biên độ</MenuItem>


                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.interest_rate_type}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='reference_interest_rate'
                                                customInput={TextField}
                                                name='reference_interest_rate'
                                                className={'formik-input'}
                                                label="Lãi suất tham chiếu*"
                                                placeholder={'Lãi suất tham chiếu*'}
                                                // variant="standard"
                                                value={values.reference_interest_rate}

                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    console.log(floatValue)

                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        setFieldValue('reference_interest_rate', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.reference_interest_rate && Boolean(errors.reference_interest_rate)}
                                                helperText={touched.reference_interest_rate && errors.reference_interest_rate}
                                                // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                            />
                                            {/*<div>{</div>*/}
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='interest_rate_rage'
                                                customInput={TextField}
                                                name='interest_rate_rage'
                                                className={'formik-input'}
                                                label="Biên độ lãi suất*"
                                                placeholder={'Biên độ lãi suất*'}
                                                // variant="standard"
                                                value={values.interest_rate_rage}

                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    console.log(floatValue)

                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        setFieldValue('interest_rate_rage', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.interest_rate_rage && Boolean(errors.interest_rate_rage)}
                                                helperText={touched.interest_rate_rage && errors.interest_rate_rage}
                                                // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                            />
                                            {/*<div>{</div>*/}
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div style={{display: "flex", alignItems: "center"}}>Tập đính
                                                kèm <ControlPointIcon style={{cursor: "pointer", marginLeft: '10px'}}
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
                                        {/*<Grid item xs={6} md={6}>*/}
                                        {/*    <input type="file"/>*/}
                                        {/*</Grid>*/}
                                        <Grid item xs={6} md={12}>
                                            <div className={''} style={{display: "flex", justifyContent: "center"}}>
                                                <Button style={{marginRight: '10px'}} onClick={backList}
                                                        variant="outlined">Hủy</Button>
                                                <Button variant="contained" type='submit'>Lưu</Button>

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