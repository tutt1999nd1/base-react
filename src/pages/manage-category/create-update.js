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

export default function EditCompany(props) {
    const navigate = useNavigate();
    const [location,setLocation] = useSearchParams();
    const [listGroup,setListGroup] =useState([]);
    const [listType,setListType] =useState([]);
    const [typeDefault,setTypeDefault] = useState(0)
    const [groupDefault,setGroupDefault] = useState(0)
    const [value, setValue] = useState()
    const [listAllCategory,setListAllCategory] =useState([])
    const [categorySearch, setCategorySearch] = useState()

    const [listCategoryTree, setListCategoryTree] = useState([
    ]);
    const handleChangeDate = (newValue) => {
        setValue(newValue);
    };
    const [info,setInfo] =useState({
        category_name:'',
        description:'',
        parent_id:0,
        parent_category:{}

    })
    const {isUpdate} = props
    const [idUpdate,setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        category_name: yup
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
        navigate('/category')
    }
    useEffect(()=>{
        if(isUpdate){
            if(location.get('id')){
                setIdUpdate(location.get('id'));
            }
            else navigate('/category')
        }

    },[location])
    useEffect(()=>{
        if(isUpdate&&idUpdate){
            getListCategoryApi({id:idUpdate,page_size:1}).then(r=>{
                setInfo( r.data.categories[0])
                console.log(r.data.categories[0])
            }).catch(e=>{

            })
        }
    },[idUpdate])
    const createCategoryApi = (data) => {
        return apiManagerCategory.createCategory(data);
    }
    const updateCategoryApi = (data) => {
        return apiManagerCategory.updateCategory(idUpdate,data);
    }
    const getListCategoryApi = (data) => {
        return apiManagerCategory.getListCategory(data);
    }
    const getListCategoryTreeApi = (data) => {
        return apiManagerCategory.getListCategoryTree(data);
    }

    const back = () => {
        navigate('/category')
    }
    useEffect(()=>{
        console.log("info",info)
        setCategorySearch(info.parent_category.id)
    },[info])
    useEffect(()=>{
        getListCategoryTreeApi({paging: false}).then(r => {
            console.log("setListCategoryTree", r.data)
            setListCategoryTree(r.data)
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
            <Button onClick={back} style={{marginBottom:'10px'}} variant="text" startIcon={<KeyboardBackspaceIcon />}>Hạng mục</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent:'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý hạng mục
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
                        category_name:info.category_name,
                        description:info.description,
                        parent_id:info.parent_id==null?0:info.parent_id,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            let valueConvert = {...values};
                            if(values.parent_id==0)valueConvert.parent_id = null;
                            if(isUpdate){
                                updateCategoryApi(valueConvert).then(r=>{
                                    toast.success('Cập nhật thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate(`/category/detail?id=${idUpdate}`)
                                    }, 1050);

                                }).catch(e=>{
                                    console.log(e)
                                })


                            }
                            else {
                                createCategoryApi(valueConvert).then(r=>{
                                    toast.success('Thêm mới thành công', {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    setTimeout(() => {
                                        navigate(`/category/detail?id=${r.data.id}`)
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
                                            <div className={'label-input'}>Tên hạng mục<span className={'error-message'}>*</span></div>
                                            <TextField
                                                size={"small"}
                                                id='category_name'
                                                name='category_name'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.category_name}
                                                onChange={handleChange}
                                                error={touched.category_name && Boolean(errors.category_name)}
                                                helperText={touched.category_name && errors.category_name}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <div className={'label-input'}>Hạng mục cha<span className={'error-message'}>*</span></div>
                                            <TreeSelect
                                                style={{ width: '100%' }}
                                                showSearch
                                                value={categorySearch}
                                                treeData={listCategoryTree}
                                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                                placeholder="Không có hạng mục cha"
                                                allowClear
                                                treeDefaultExpandAll
                                                onChange={(values)=>{
                                                    setCategorySearch(values)
                                                    setFieldValue('parent_id', values)
                                                }}
                                                filterTreeNode={(search, item) => {
                                                    return item.category_name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                                                }}
                                                fieldNames={{label: 'category_name', value: 'id', children: 'child_categories'}}
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