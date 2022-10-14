import DialogContent from "@mui/material/DialogContent";
import {Box, Button, FormControl, Grid, InputAdornment, MenuItem, Select, TextField, Typography} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import * as yup from "yup";
import {Form, Formik} from "formik";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import {NumericFormat} from "react-number-format";
import {capitalizeFirstLetter, VNnum2words} from "../../constants/utils";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";


export default function ModalReject(props) {
    const {openModalReject, handleCloseModalReject, submitReject,idReject} = props
    const [description,setDescription]= useState('')
    const validationSchema = yup.object({
        description: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(4000, 'Tối đa 4000 ký tự')
    });

    return (
        <div>


            <Dialog fullWidth={true} classes={'modal-reject'} open={openModalReject} onClose={handleCloseModalReject}>

                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Từ chối yêu cầu
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalReject}
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
                        description:'',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            // setInfoAccount();
                            // submitAccount();
                            submitReject({
                                id:idReject,
                                description:values.description
                            })
                            handleCloseModalReject();
                            // setDescription('')
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
                                <DialogContent dividers className={"model-project"}>
                                    <div className="form-input">
                                        <div className="label confirm-delete-dataset">
                                            <div style={{marginBottom:'5px'}}>Lí do từ chối <span className={'error-message'}>*</span></div>
                                        </div>
                                        <TextField
                                            fullWidth
                                            id="description"
                                            name="description"
                                            value={values.description}
                                            multiline
                                            rows={5}
                                            onChange={handleChange}
                                            // placeholder={t('placeholder.enterInfor')}
                                            error={touched.description && Boolean(errors.description)}
                                            helperText={touched.description && errors.description}
                                        />
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="outlined" autoFocus onClick={handleCloseModalReject}>
                                        Hủy
                                    </Button>

                                    <Button type='submit' variant={'contained'} >Từ chối</Button>
                                </DialogActions>
                            </Form>
                        )
                    }}
                </Formik>

            </Dialog>
        </div>
    )
}