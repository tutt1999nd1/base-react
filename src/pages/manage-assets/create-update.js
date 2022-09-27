import React, {useEffect, useState} from "react";
import {default as VNnum2words} from 'vn-num2words';
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

export default function EditAssets(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [typeDefault, setTypeDefault] = useState(0)
    const [groupDefault, setGroupDefault] = useState(0)
    const [listFileLocal, setListFileLocal] = useState([])
    const [listFileServer, setListFileServer] = useState([])
    const [listDeletedAttachment, setListDeletedAttachment] = useState([])
    const [info, setInfo] = useState({
        asset_name: '',
        asset_type: {id: 0},
        asset_group: {id: 0},
        description: '',
        initial_value: '',
        capital_value: '',
        max_capital_value: '',
        current_credit_value: '',
        list_attachments:[]
    })
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        asset_name: yup
            .string()
            .trim()
            .required('Không được để trống'),
        // asset_type: yup
        //     .string()
        //     .trim()
        //     .required('Không được để trống'),
        // asset_group: yup
        //     .string()
        //     .trim()
        //     .required('Không được để trống')
        // ,
        description: yup
            .string()
            .trim()
            .required('Không được để trống'),
        // .matches( /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,"Nhập đúng định dạng số điện thoại"),
        initial_value: yup
            .string()
            .trim()
            .required('Không được để trống'),
        capital_value: yup
            .string()
            .trim()
            .required('Không được để trống'),
        max_capital_value: yup.string()
            .trim()
            .required('Không được để trống'),
        current_credit_value: yup.string()
            .trim()
            .required('Không được để trống'),
    });
    const backList = () => {
        navigate('/assets')
    }
    useEffect(() => {
        if (isUpdate) {
            if (location.get('id')) {
                setIdUpdate(location.get('id'));
            } else navigate('/assets')
        }

    }, [location])
    useEffect(() => {
        if (isUpdate && idUpdate) {
            getListAssetsApi({id: idUpdate, page_size: 1}).then(r => {
                setInfo(r.data.assets[0])
                console.log(r.data.assets[0])
            }).catch(e => {

            })
        }
    }, [idUpdate])
    const createAssetApi = (data) => {
        return apiManagerAssets.createAsset(data);
    }
    const updateAssetApi = (data) => {
        return apiManagerAssets.updateAsset(idUpdate, data);
    }
    const getListAssetsApi = (data) => {
        return apiManagerAssets.getListAsset(data);
    }
    useEffect(() => {

        getListAssetTypeApi().then(r => {
            setListType(r.data.asset_types)
            if (!isUpdate)
                if (r.data.asset_types.length > 0) {
                    setTypeDefault(r.data.asset_types[0].id)
                }
        }).catch(e => {

        })
        getListAssetGroupApi().then(r => {
            setListGroup(r.data.asset_groups)
            if (!isUpdate)
                if (r.data.asset_groups.length > 0) {
                    setGroupDefault(r.data.asset_groups[0].id)
                }
        }).catch(e => {

        })
    }, [])

    const getListAssetGroupApi = (data) => {
        return apiManagerAssets.getAssetGroup(data);
    }
    const getListAssetTypeApi = (data) => {
        return apiManagerAssets.getAssetType(data);
    }
    const back = () => {
        navigate('/assets')
    }
    useEffect(() => {
        console.log("listFile", listFileLocal)
        setListFileServer(info.list_attachments)
    }, [info])

    useEffect(() => {
        console.log(VNnum2words(10000));
        }, [listFileServer])
    const deleteFileLocal = (name) => {
        let arr = [...listFileLocal]
        let indexRemove = listFileLocal.findIndex(e=>e.name === name)
        if (indexRemove !== -1) {
            arr.splice(indexRemove, 1);
            setListFileLocal(arr)
        }

    }
    const deleteFileServer = (id,name) => {
        let arr = [...listFileServer]
        console.log("Arr",arr)
        let indexRemove = listFileServer.findIndex(e=>e.file_name === name)
        if (indexRemove !== -1) {
            arr.splice(indexRemove, 1);
            setListFileServer(arr)
        }
        let copyListDeleteServer = [...listDeletedAttachment]
        copyListDeleteServer.push(id)
        setListDeletedAttachment(copyListDeleteServer)
    }
    const checkFileLocaleAlready = (name) => {
        let index = listFileLocal.findIndex(e=>e.name === name)
        let index2 = listFileServer.findIndex(e=>e.file_name === name)
        if(index2 !== -1){
            return true
        }
        if(index !== -1){
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
                    if(!checkFileLocaleAlready(el.files[i].name)){
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
            <Button onClick={back} style={{marginBottom: '10px'}} variant="text" startIcon={<KeyboardBackspaceIcon/>}>Tài
                sản</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý tài sản
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
                        asset_name: info.asset_name,
                        asset_type: isUpdate ? info.asset_type.id : typeDefault,
                        asset_group: isUpdate ? info.asset_group.id : groupDefault,
                        // asset_type:info.asset_type.id,
                        // asset_group:info.asset_group.id,
                        description: info.description,
                        initial_value: info.initial_value,
                        capital_value: info.capital_value,
                        max_capital_value: info.max_capital_value,
                        current_credit_value: info.current_credit_value,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            console.log('values', values)
                            let valueConvert = values;
                            let formData = new FormData();
                            formData.append('assetTypeId',values.asset_type)
                            formData.append('description',values.description)
                            for (let i = 0; i <listFileLocal.length ; i++) {
                                formData.append('newAttachment',listFileLocal[i])
                            }
                            formData.append('assetName',values.asset_name)
                            formData.append('assetGroupId',values.asset_group)
                            formData.append('initialValue',values.initial_value)
                            formData.append('capitalValue',values.capital_value)
                            formData.append('currentCreditValue',values.current_credit_value)
                            formData.append('maxCapitalValue',values.max_capital_value)
                            // formData.append('currentCreditValue',values.)
                            console.log(valueConvert)
                            if (isUpdate) {
                                formData.append('description',values.description)
                                console.log("listDeletedAttachment",listDeletedAttachment)
                                for (let i = 0; i < listDeletedAttachment.length; i++) {
                                    formData.append('listDeletedAttachment',listDeletedAttachment[i])
                                }
                                updateAssetApi(formData).then(r => {
                                    toast.success('Cập nhật thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate(`/assets/detail?id=${idUpdate}`)
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

                                createAssetApi(formData).then(r => {
                                    toast.success('Thêm mới thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate('/assets')
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
                                            <TextField
                                                id='asset_name'
                                                name='asset_name'
                                                className={'formik-input'}
                                                label="Tên tài sản *"
                                                placeholder={'Tên tài sản *'}
                                                // variant="standard"
                                                value={values.asset_name}
                                                onChange={handleChange}
                                                error={touched.asset_name && Boolean(errors.asset_name)}
                                                helperText={touched.asset_name && errors.asset_name}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="asset_group_label">Nhóm tài sản</InputLabel>
                                                <Select
                                                    label={"Nhóm tài sản *"}
                                                    id='asset_group'
                                                    name='asset_group'
                                                    value={values.asset_group}
                                                    onChange={handleChange}
                                                    error={touched.asset_group && Boolean(errors.asset_group)}
                                                    helperText={touched.asset_group && errors.asset_group}
                                                    // size='small'
                                                >
                                                    {
                                                        listGroup.map((e) => (
                                                            <MenuItem value={e.id}>{e.group_name}</MenuItem>
                                                        ))
                                                    }

                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.asset_group}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={6} md={6}>

                                            <FormControl fullWidth>
                                                <InputLabel id="asset_type_label">Loại tài sản *</InputLabel>
                                                <Select

                                                    labelId="asset_type_label"
                                                    id='asset_type'
                                                    name='asset_type'
                                                    label='Loại tài sản *'
                                                    value={values.asset_type}
                                                    onChange={handleChange}
                                                    error={touched.asset_type && Boolean(errors.asset_type)}
                                                    helperText={touched.asset_type && errors.asset_type}
                                                    // size='small'
                                                >
                                                    {
                                                        listType.map((e) => (
                                                            <MenuItem value={e.id}>{e.asset_type_name}</MenuItem>
                                                        ))
                                                    }

                                                </Select>
                                                <FormHelperText
                                                    className={'error-message'}>{errors.asset_type}</FormHelperText>
                                            </FormControl>
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
                                                    console.log(floatValue)

                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue)||floatValue===undefined) {
                                                        setFieldValue('initial_value', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.initial_value && Boolean(errors.initial_value)}
                                                helperText={touched.initial_value && errors.initial_value}
                                                // helperText={VNnum2words(values.initial_value)==='không'?'':`${VNnum2words(values.initial_value)} đồng`}
                                            />
                                            <div>{values.initial_value}</div>
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
                                                    if (re.test(floatValue)) {
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
                                                    if (re.test(floatValue)) {
                                                        console.log(floatValue)
                                                        setFieldValue('current_credit_value', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.current_credit_value && Boolean(errors.current_credit_value)}
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
                                                error={touched.max_capital_value && Boolean(errors.max_capital_value)}
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
                                                    if (re.test(floatValue)) {
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
                                                error={touched.description && Boolean(errors.description)}
                                                helperText={touched.description && errors.description}

                                            />
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
                                                                    onClick={()=>{deleteFileLocal(e.name)}}></DeleteOutlineIcon></div>
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
                                                                    onClick={()=>{deleteFileServer(e.id,e.file_name)}}></DeleteOutlineIcon></div>
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