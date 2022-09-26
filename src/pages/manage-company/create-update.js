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
import { NumericFormat } from 'react-number-format';
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
import {currencyFormatter} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
export default function EditCompany(props) {
    const navigate = useNavigate();
    const [location,setLocation] = useSearchParams();
    const [listGroup,setListGroup] =useState([]);
    const [listType,setListType] =useState([]);
    const [typeDefault,setTypeDefault] = useState(0)
    const [groupDefault,setGroupDefault] = useState(0)

    const [info,setInfo] =useState({
        company_name:'',
        address:'',
        contact_detail:'',
        tax_number:'',
        charter_capital:'',
        founding_date:'',
        capital_limit:'',
    })
    const {isUpdate} = props
    const [idUpdate,setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        company_name: yup
            .string()
            .trim()
            .required('Không được để trống'),
        contact_detail: yup
            .string()
            .trim()
            .required('Không được để trống'),
        tax_number: yup
            .string()
            .trim()
            .required('Không được để trống'),
        charter_capital: yup
            .string()
            .trim()
            .required('Không được để trống'),
        founding_date: yup
            .string()
            .trim()
            .required('Không được để trống'),
        capital_limit: yup
            .string()
            .trim()
            .required('Không được để trống'),
    });
    const backList = () => {
        navigate('/company')
    }
    useEffect(()=>{
        if(isUpdate){
            if(location.get('id')){
                setIdUpdate(location.get('id'));
            }
            else navigate('/company')
        }

    },[location])
    useEffect(()=>{
        if(isUpdate&&idUpdate){
            getListCompanyApi({id:idUpdate,page_size:1}).then(r=>{
                setInfo( r.data.companies[0])
                console.log(r.data.companies[0])
            }).catch(e=>{

            })
        }
    },[idUpdate])
    const createCompanyApi = (data) => {
        return apiManagerCompany.createCompany(data);
    }
    const updateCompanyApi = (data) => {
        return apiManagerCompany.updateCompany(idUpdate,data);
    }
    const getListCompanyApi = (data) => {
        return apiManagerCompany.getListCompany(data);
    }


    const back = () => {
      navigate('/company')
    }
    useEffect(()=>{
        console.log("info",info)
    },[info])
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
            <Button onClick={back} style={{marginBottom:'10px'}} variant="text" startIcon={<KeyboardBackspaceIcon />}>Công ty</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent:'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý công ty
                    </Typography>
                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>{isUpdate?'Cập nhật':'Thêm mới'} </h4>
                </div>
                <Divider light />
                <Formik
                    enableReinitialize
                    initialValues={{
                        company_name:info.company_name,
                        address:info.address,
                        contact_detail:info.contact_detail,
                        // asset_type:info.asset_type.id,
                        // asset_group:info.asset_group.id,
                        tax_number:info.tax_number,
                        charter_capital:info.charter_capital,
                        founding_date:info.founding_date,
                        max_capital_value:info.max_capital_value,
                        capital_limit:info.capital_limit,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            console.log('values',values)
                            let valueConvert = values;

                            console.log(valueConvert)
                            if(isUpdate){
                                updateCompanyApi(valueConvert).then(r=>{
                                    toast.success('Cập nhật thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate(`/company/detail?id=${idUpdate}`)
                                    }, 1050);

                                }).catch(e=>{
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
                            else {
                                createCompanyApi(valueConvert).then(r=>{
                                    toast.success('Thêm mới thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate('/company')
                                    }, 1050);

                                }).catch(e=>{
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
                                <Box sx={{ flexGrow: 1 }} className={'form-content'}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                id='company_name'
                                                name='company_name'
                                                className={'formik-input'}
                                                label="Tên công ty *"
                                                placeholder={'Tên công ty*'}
                                                // variant="standard"
                                                value={values.company_name}
                                                onChange={handleChange}
                                                error={touched.company_name && Boolean(errors.company_name)}
                                                helperText={touched.company_name && errors.company_name}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                        </Grid>
                                        <Grid item xs={6} md={6}>

                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='initial_value'
                                                customInput={TextField}
                                                name='initial_value'
                                                className={'formik-input'}
                                                label="Giá trị ban đầu *"
                                                placeholder={'Giá trị ban đầu *'}
                                                // variant="standard"
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                value={values.initial_value}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                                                }}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    const re = /^[0-9\b]+$/;
                                                    if(re.test(floatValue)){
                                                        console.log(floatValue)
                                                        setFieldValue('initial_value', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.initial_value && Boolean(errors.initial_value)}
                                                helperText={touched.initial_value && errors.initial_value}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='capital_value'
                                                name='capital_value'
                                                className={'formik-input'}
                                                label="Vốn vay *"
                                                placeholder={'Vốn vay *'}
                                                customInput={TextField}
                                                // variant="standard"
                                                value={values.capital_value}
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    const re = /^[0-9\b]+$/;
                                                    if(re.test(floatValue)){
                                                        console.log(floatValue)
                                                        setFieldValue('capital_value', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.capital_value && Boolean(errors.capital_value)}
                                                helperText={touched.capital_value && errors.capital_value}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                }}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='current_credit_value'
                                                name='current_credit_value'
                                                className={'formik-input'}
                                                label="Gốc vay tín dụng hiện tại *"
                                                placeholder={'Gốc vay tín dụng hiện tại *'}
                                                customInput={TextField}
                                                value={values.current_credit_value}
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    const re = /^[0-9\b]+$/;
                                                    if(re.test(floatValue)){
                                                        console.log(floatValue)
                                                        setFieldValue('current_credit_value', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.current_credit_value  && Boolean(errors.current_credit_value)}
                                                helperText={touched.current_credit_value && errors.current_credit_value}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                                                }}
                                                // variant="standard"
                                            />

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <NumericFormat
                                                id='max_capital_value'
                                                name='max_capital_value'
                                                className={'formik-input'}
                                                label="Số tiền vay tối đa *"
                                                placeholder={'Số tiền vay tối đa *'}
                                                // type={"number"}
                                                // variant="standard"
                                                value={values.max_capital_value}
                                                // onChange={handleChange}
                                                customInput={TextField}
                                                error={touched.max_capital_value  && Boolean(errors.max_capital_value)}
                                                helperText={touched.max_capital_value && errors.max_capital_value}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                }}
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    const re = /^[0-9\b]+$/;
                                                    if(re.test(floatValue)){
                                                        console.log(floatValue)
                                                        setFieldValue('max_capital_value', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                className={'formik-input'}
                                                label="Link tài liệu"
                                                placeholder={'Link tài liệu'}
                                                // variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                className={'formik-input'}
                                                label="Thông tin *"
                                                placeholder={'Thông tin *'}
                                                // variant="standard"
                                                id='description'
                                                name='description'
                                                multiline
                                                rows={5}
                                                value={values.description}
                                                onChange={handleChange}
                                                error={touched.description  && Boolean(errors.description)}
                                                helperText={touched.description && errors.description}

                                            />
                                        </Grid>


                                        {/*<Grid item xs={6} md={6}>*/}
                                        {/*    <input type="file"/>*/}
                                        {/*</Grid>*/}
                                        <Grid item xs={6} md={12}>
                                            <div className={''} style={{display:"flex", justifyContent:"center"}}>
                                                <Button style={{marginRight:'10px'}} onClick={backList} variant="outlined">Hủy</Button>
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
    const { inputRef, onChange, ...other } = props;

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