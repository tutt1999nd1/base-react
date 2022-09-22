import React, {useState} from "react";
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
import {useNavigate} from "react-router-dom";

export default function EditAssets(props) {
    const navigate = useNavigate();
    const {isUpdate} = props
    const validationSchema = yup.object({
        asset_name: yup
            .string()
            .trim()
            .required('Không được để trống'),
        asset_type: yup
            .string()
            .trim()
            .required('Không được để trống'),
        asset_group: yup
            .string()
            .trim()
            .required('Không được để trống')
        ,
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
            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent:'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý tài sản
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
                        asset_name:'',
                        asset_type:'1',
                        asset_group:'1',
                        description:'',
                        initial_value:'',
                        capital_value:'',
                        max_capital_value:'',
                        current_credit_value:'',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            console.log('values',values)
                            if(isUpdate){
                                toast.success('Cập nhật thành công', {
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
                            }
                            else {
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
                                                id='asset_name'
                                                name='asset_name'
                                                className={'formik-input'}
                                                label="Tên tài sản"
                                                placeholder={'Tên tài sản'}
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
                                                    label={"Nhóm tài sản"}
                                                    id='asset_group'
                                                    name='asset_group'
                                                    value={values.asset_group}
                                                    onChange={handleChange}
                                                    error={touched.asset_group && Boolean(errors.asset_group)}
                                                    helperText={touched.asset_group && errors.asset_group}
                                                    // size='small'
                                                >
                                                    <MenuItem value={'1'}>Nhóm 1</MenuItem>


                                                </Select>
                                                <FormHelperText className={'error-message'}>{errors.asset_group}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={6} md={6}>

                                            <FormControl fullWidth>
                                                <InputLabel id="asset_type_label">Loại tài sản</InputLabel>
                                                <Select
                                                    labelId="asset_type_label"
                                                    id='asset_type'
                                                    name='asset_type'
                                                    label='Loại tài sản'
                                                    value={values.asset_type}
                                                    onChange={handleChange}
                                                    error={touched.asset_type && Boolean(errors.asset_type)}
                                                    helperText={touched.asset_type && errors.asset_type}
                                                    // size='small'
                                                >
                                                    <MenuItem value={'1'}>Bất động sản</MenuItem>


                                                </Select>
                                                <FormHelperText className={'error-message'}>{errors.asset_type}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                id='initial_value'
                                                name='initial_value'
                                                className={'formik-input'}
                                                label="Giá trị ban đầu"
                                                placeholder={'Giá trị ban đầu'}
                                                type={"number"}
                                                // variant="standard"
                                                value={values.initial_value}
                                                onChange={handleChange}
                                                error={touched.initial_value && Boolean(errors.initial_value)}
                                                helperText={touched.initial_value && errors.initial_value}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                id='capital_value'
                                                name='capital_value'
                                                className={'formik-input'}
                                                label="Vốn vay"
                                                placeholder={'Vốn vay'}
                                                type={"number"}
                                                // variant="standard"
                                                value={values.capital_value}
                                                onChange={handleChange}
                                                error={touched.capital_value && Boolean(errors.capital_value)}
                                                helperText={touched.capitalValue && errors.capitalValue}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                id='current_credit_value'
                                                name='current_credit_value'
                                                className={'formik-input'}
                                                label="Gốc vay tín dụng hiện tại"
                                                placeholder={'Gốc vay tín dụng hiện tại'}
                                                type={"number"}
                                                value={values.current_credit_value}
                                                onChange={handleChange}
                                                error={touched.current_credit_value  && Boolean(errors.current_credit_value)}
                                                helperText={touched.current_credit_value && errors.current_credit_value}
                                                // variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                id='max_capital_value'
                                                name='max_capital_value'
                                                className={'formik-input'}
                                                label="Số tiền vay tối đa"
                                                placeholder={'Số tiền vay tối đa'}
                                                type={"number"}
                                                // variant="standard"
                                                value={values.max_capital_value}
                                                onChange={handleChange}
                                                error={touched.max_capital_value  && Boolean(errors.max_capital_value)}
                                                helperText={touched.max_capital_value && errors.max_capital_value}
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
                                                label="Thông tin"
                                                placeholder={'Thông tin'}
                                                // variant="standard"
                                                id='description'
                                                name='description'
                                                multiline
                                                rows={5}
                                                value={values.description}
                                                onChange={handleChange}
                                                error={touched.description  && Boolean(errors.description)}
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
