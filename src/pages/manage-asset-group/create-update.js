import React, {useEffect, useState} from "react";
import {Box, Button, Divider, Grid, TextField, Typography} from "@mui/material";
import {NumericFormat} from 'react-number-format';
import {toast, ToastContainer} from "react-toastify";
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PropTypes from "prop-types";
import apiManagerCategory from "../../api/manage-category";
import {TreeSelect} from "antd";
import apiManagerAssetGroup from "../../api/manage-asset-group";

export default function EditCompany(props) {
    const navigate = useNavigate();
    const [location,setLocation] = useSearchParams();
    const [value, setValue] = useState()
    const [assetGroupSearch, setAssetGroupSearch] = useState()

    const [listAssetGroupTree, setListAssetGroupTree] = useState([
    ]);

    const [info,setInfo] =useState({
        group_name:'',
        description:'',
        parent_id:0,
        parent_asset_group:{}

    })
    const {isUpdate} = props
    const [idUpdate,setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        group_name: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(255, 'Tối đa 255 ký tự')
        ,
        description: yup
            .string()
            .trim()
            // .required('Không được để trống')
            .max(4000, 'Tối đa 4000 ký tự')
        ,

    });
    const backList = () => {
        navigate('/asset-groups')
    }
    useEffect(()=>{
        if(isUpdate){
            if(location.get('id')){
                setIdUpdate(location.get('id'));
            }
            else navigate('/asset-groups')
        }

    },[location])
    useEffect(()=>{
        if(isUpdate&&idUpdate){
            getListAssetGroupApi({id:idUpdate,page_size:1}).then(r=>{
                setInfo( r.data.asset_groups[0])
                console.log(r.data.asset_groups[0])
            }).catch(e=>{

            })
        }
    },[idUpdate])
    const createAssetGroupApi = (data) => {
        return apiManagerAssetGroup.createAssetGroup(data);
    }
    const updateAssetGroupApi = (data) => {
        return apiManagerAssetGroup.updateAssetGroup(idUpdate,data);
    }
    const getListAssetGroupApi = (data) => {
        return apiManagerAssetGroup.getListAssetGroup(data);
    }
    const getListAssetGroupTreeApi = (data) => {
        return apiManagerAssetGroup.getListAssetGroupTree(data);
    }

    const back = () => {
        navigate('/asset-group')
    }
    useEffect(()=>{
        console.log("info",info)
        setAssetGroupSearch(info.parent_asset_group.id)
    },[info])
    useEffect(()=>{
        getListAssetGroupTreeApi({paging: false}).then(r => {
            console.log("setListCategoryTree", r.data)
            setListAssetGroupTree(r.data)
        }).catch(e => {
            console.log(e)
        })
    },[])
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
            <Button onClick={back} style={{marginBottom:'10px'}} variant="text" startIcon={<KeyboardBackspaceIcon />}>Nhóm tài sản</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent:'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý nhóm tài sản
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
                        group_name:info.group_name,
                        description:info.description,
                        parent_id:info.parent_id==null?0:info.parent_id,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            let valueConvert = {...values};
                            if(values.parent_id==0||values.parent_id===undefined)valueConvert.parent_id = null;
                            // alert(JSON.stringify(valueConvert));
                            // alert(values.parent_id);
                            if(isUpdate){
                                updateAssetGroupApi(valueConvert).then(r=>{
                                    toast.success('Cập nhật thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate(`/asset-group/detail?id=${idUpdate}`)
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
                                createAssetGroupApi(valueConvert).then(r=>{
                                    toast.success('Thêm mới thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate(`/asset-group/detail?id=${r.data.id}`)
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
                                            <div className={'label-input'}>Tên nhóm tài sản<span className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='group_name'
                                                name='group_name'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.group_name}
                                                onChange={handleChange}
                                                error={touched.group_name && Boolean(errors.group_name)}
                                                helperText={touched.group_name && errors.group_name}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Nhóm tài sản cha<span className={'error-message'}>*</span></div>
                                            <TreeSelect
                                                style={{ width: '100%' }}
                                                showSearch
                                                value={assetGroupSearch}
                                                treeData={listAssetGroupTree}
                                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                                placeholder="Không có hạng mục cha"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(values)=>{
                                                    setAssetGroupSearch(values)
                                                    setFieldValue('parent_id', values)
                                                }}
                                                filterTreeNode={(search, item) => {
                                                    return item.group_name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                                                }}
                                                fieldNames={{label: 'group_name', value: 'id', children: 'child_asset_groups'}}
                                            >
                                            </TreeSelect>
                                            {/*<FormHelperText style={{marginLeft:'15px'}}*/}
                                            {/*                className={'error-message'}>{categorySearch?'':'Không được để trống'}</FormHelperText>*/}

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Ghi chú</div>
                                            <TextField
                                                className={'formik-input'}
                                                // variant="standard"
                                                size={"small"}
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