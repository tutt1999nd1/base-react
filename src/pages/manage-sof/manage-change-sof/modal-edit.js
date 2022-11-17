import DialogContent from "@mui/material/DialogContent";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Form, Formik} from "formik";
import * as yup from "yup";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {NumericFormat} from "react-number-format";
import {capitalizeFirstLetter, VNnum2words} from "../../../constants/utils";
import dayjs from "dayjs";
import apiManagerCompany from "../../../api/manage-company";
import apiManagerMember from "../../../api/manage-member";
import apiChangeLendingAmount from "../../../api/manage-change-lending-amount";
import {toast} from "react-toastify";


export default function ModalChangeLendingAmount(props) {
    const {openModal, handleCloseModal,info,isUpdate,setRefresh,refresh,sourceOfFundId} = props
    const validationSchema = yup.object({
        paid_amount: yup
            .string()
            .trim()
            .required('Không được để trống'),
    });
    useEffect(() => {
        // alert(name)

    }, [openModal,isUpdate])
    const createChangeLendingAmountApi = (data) => {
        return apiChangeLendingAmount.createChangeLendingAmount(data);
    }
    const updateChangeLendingAmountApi = (data) => {
        return apiChangeLendingAmount.updateChangeLendingAmount(info.id, data);
    }
    return (
        <div>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        {isUpdate?"Cập nhật":"Thêm mới"}
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <Formik
                    enableReinitialize
                    initialValues={{
                        paid_amount: info.paid_amount,
                        date_apply: dayjs(info.date_apply, 'DD-MM-YYYY'),
                        source_of_fund_id:sourceOfFundId,
                        type:info.type,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            let valueConvert = {...values};
                            valueConvert.date_apply = dayjs(values.date_apply).format('DD-MM-YYYY');
                            if (isUpdate) {
                                updateChangeLendingAmountApi(valueConvert).then(r => {
                                    toast.success('Cập nhật thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        // navigate(`/company/detail?id=${idUpdate}`)
                                        handleCloseModal();
                                        setRefresh(!refresh)
                                    }, 500);

                                }).catch(e => {
                                    console.log(e)
                                })


                            } else {
                                createChangeLendingAmountApi(valueConvert).then(r => {
                                    toast.success('Thêm mới thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        // navigate('/company/detail?id=' + r.data.id)
                                        handleCloseModal();
                                        setRefresh(!refresh)
                                    }, 500);

                                }).catch(e => {
                                    console.log(e)
                                })
                            }
                        }
                    }>{props => {
                    const {
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        handleSubmit
                    } = props;
                    return (
                        <Form onSubmit={handleSubmit}>
                            <DialogContent style={{width: '450px', height: '300px'}} dividers className={"model-account-form"}>
                                <Grid container spacing={4}>
                                    <Grid item xs={6} md={12}>
                                        <div className={'label-input'}>{values.type==="lend"?"Số tiền vay thêm":"Số tiền trả"} (VNĐ)<span
                                            className={'error-message'}>*</span></div>
                                        <NumericFormat
                                            id='paid_amount'
                                            name='paid_amount'
                                            className={'formik-input text-right'}
                                            size={"small"}
                                            value={values.paid_amount}
                                            customInput={TextField}
                                            error={touched.paid_amount && Boolean(errors.paid_amount)}
                                            helperText={touched.paid_amount && errors.paid_amount}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                            }}
                                            thousandSeparator={"."}
                                            decimalSeparator={","}
                                            onValueChange={(values) => {
                                                const {formattedValue, value, floatValue} = values;
                                                const re = /^[0-9\b]+$/;
                                                if (re.test(floatValue)) {
                                                    setFieldValue('paid_amount', floatValue)
                                                }
                                            }}
                                        />
                                        <Typography className={'uppercase'} variant="caption" display="block"
                                                    gutterBottom>
                                            {values.paid_amount ? `*Bằng chữ: ${capitalizeFirstLetter(VNnum2words(values.paid_amount))} đồng` : ''}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <div className={'label-input'}>Loại thay đổi<span
                                            className={'error-message'}>*</span></div>
                                        <FormControl fullWidth>
                                            <Select
                                                size={'small'}
                                                labelId="type"
                                                id='type'
                                                name='type'
                                                value={values.type}
                                                onChange={handleChange}
                                                error={touched.type && Boolean(errors.type)}
                                                helperText={touched.type && errors.type}
                                                // size='small'
                                            >
                                                <MenuItem value={'pay'}>Trả gốc</MenuItem>
                                                <MenuItem value={'lend'}>Vay thêm</MenuItem>
                                            </Select>
                                            <FormHelperText
                                                className={'error-message'}>{errors.interest_rate_type}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} md={12}>
                                        <div className={'label-input'}>Ngày áo dụng gốc mới<span
                                            className={'error-message'}>*</span></div>
                                        <LocalizationProvider style={{width: '100%'}} dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                style={{width: '100% !important', height: '30px'}}
                                                inputFormat="DD-MM-YYYY"
                                                value={values.date_apply}
                                                onChange={value => props.setFieldValue("date_apply", value)}
                                                error={touched.date_apply && Boolean(errors.date_apply)}
                                                helperText={touched.date_apply && errors.date_apply}
                                                renderInput={(params) => <TextField size={"small"}
                                                                                    fullWidth {...params} />}
                                            />
                                        </LocalizationProvider>

                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="outlined" onClick={handleCloseModal}>
                                    Hủy
                                </Button>
                                <Button className={'vmp-btn'} variant={'contained'} type='submit'>
                                    Lưu
                                </Button>
                            </DialogActions>
                        </Form>
                    )
                }}
                </Formik>

            </Dialog>
        </div>
    )
}