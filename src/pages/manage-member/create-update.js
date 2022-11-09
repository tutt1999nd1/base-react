import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Divider,
    FormControl, FormHelperText,
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
import apiManagerMember from "../../api/manage-member";

export default function EditMember(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [info, setInfo] = useState({
        name: '',
        type: 'human',
        description: '',
    })
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        name: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(255, 'Tối đa 255 ký tự')
        ,
        type: yup
            .string()
            .trim()
            .required('Không được để trống'),
        description: yup
            .string()
            .trim()
            .max(9999, 'Tối đa 10000 ký tự'),

    });
    const backList = () => {
        navigate('/member')
    }
    useEffect(() => {
        if (isUpdate) {
            if (location.get('id')) {
                setIdUpdate(location.get('id'));
            } else navigate('/member')
        }

    }, [location])
    useEffect(() => {
        if (isUpdate && idUpdate) {
            getListMemberApi({id: idUpdate, page_size: 1}).then(r => {
                setInfo(r.data.member_entities[0])
                console.log(r.data.member_entities[0])
            }).catch(e => {

            })
        }
    }, [idUpdate])
    const createMemberApi = (data) => {
        return apiManagerMember.createMember(data);
    }
    const updateMemberApi = (data) => {
        return apiManagerMember.updateMember(idUpdate, data);
    }
    const getListMemberApi = (data) => {
        return apiManagerMember.getListMember(data);
    }


    const back = () => {
        navigate('/member')
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
            <Button onClick={back} style={{marginBottom: '10px'}} variant="text" startIcon={<KeyboardBackspaceIcon/>}>Thành viên</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý thành viên
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
                        name: info.name,
                        type: info.type,
                        description: info.description,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            let valueConvert = {...values};
                            if (isUpdate) {
                                updateMemberApi(valueConvert).then(r => {
                                    toast.success('Cập nhật thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate(`/member/detail?id=${idUpdate}`)
                                    }, 1050);

                                }).catch(e => {
                                    console.log(e)
                                })


                            } else {
                                createMemberApi(valueConvert).then(r => {
                                    toast.success('Thêm mới thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate('/member/detail?id=' + r.data.id)
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
                                            <div className={'label-input'}>Tên thành viên<span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='name'
                                                name='name'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.name}
                                                onChange={handleChange}
                                                error={touched.name && Boolean(errors.name)}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Kiểu thành viên<span className={'error-message'}>*</span>
                                            </div>
                                            <FormControl fullWidth>
                                                <Select
                                                    size={'small'}
                                                    labelId="asset_type_label"
                                                    id='type'
                                                    name='type'
                                                    value={values.type}
                                                    onChange={handleChange}
                                                    error={touched.type && Boolean(errors.type)}
                                                    helperText={touched.type && errors.type}
                                                    // size='small'
                                                >
                                                    <MenuItem value={'human'}>Cá nhân</MenuItem>
                                                    <MenuItem value={'company'}>Công ty</MenuItem>

                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.status}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Mô tả</div>
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