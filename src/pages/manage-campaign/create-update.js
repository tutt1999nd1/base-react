import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Divider,
    FormControl, FormHelperText,
    Grid,
    InputAdornment, InputLabel, MenuItem,
    Paper, Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
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
    GridToolbarDensitySelector, GridToolbarExport,
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
import {capitalizeFirstLetter, currencyFormatter,VNnum2words} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment/moment";
import dateFormat from "dateformat";
import dayjs from "dayjs";
import apiManagerCategory from "../../api/manage-category";
import apiManagerCampaign from "../../api/manage-campaign";
import {TreeSelect} from "antd";

export default function EditCampaign(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [typeDefault, setTypeDefault] = useState(0)
    const [groupDefault, setGroupDefault] = useState(0)
    const [value, setValue] = useState()
    const [listAllResult, setListAllResult] = useState([])
    const [listCampaignTree, setListCampaignTree] = useState([]);
    const [campaignSearch, setCampaignSearch] = useState()

    const handleChangeDate = (newValue) => {
        setValue(newValue);
    };
    const [info, setInfo] = useState({
        campaign_name: '',
        amount: '',
        description: '',
        status: 'Trạng thái 1',
        parent_id: null,
        parent_campaign:{}

    })
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        campaign_name: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(255, 'Tối đa 255 ký tự'),
        amount: yup
            .string()
            .trim()
            .required('Không được để trống')
        .max(15, 'Tối đa 15 chữ số'),
        description: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(255, 'Tối đa 4000 ký tự'),


    });
    const backList = () => {
        navigate('/campaign')
    }
    useEffect(() => {
        if (isUpdate) {
            if (location.get('id')) {
                setIdUpdate(location.get('id'));
            } else navigate('/campaign')
        }

    }, [location])
    useEffect(() => {
        if (isUpdate && idUpdate) {
            getListCampaignApi({id: idUpdate, page_size: 1}).then(r => {
                setInfo(r.data.campaigns[0])
                console.log(r.data.campaigns[0])
            }).catch(e => {

            })
        }
    }, [idUpdate])
    const createCampaignApi = (data) => {
        return apiManagerCampaign.createCampaign(data);
    }
    const updateCampaignApi = (data) => {
        return apiManagerCampaign.updateCampaign(idUpdate, data);
    }
    const getListCampaignApi = (data) => {
        return apiManagerCampaign.getListCampaign(data);
    }

    const getListCampaignTreeApi = (data) => {
        return apiManagerCampaign.getListCampaignTree(data);
    }
    const back = () => {
        navigate('/campaign')
    }
    useEffect(() => {
        console.log("info", info)
        setCampaignSearch(info.parent_campaign.id)
    }, [info])
    useEffect(() => {
        getListCampaignTreeApi({paging: false}).then(r => {
            console.log("setListCategoryTree", r.data)
            setListCampaignTree(r.data)
        }).catch(e => {
            console.log(e)
        })
    }, [])
    return (
        <div className={'main-content'}>
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
            <Button onClick={back} style={{marginBottom: '10px'}} variant="text" startIcon={<KeyboardBackspaceIcon/>}>Mục
                đích vay</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý mục đích vay
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
                        campaign_name: info.campaign_name,
                        amount: info.amount,
                        description: info.description,
                        status: info.status,
                        parent_id: info.parent_id == null ? 0 : info.parent_id,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            let valueConvert = {...values};
                            if (values.parent_id == 0) valueConvert.parent_id = null;
                            if (isUpdate) {
                                updateCampaignApi(valueConvert).then(r => {
                                    toast.success('Cập nhật thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate(`/campaign/detail?id=${idUpdate}`)
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
                                createCampaignApi(valueConvert).then(r => {
                                    toast.success('Thêm mới thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate('/campaign')
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
                        }
                    }
                >
                    {props => {
                        const {
                            values,
                            touched,
                            errors,
                            handleChange,
                            setFieldValue,
                            handleSubmit
                        } = props;
                        return (
                            <Form onSubmit={handleSubmit}>
                                <Box sx={{flexGrow: 1}} className={'form-content'}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Tên mục đích vay<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='campaign_name'
                                                name='campaign_name'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.campaign_name}
                                                onChange={handleChange}
                                                error={touched.campaign_name && Boolean(errors.campaign_name)}
                                                helperText={touched.campaign_name && errors.campaign_name}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Hạng mục cha<span
                                                className={'error-message'}>*</span></div>
                                            <TreeSelect
                                                style={{ width: '100%' }}
                                                showSearch
                                                value={campaignSearch}
                                                treeData={listCampaignTree}
                                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                                placeholder="Mục đích vay"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(values)=>{
                                                    setCampaignSearch(values)
                                                    setFieldValue('parent_id', values)
                                                }}
                                                filterTreeNode={(search, item) => {
                                                    return item.campaign_name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                                                }}
                                                fieldNames={{label: 'campaign_name', value: 'id', children: 'child_campaigns'}}
                                            >
                                            </TreeSelect>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Số tiền vay (VNĐ)<span
                                                className={'error-message'}>*</span></div>
                                            <NumericFormat
                                                size={"small"}
                                                id='amount'
                                                name='amount'
                                                className={'formik-input text-right'}
                                                // type={"number"}
                                                // variant="standard"
                                                value={values.amount}
                                                // onChange={handleChange}
                                                customInput={TextField}
                                                error={touched.amount && Boolean(errors.amount)}
                                                helperText={touched.amount && errors.amount}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                }}
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue)) {
                                                        console.log(floatValue)
                                                        setFieldValue('amount', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                            />
                                            <Typography className={'uppercase'} variant="caption" display="block"
                                                        gutterBottom>
                                                {values.amount ? `*Bằng chữ: ${capitalizeFirstLetter(VNnum2words(values.amount))} đồng` : ''}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Thông tin<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                className={'formik-input'}
                                                // variant="standard"
                                                id='description'
                                                name='description'
                                                multiline
                                                size={"small"}
                                                rows={5}
                                                value={values.description}
                                                onChange={handleChange}
                                                error={touched.description && Boolean(errors.description)}
                                                helperText={touched.description && errors.description}

                                            />
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

                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}

function NumberFormatCustom(props) {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumericFormat
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
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};