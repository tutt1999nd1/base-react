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
import {capitalizeFirstLetter, currencyFormatter} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment/moment";
import dateFormat from "dateformat";
import dayjs from "dayjs";
import {default as VNnum2words} from "vn-num2words";
import apiManagerCategory from "../../api/manage-category";
export default function EditCompany(props) {
    const navigate = useNavigate();
    const [location,setLocation] = useSearchParams();
    const [listGroup,setListGroup] =useState([]);
    const [listType,setListType] =useState([]);
    const [typeDefault,setTypeDefault] = useState(0)
    const [groupDefault,setGroupDefault] = useState(0)
    const [value, setValue] = useState()
    const [listAllCategory,setListAllCategory] =useState([])

    const handleChangeDate = (newValue) => {
        setValue(newValue);
    };
    const [info,setInfo] =useState({
        category_name:'',
        description:'',
        parent_id:0,

    })
    const {isUpdate} = props
    const [idUpdate,setIdUpdate] = useState(null)
    const validationSchema = yup.object({
        category_name: yup
            .string()
            .trim()
            .required('Không được để trống'),
        description: yup
            .string()
            .trim()
            .required('Không được để trống'),

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


    const back = () => {
        navigate('/category')
    }
    useEffect(()=>{
        console.log("info",info)
    },[info])
    useEffect(()=>{
        getListCategoryApi({
            'page_size': 0,
            'paging': false,
        }).then(r => {
            setListAllCategory(r.data.categories)
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
                                        navigate('/category')
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
                                                id='category_name'
                                                name='category_name'
                                                className={'formik-input'}
                                                label="Tên hạng mục*"
                                                placeholder={'Tên hạng mục*'}
                                                // variant="standard"
                                                value={values.category_name}
                                                onChange={handleChange}
                                                error={touched.category_name && Boolean(errors.category_name)}
                                                helperText={touched.category_name && errors.category_name}

                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="parent_id">Hạng mục cha</InputLabel>
                                                <Select
                                                    id={'parent_id'}
                                                    name={'parent_id'}
                                                    label={"Hạng mục cha"}
                                                    value={values.parent_id}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={0}>Không có hạng mục cha</MenuItem>
                                                    {
                                                        listAllCategory.map((e) => (
                                                            <MenuItem value={e.id}>{e.category_name}</MenuItem>
                                                        ))
                                                    }

                                                </Select>
                                            </FormControl>

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                className={'formik-input'}
                                                label="Ghi chú *"
                                                placeholder={'Ghi chú *'}
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