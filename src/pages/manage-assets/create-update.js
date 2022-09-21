import React, {useState} from "react";
import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    InputAdornment, MenuItem,
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

export default function EditAssets() {
    const validationSchema = yup.object({
        email: yup
            .string()
            .trim()
            .email('Vui lòng nhập đúng định dạng email')
            .required('Email không được để trống'),
        username: yup
            .string()
            .trim()
            .required('Tên đăng nhập không được để trống').matches(
                /^[a-zA-Z0-9]+$/,
                "Tên đăng nhập không chứa ký tự đặc biệt"
            ),
        name: yup
            .string()
            .trim()
            .required('Tên không được để trống')
        ,
        phoneNumber: yup
            .string()
            .trim()
            .required('Số điện thoại không được để trống')
            .matches(/^((([+84]|[84])+[3|5|7|8|9])|0[3|5|7|8|9])+([0-9]{8})$/,"Nhập đúng định dạng số điện thoại"),
        // .matches( /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,"Nhập đúng định dạng số điện thoại"),
        password: yup
            .string()
            .trim()
            // .matches(
            //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            //     "Mật khẩu tối thiểu 8 ký tự, chứa chữ hoa, chữ thường, số, và ký tự đặc biệt"
            // )
            .required('Mật khẩu không được để trống'),
        groupId: yup
            .string()
            .trim()
            .required('Nhóm quyền không được để trống'),
        rePassword: yup.string()
            .test('passwords-match', 'Mật khẩu không khớp', function (value) {
                return this.parent.password === value
            })
    });

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
                    <h4>Thêm mới</h4>
                </div>
                <Divider light />
                <Formik
                    enableReinitialize
                    initialValues={{

                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            console.log('values',values)
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
                                                className={'formik-input'}
                                                label="Tên tài sản"
                                                placeholder={'Tên tài sản'}
                                                // variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <FormControl fullWidth>
                                                <Select
                                                    value={'1'}
                                                    // value={infoAccount.groupId}
                                                    // onChange={handleChange}
                                                    // size='small'
                                                >
                                                    <MenuItem value={'1'}>Nhóm 1</MenuItem>
                                                    <MenuItem value={'2'}>Nhóm 2</MenuItem>
                                                    <MenuItem value={'3'}>Nhóm 3</MenuItem>

                                                </Select>
                                                {/*<FormHelperText className={'error-message'}>{errors.groupId}</FormHelperText>*/}
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                className={'formik-input'}
                                                label="Giá trị ban đầu"
                                                placeholder={'Giá trị ban đầu'}
                                                // variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                className={'formik-input'}
                                                label="Vốn vay"
                                                placeholder={'Vốn vay'}
                                                // variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                className={'formik-input'}
                                                label="Gốc vay tín dụng hiện tại"
                                                placeholder={'Gốc vay tín dụng hiện tại'}
                                                // variant="standard"
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                className={'formik-input'}
                                                label="Số tiền vay tối đa"
                                                placeholder={'Số tiền vay tối đa'}
                                                // variant="standard"
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
                                            />
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
