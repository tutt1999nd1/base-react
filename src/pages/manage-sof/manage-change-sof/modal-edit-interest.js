import DialogContent from "@mui/material/DialogContent";
import {
    Button, Divider,
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
import apiChangeInterestRate from "../../../api/manage-change-interest_rate";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";


export default function ModalEditInterest(props) {
    const {openModal, handleCloseModal,info,isUpdate,setRefresh,refresh,sourceOfFundId} = props
    const [fileAttachment, setFileAttachment] = useState([]);
    const [checkAttachment, setCheckAttachment] = useState([]);
    const [isDelete, setIsDelete] = useState(false);
    const validationSchema = yup.object({
        interest_rate_type: yup.string()
            .trim()
            .required('Không được để trống'),
        interest_rate: yup.string()
            .trim()
            .required('Không được để trống'),

    });
    useEffect(() => {
        if(info.attachment_entity != null){
            setCheckAttachment(info.attachment_entity.file_name);
        }else {
            setCheckAttachment("");
        }
        if(openModal == false)
            setFileAttachment([]);
            setIsDelete(false)

    }, [openModal,isUpdate])
    const createChangeInterestRateApi = (data) => {
        return apiChangeInterestRate.createChangeInterestRate(data);
    }
    const createChangeInterestRateApiFile = (data) => {
        return apiChangeInterestRate.createChangeInterestRateFile(data);
    }

    const updateChangeInterestRateApi = (data) => {
        return apiChangeInterestRate.updateChangeInterestRate(info.id, data);
    }
    const deleteFileServer = () => {
        console.log('deleteServer')
        setIsDelete(true)
    }
    const uploadFile = () => {
        setIsDelete(false)
        var el = window._protected_reference = document.createElement("INPUT");
        el.type = "file";
        // el.accept = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
        // el.multiple = "multiple";
        el.addEventListener('change', function (ev2) {
            let result = [];
            let resultFiles = [];
            console.log("el.files",el.files)
            if (el.files.length) {
                for (let i = 0; i < el.files.length; i++) {
                    resultFiles.push(el.files[i])
                }
            }
            new Promise(function (resolve) {
                setTimeout(function () {
                    console.log(el.files);
                    resolve();

                }, 1000);

                let copyState = [...fileAttachment];
                // copyState.concat(resultFiles)
                copyState.push.apply(copyState, resultFiles);

                setFileAttachment(copyState)
            })
                .then(function () {
                    // clear / free reference
                    el = window._protected_reference = undefined;
                });
        });

        el.click();
    }

    const deleteFile = (name) => {
        let arr = [...fileAttachment]
        let indexRemove = fileAttachment.findIndex(e => e.name === name)
        if (indexRemove !== -1 || name != "") {
            arr.splice(indexRemove, 1);
            setFileAttachment(arr)
            setCheckAttachment(arr)
        }

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
                        interest_rate: info.interest_rate,
                        interest_rate_type: info.interest_rate_type,
                        reference_interest_rate: info.reference_interest_rate,
                        interest_rate_rage: info.interest_rate_rage,
                        date_apply: dayjs(info.date_apply, 'DD-MM-YYYY'),
                        source_of_fund_id:sourceOfFundId,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            let valueConvert = {...values};
                            valueConvert.date_apply = dayjs(values.date_apply).format('DD-MM-YYYY');
                            valueConvert.is_delete = isDelete;
                            let formData = new FormData();
                            valueConvert.source_of_fund_id = parseInt(valueConvert.source_of_fund_id);
                            const request = new Blob([JSON.stringify(valueConvert)], {
                                type: 'application/json'
                            });

                            formData.append('file', fileAttachment[0] || null);
                            formData.append('request', request);
                            if (isUpdate) {
                                updateChangeInterestRateApi(formData).then(r => {
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
                                createChangeInterestRateApiFile(formData).then(r => {
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
                            <DialogContent style={{width: '450px', height: '350px'}} dividers className={"model-account-form"}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>
                                        <div className={'label-input'}>Lãi suất hợp đồng vay (%/năm)<span
                                            className={'error-message'}>*</span></div>
                                        <NumericFormat
                                            disabled={values.interest_rate_type === 'Biên độ'}
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
                                            // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                        />
                                        {/*<div>{</div>*/}
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <div className={'label-input'}>Loại lãi suất<span
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
                                                <MenuItem value={'Cố định'}>Cố định</MenuItem>
                                                <MenuItem value={'Biên độ'}>Biên độ</MenuItem>


                                            </Select>
                                            <FormHelperText
                                                className={'error-message'}>{errors.interest_rate_type}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item className={`${values.interest_rate_type === 'Cố định' ? 'hidden' : ''}`} xs={12} md={12}>
                                        <div className={'label-input'}>Lãi suất tham chiếu (%/năm)<span
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
                                            // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                        />
                                        {/*<div>{</div>*/}
                                    </Grid>
                                    <Grid item className={`${values.interest_rate_type === 'Cố định' ? 'hidden' : ''}`} xs={12} md={12}>
                                        <div className={'label-input'}>Biên độ lãi suất (%)<span
                                            className={'error-message'}>*</span></div>
                                        <NumericFormat
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
                                            // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <div className={'label-input'}>Ngày áp dụng lãi mới<span
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

                                    <Grid item xs={6} md={12}>
                                        <div style={{display: "flex", alignItems: "center"}}>Tập đính
                                            kèm <ControlPointIcon style={{cursor: "pointer", marginLeft: '10px'}}
                                                                  color="primary"
                                                                  className={`${fileAttachment.length > 0?'hidden':''}`}
                                                                  onClick={uploadFile}> </ControlPointIcon></div>


                                        <div className={'list-file'}>
                                            {checkAttachment != "" &&
                                                <>
                                                    <div className={'item-file'}>
                                                        <div className={'name-file '}>{checkAttachment}</div>
                                                        <div className={'delete-file'}><DeleteOutlineIcon
                                                            style={{cursor: "pointer"}}
                                                            color={"error"}
                                                            onClick={() => {
                                                                deleteFile(checkAttachment)
                                                                deleteFileServer()
                                                            }}></DeleteOutlineIcon></div>
                                                    </div>
                                                    <Divider light/>
                                                </>
                                            }
                                            {
                                                fileAttachment.map((e) => (
                                                    <>
                                                        <div className={'item-file'}>
                                                            <div className={'name-file '}>{e.name}</div>
                                                            <div className={'delete-file'}><DeleteOutlineIcon
                                                                style={{cursor: "pointer"}}
                                                                color={"error"}
                                                                onClick={() => {
                                                                    deleteFile(e.name)
                                                                }}></DeleteOutlineIcon></div>
                                                        </div>
                                                        <Divider light/>
                                                    </>

                                                ))
                                            }

                                        </div>
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