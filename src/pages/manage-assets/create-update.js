import React, {useEffect, useState} from "react";
import {
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
import apiManagerAssets from "../../api/manage-assets";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PropTypes from "prop-types";
import {capitalizeFirstLetter, VNnum2words} from "../../constants/utils";
import TextFieldLink from "../../components/TextFieldLink";
import {TreeSelect} from "antd";
import apiManagerCampaign from "../../api/manage-campaign";
import apiManagerAssetGroup from "../../api/manage-asset-group";

export default function EditAssets(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [typeDefault, setTypeDefault] = useState(0)
    const [groupDefault, setGroupDefault] = useState(0)
    const [listFileLocal, setListFileLocal] = useState([])
    const [listFileServer, setListFileServer] = useState([])
    const [listLink, setListLink] = useState([])
    const [listLinkServer, setListLinkServer] = useState([])
    const [listDeleteLinkServer, setListDeleteLinkServer] = useState([])
    const [listDeletedAttachment, setListDeletedAttachment] = useState([])
    const [assetGroupSearch, setAssetGroupSearch] = useState();
    const [listAssetGroupTree, setListAssetGroupTree] = useState([]);

    const [info, setInfo] = useState({
        asset_name: '',
        asset_group: {id: 0},
        asset_group_id: '',
        description: '',
        initial_value: '',
        capital_value: '',
        max_capital_value: '',
        current_credit_value: '',
        list_attachments: [],
        new_reference_link: ''
    })
    const {isUpdate} = props
    const [idUpdate, setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        asset_name: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng')
            .max(255, 'T???i ??a 255 k?? t???')
        ,

        // asset_type: yup
        //     .string()
        //     .trim()
        //     .required('Kh??ng ???????c ????? tr???ng'),
        // asset_group: yup
        //     .string()
        //     .trim()
        //     .required('Kh??ng ???????c ????? tr???ng')
        // ,
        description: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng')
            .max(4000, 'T???i ??a 4000 k?? t???')
        ,
        // .matches( /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,"Nh???p ????ng ?????nh d???ng s??? ??i???n tho???i"),
        initial_value: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng')
            .max(15, 'T???i ??a 15 ch??? s???')
        ,

        capital_value: yup
            .string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng')
            .max(15, 'T???i ??a 15 ch??? s???')
        ,

        max_capital_value: yup.string()
            .trim()
            .required('Kh??ng ???????c ????? tr???ng')
            .max(15, 'T???i ??a 15 ch??? s???')
        ,

    });
    const backList = () => {
        navigate('/assets')
    }
    const addNewLink = () => {
        setListLink([...listLink, {download_link: '', attachment_type: ''}])
    }
    const changeValueLink = (value, index) => {
        setListLink([...listLink.slice(0, index), {
            ...listLink[index],
            download_link: value
        }, ...listLink.slice(index + 1)
        ])
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
    useEffect(() => {

        // setCategorySearch(info.capital_category.id)

    }, [info])
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
        getListAssetGroupTreeApi({paging: false}).then(r => {
            setListAssetGroupTree(r.data)
        }).catch(e => {
            console.log(e)
        })
    }, [])
    const getListAssetGroupTreeApi = (data) => {
        return apiManagerAssetGroup.getListAssetGroupTree(data);
    }
    const getListAssetGroupApi = (data) => {
        return apiManagerAssets.getAssetGroup(data);
    }

    const back = () => {
        navigate('/assets')
    }
    useEffect(() => {
        console.log("listFile", listFileLocal)
        let arrLocal = [...info.list_attachments];
        arrLocal = arrLocal.filter(e => e.attachment_type === 'LOCAL')
        setListFileServer(arrLocal)
        let arrServer = [...info.list_attachments]
        arrServer = arrServer.filter(e => e.attachment_type != 'LOCAL')
        setListLinkServer(arrServer)
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
            <Button onClick={back} style={{marginBottom: '10px'}} variant="text" startIcon={<KeyboardBackspaceIcon/>}>T??i
                s???n</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Qu???n l?? t??i s???n
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
                        asset_name: info.asset_name,
                        asset_group: isUpdate ? info.asset_group.id : groupDefault,
                        asset_group_id: idUpdate ? info.asset_group.id : info.asset_group_id,
                        // asset_type:info.asset_type.id,
                        // asset_group:info.asset_group.id,
                        description: info.description,
                        initial_value: info.initial_value,
                        capital_value: info.capital_value,
                        max_capital_value: info.max_capital_value,
                        current_credit_value: info.current_credit_value,
                        new_reference_link: info.new_reference_link

                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            console.log('values', values)
                            let valueConvert = values;
                            let formData = new FormData();
                            formData.append('description', values.description)
                            for (let i = 0; i < listFileLocal.length; i++) {
                                formData.append('newAttachment', listFileLocal[i])
                            }
                            for (let i = 0; i < listLink.length; i++) {
                                formData.append('newReferenceLink', listLink[i].download_link)
                            }
                            formData.append('assetName', values.asset_name)
                            formData.append('initialValue', values.initial_value)
                            formData.append('capitalValue', values.capital_value)
                            formData.append('currentCreditValue', values.current_credit_value)
                            formData.append('maxCapitalValue', values.max_capital_value)
                            formData.append('assetGroupId', values.asset_group_id)
                            // formData.append('currentCreditValue',values.)
                            console.log(valueConvert)
                            if (isUpdate) {
                                formData.append('description', values.description)
                                console.log("listDeletedAttachment", listDeletedAttachment)
                                for (let i = 0; i < listDeletedAttachment.length; i++) {
                                    formData.append('listDeletedAttachment', listDeletedAttachment[i])
                                }
                                for (let i = 0; i < listDeleteLinkServer.length; i++) {
                                    formData.append('listDeletedAttachment', listDeleteLinkServer[i])
                                }
                                updateAssetApi(formData).then(r => {
                                    toast.success('C???p nh???t th??nh c??ng', {
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
                                    console.log(e)
                                })


                            } else {

                                createAssetApi(formData).then(r => {
                                    toast.success('Th??m m???i th??nh c??ng', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });

                                    setTimeout(() => {
                                        console.log("r.data.id", r.data.id)
                                        navigate(`/assets/detail?id=${r.data.id}`)
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
                                            <div className={'label-input'}>T??n t??i s???n <span
                                                className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='asset_name'
                                                name='asset_name'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.asset_name}
                                                onChange={handleChange}
                                                error={touched.asset_name && Boolean(errors.asset_name)}
                                                helperText={touched.asset_name && errors.asset_name}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Nh??m t??i s???n</div>
                                            <TreeSelect
                                                style={{width: '100%'}}
                                                showSearch
                                                value={assetGroupSearch}
                                                treeData={listAssetGroupTree}
                                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                                placeholder="Nh??m t??i s???n"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(values) => {
                                                    setAssetGroupSearch(values)
                                                    setFieldValue('asset_group_id', values)
                                                }}
                                                filterTreeNode={(search, item) => {
                                                    return item.category_name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                                                }}
                                                fieldNames={{
                                                    label: 'group_name',
                                                    value: 'id',
                                                    children: 'child_asset_groups'
                                                }}
                                            >
                                            </TreeSelect>
                                        </Grid>


                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Gi?? tr??? ban ?????u (VN??)<span
                                                className={'error-message'}>*</span></div>
                                            <NumericFormat
                                                size={"small"}
                                                style={{textAlign: "right"}}
                                                id='initial_value'
                                                customInput={TextField}
                                                name='initial_value'
                                                className={'formik-input text-right'}
                                                // variant="standard"
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                value={values.initial_value}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VN??</InputAdornment>,
                                                }}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    console.log(floatValue)

                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        setFieldValue('initial_value', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.initial_value && Boolean(errors.initial_value)}
                                                helperText={touched.initial_value && errors.initial_value}
                                                // helperText={VNnum2words(values.initial_value)==='kh??ng'?'':`${VNnum2words(values.initial_value)} ?????ng`}
                                            />
                                            {/*<div>{</div>*/}
                                            <Typography className={'uppercase'} variant="caption" display="block"
                                                        gutterBottom>
                                                {values.initial_value ? `*B???ng ch???: ${capitalizeFirstLetter(VNnum2words(values.initial_value))} ?????ng` : ''}
                                            </Typography>

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>V???n vay (VN??)<span
                                                className={'error-message'}>*</span></div>
                                            <NumericFormat
                                                size={"small"}
                                                id='capital_value'
                                                name='capital_value'
                                                className={'formik-input text-right'}
                                                customInput={TextField}
                                                // variant="standard"
                                                value={values.capital_value}
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        console.log(floatValue)
                                                        setFieldValue('capital_value', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.capital_value && Boolean(errors.capital_value)}
                                                helperText={touched.capital_value && errors.capital_value}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VN??</InputAdornment>,

                                                }}

                                            />
                                            <Typography className={'uppercase'} variant="caption" display="block"
                                                        gutterBottom>
                                                {values.capital_value ? `*B???ng ch???: ${capitalizeFirstLetter(VNnum2words(values.capital_value))} ?????ng` : ''}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>G???c vay t??n d???ng hi???n t???i (VN??)<span
                                                className={'error-message'}>*</span></div>
                                            <NumericFormat
                                                id='current_credit_value'
                                                name='current_credit_value'
                                                className={'formik-input text-right'}
                                                customInput={TextField}
                                                size={"small"}
                                                value={values.current_credit_value}
                                                thousandSeparator={"."}
                                                decimalSeparator={","}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value, floatValue} = values;
                                                    // do something with floatValue
                                                    const re = /^[0-9\b]+$/;
                                                    if (re.test(floatValue) || floatValue === undefined) {
                                                        console.log(floatValue)
                                                        setFieldValue('current_credit_value', floatValue)
                                                    }
                                                    // setFieldValue('max_capital_value', formattedValue)

                                                }}
                                                error={touched.current_credit_value && Boolean(errors.current_credit_value)}
                                                helperText={touched.current_credit_value && errors.current_credit_value}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VN??</InputAdornment>,
                                                }}
                                                // variant="standard"
                                            />
                                            <Typography className={'uppercase'} variant="caption" display="block"
                                                        gutterBottom>
                                                {values.current_credit_value ? `*B???ng ch???: ${capitalizeFirstLetter(VNnum2words(values.current_credit_value))} ?????ng` : ''}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>S??? ti???n vay t???i ??a (VN??)<span
                                                className={'error-message'}>*</span></div>
                                            <NumericFormat
                                                id='max_capital_value'
                                                name='max_capital_value'
                                                className={'formik-input text-right'}
                                                size={"small"}
                                                // type={"number"}
                                                // variant="standard"
                                                value={values.max_capital_value}
                                                // onChange={handleChange}
                                                customInput={TextField}
                                                error={touched.max_capital_value && Boolean(errors.max_capital_value)}
                                                helperText={touched.max_capital_value && errors.max_capital_value}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VN??</InputAdornment>,

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
                                            <Typography className={'uppercase'} variant="caption" display="block"
                                                        gutterBottom>
                                                {values.max_capital_value ? `*B???ng ch???: ${capitalizeFirstLetter(VNnum2words(values.max_capital_value))} ?????ng` : ''}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Th??ng tin<span
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
                                            <div className={'label-input'} style={{
                                                display: "flex",
                                                alignItems: "center",
                                                // justifyContent: 'space-between'
                                            }}>T???p ????nh
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