import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {NumericFormat} from 'react-number-format';
import {toast, ToastContainer} from "react-toastify";
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PropTypes from "prop-types";
import {capitalizeFirstLetter, VNnum2words} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import apiManagerSupplier from "../../api/manage-supplier";

export default function EditAssetGroup(props) {
    const navigate = useNavigate();
    const [location,setLocation] = useSearchParams();


    const [info,setInfo] =useState({
        supplier_name:'',
        description:'',
    })
    const {isUpdate} = props
    const [idUpdate,setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        supplier_name: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(255, 'Tối đa 255 ký tự')
        ,


    });
    const backList = () => {
        navigate('/supplier')
    }
    useEffect(()=>{
        if(isUpdate){
            if(location.get('id')){
                setIdUpdate(location.get('id'));
            }
            else navigate('/supplier')
        }

    },[location])
    useEffect(()=>{
        if(isUpdate&&idUpdate){
            getListSupplierApi({id:idUpdate,page_size:1}).then(r=>{
                setInfo( r.data.suppliers[0])
                console.log(r.data.suppliers[0])
            }).catch(e=>{

            })
        }
    },[idUpdate])
    const createSupplierApi = (data) => {
        return apiManagerSupplier.createSupplier(data);
    }
    const updateSupplierApi = (data) => {
        return apiManagerSupplier.updateSupplier(idUpdate,data);
    }
    const getListSupplierApi = (data) => {
        return apiManagerSupplier.getListSupplier(data);
    }


    const back = () => {
        navigate('/supplier')
    }

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
            <Button onClick={back} style={{marginBottom:'10px'}} variant="text" startIcon={<KeyboardBackspaceIcon />}>Đối tượng cung cấp vốn</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent:'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý đối tượng cung cấp vốn
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
                        supplier_name:info.supplier_name,
                        description:info.description,

                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            let valueConvert = {...values};
                            if(isUpdate){
                                updateSupplierApi(valueConvert).then(r=>{
                                    toast.success('Cập nhật thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate(`/supplier/detail?id=${idUpdate}`)
                                    }, 1050);

                                }).catch(e=>{
                                    console.log(e)
                                })


                            }
                            else {
                                createSupplierApi(valueConvert).then(r=>{
                                    toast.success('Thêm mới thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate('/supplier/detail?id='+r.data.id)
                                    }, 1050);

                                }).catch(e=>{
                                    console.log(e)
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
                                            <div className={'label-input'}>Tên đối tượng cung cấp vốn<span className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='supplier_name'
                                                name='supplier_name'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.supplier_name}
                                                onChange={handleChange}
                                                error={touched.supplier_name && Boolean(errors.supplier_name)}
                                                helperText={touched.supplier_name && errors.supplier_name}

                                            />
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
                                                rows={5}
                                                value={values.description}
                                                onChange={handleChange}
                                                error={touched.description && Boolean(errors.description)}
                                                helperText={touched.description && errors.description}

                                            />
                                        </Grid>
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