import React, {useEffect, useState} from "react";
import {
    Autocomplete,
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
import {capitalizeFirstLetter, convertToAutoComplete, VNnum2words} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import apiManagerMember from "../../api/manage-member";

export default function EditCategory(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [listMember, setListMember] = useState([]);

    const [info, setInfo] = useState({
        company_name: '',
        address: '',
        contact_detail: '',
        tax_number: '',
        member:{},
        charter_capital: '',
        founding_date: new dayjs,
        capital_limit: '',
        company_code: '',
        company_type: 'CAPITAL',
        collateral: '',
        member_id:''
    })
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        company_name: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(255, 'Tối đa 255 ký tự')
        ,
        tax_number: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(255, 'Tối đa 255 ký tự'),
        founding_date: yup
            .string()
            .trim()
            .required('Không được để trống'),
        capital_limit: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(15, 'Tối đa 15 chữ số'),

    });
    const backList = () => {
        navigate('/company')
    }
    useEffect(() => {
        if (isUpdate) {
            if (location.get('id')) {
                setIdUpdate(location.get('id'));
            } else navigate('/company')
        }

    }, [location])
    useEffect(() => {
        if (isUpdate && idUpdate) {
            getListCompanyApi({id: idUpdate, page_size: 1}).then(r => {
                setInfo(r.data.companies[0])
                console.log(r.data.companies[0])
            }).catch(e => {

            })
        }
    }, [idUpdate])
    useEffect(()=>{
        getListMemberApi({paging: false}).then(r => {
            // console.log("r.data.companies",r.data);

            if (r.data.member_entities) {
                setListMember(convertToAutoComplete(r.data.member_entities, 'name'))

            } else {
                setListMember([])
            }

        }).catch(e => {

        })
    },[])
    const createCompanyApi = (data) => {
        return apiManagerCompany.createCompany(data);
    }
    const getListMemberApi = (data) => {
        return apiManagerMember.getListMember(data);
    }
    const updateCompanyApi = (data) => {
        return apiManagerCompany.updateCompany(idUpdate, data);
    }
    const getListCompanyApi = (data) => {
        return apiManagerCompany.getListCompany(data);
    }


    const back = () => {
        navigate('/company')
    }
    useEffect(() => {
        console.log("info", info)
    }, [info])
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
            <Button onClick={back} style={{marginBottom: '10px'}} variant="text" startIcon={<KeyboardBackspaceIcon/>}>Công
                ty</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý công ty
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
                        company_name: info.company_name,
                        address: info.address,
                        contact_detail: info.contact_detail,
                        // asset_type:info.asset_type.id,
                        // asset_group:info.asset_group.id,
                        member_id: idUpdate ? (info.member?info.member.id:"") : info.member_id,
                        member_name:info.member? info.member.name:'',
                        tax_number: info.tax_number,
                        charter_capital: info.charter_capital,
                        founding_date: isUpdate ? dayjs(info.founding_date, 'DD-MM-YYYY') : info.founding_date,
                        capital_limit: info.capital_limit,
                        collateral: info.collateral
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            let valueConvert = {...values};
                            valueConvert.founding_date = dayjs(values.founding_date).format('DD-MM-YYYY');
                            console.log(valueConvert)
                            if (isUpdate) {
                                updateCompanyApi(valueConvert).then(r => {
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

                                }).catch(e => {
                                    console.log(e)
                                })


                            } else {
                                createCompanyApi(valueConvert).then(r => {
                                    toast.success('Thêm mới thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate('/company/detail?id=' + r.data.id)
                                    }, 1050);

                                }).catch(e => {
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
                                <Box sx={{flexGrow: 1}} className={'form-content'}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Tên công ty<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='company_name'
                                                name='company_name'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.company_name}
                                                onChange={handleChange}
                                                error={touched.company_name && Boolean(errors.company_name)}
                                                helperText={touched.company_name && errors.company_name}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Khoản vay tối đa (VNĐ)<span
                                                className={'error-message'}>*</span></div>
                                            <NumericFormat
                                                size={"small"}
                                                id='capital_limit'
                                                name='capital_limit'
                                                className={'formik-input text-right'}
                                                customInput={TextField}
                                                // variant="standard"
                                                value={values.capital_limit}
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        console.log(floatValue)
                                                        setFieldValue('capital_limit', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.capital_limit && Boolean(errors.capital_limit)}
                                                helperText={touched.capital_limit && errors.capital_limit}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                }}
                                            />
                                            <Typography className={'uppercase'} variant="caption" display="block"
                                                        gutterBottom>
                                                {values.capital_limit ? `*Bằng chữ: ${capitalizeFirstLetter(VNnum2words(values.capital_limit))} đồng` : ''}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Người đại diện theo pháp luật
                                                {/*<span className={'error-message'}>*</span>*/}
                                            </div>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={listMember}
                                                value={{
                                                    id: values.member_id,
                                                    label: values.member_name
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
                                                                                      placeholder="Người đại diện theo pháp luật"
                                                                                      error={touched.member_id && Boolean(errors.member_id)}
                                                                                      helperText={touched.member_id && errors.member_id}/>}
                                                size={"small"}
                                                onChange={(event, newValue) => {
                                                    // setCompanySearch(newValue)
                                                    console.log("new_value", newValue)
                                                    if (newValue){
                                                        setFieldValue('member_id', newValue.id)
                                                        setFieldValue('member_name', newValue.label)

                                                    }
                                                    else{
                                                        setFieldValue('member_id', '')
                                                        setFieldValue('member_name', '')
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Mã số thuế<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='tax_number'
                                                name='tax_number'
                                                className={'formik-input'}

                                                // variant="standard"
                                                value={values.tax_number}
                                                onChange={handleChange}
                                                error={touched.tax_number && Boolean(errors.tax_number)}
                                                helperText={touched.tax_number && errors.tax_number}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Tài sản thế chấp</div>
                                            <TextField
                                                size={"small"}
                                                id='collateral'
                                                name='collateral'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.collateral}
                                                onChange={handleChange}
                                                error={touched.collateral && Boolean(errors.collateral)}
                                                helperText={touched.collateral && errors.collateral}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Địa chỉ</div>
                                            <TextField
                                                size={"small"}
                                                id='address'
                                                name='address'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.address}
                                                onChange={handleChange}
                                                error={touched.address && Boolean(errors.address)}
                                                helperText={touched.address && errors.address}

                                            />
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Thông tin liên hệ</div>
                                            <TextField
                                                size={"small"}
                                                id='contact_detail'
                                                name='contact_detail'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.contact_detail}
                                                onChange={handleChange}
                                                error={touched.address && Boolean(errors.address)}
                                                helperText={touched.address && errors.address}

                                            />
                                        </Grid>


                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Vốn điều lệ (VNĐ)</div>
                                            <NumericFormat
                                                size={"small"}
                                                id='charter_capital'
                                                customInput={TextField}
                                                name='charter_capital'
                                                className={'formik-input text-right'}
                                                // variant="standard"
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                value={values.charter_capital}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                                                }}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        console.log(floatValue)
                                                        setFieldValue('charter_capital', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.charter_capital && Boolean(errors.charter_capital)}
                                                helperText={touched.charter_capital && errors.charter_capital}
                                            />
                                            <Typography className={'uppercase'} variant="caption" display="block"
                                                        gutterBottom>
                                                {values.charter_capital ? `*Bằng chữ: ${capitalizeFirstLetter(VNnum2words(values.charter_capital))} đồng` : ''}
                                            </Typography>
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
                                            <div className={'label-input'}>Ngày thành lập</div>
                                            <LocalizationProvider style={{width: '100%'}} dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    style={{width: '100% !important', height: '30px'}}
                                                    inputFormat="DD-MM-YYYY"
                                                    value={values.founding_date}
                                                    // onChange={(values) => {
                                                    //     console.log(values)
                                                    //
                                                    // }}
                                                    onChange={value => props.setFieldValue("founding_date", value)}
                                                    error={touched.founding_date && Boolean(errors.founding_date)}
                                                    helperText={touched.founding_date && errors.founding_date}
                                                    renderInput={(params) => <TextField size={"small"}
                                                                                        fullWidth {...params} />}
                                                />
                                            </LocalizationProvider>

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