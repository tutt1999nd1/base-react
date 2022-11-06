import DialogContent from "@mui/material/DialogContent";
import {
    Autocomplete,
    Button,
    FormControl,
    FormHelperText,
    Grid,
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
import {convertToAutoComplete, currencyFormatter} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import {toast} from "react-toastify";
import apiManagerMember from "../../api/manage-member";
import dayjs from "dayjs";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";


export default function ModalEditHistory(props) {
    const {openModalAddHistory,idUpdateHistory, handleCloseModalAddHistory,isAddHistory,companyId,setIsRefresh,isRefresh} = props
    const [value,setValue] = useState({companyId:companyId,changingContent:'',changeDate:new dayjs})

    const submit = () => {
        handleCloseModalAddHistory();
        if(isAddHistory){
            addHistoryApi({company_id:companyId,changing_content:value.changingContent,change_date: dayjs(value.changeDate).format('DD-MM-YYYY')}).then(r=>{
                toast.success('Thêm mới thành công', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setIsRefresh(!isRefresh)
            }).catch(err => {
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
            updateHistoryApi(idUpdateHistory,{company_id:companyId,changing_content:value.changingContent,change_date: dayjs(value.changeDate).format('DD-MM-YYYY')}).then(r=>{
                toast.success('Thêm mới thành công', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setIsRefresh(!isRefresh)
            }).catch(err => {
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
    useEffect(() => {
        setValue({companyId:companyId,changingContent:'',change_date:new dayjs})

    }, [openModalAddHistory])
    useEffect(()=>{
        if(!isAddHistory){
            getHistoryApi(idUpdateHistory).then(r=>{
                setValue({...value,changingContent:r.data.changing_content,changeDate:dayjs(r.data.change_date, 'DD-MM-YYYY') })
            }).catch(e=>{

            })
        }
    },[idUpdateHistory,isAddHistory,openModalAddHistory])
    const getHistoryApi = (id) => {
        return apiManagerCompany.getHistoryById(id);
    }
    const addHistoryApi = (data) => {
        return apiManagerCompany.addHistory(data);
    }
    const updateHistoryApi = (id,data) => {
        return apiManagerCompany.updateHistory(id,data);
    }
    return (
        <div>
            <Dialog open={openModalAddHistory} onClose={handleCloseModalAddHistory}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Thêm lịch sử thay đổi
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalAddHistory}
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
                <DialogContent style={{width: '500px', height: '250px'}} dividers className={"model-project"}>
                    <div className="form-input">
                        <div className={'label-input'}>Ngày thay đổi<span className={'error-message'}>*</span>
                        </div>
                        <LocalizationProvider style={{width: '100%'}} dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                style={{width: '100% !important', height: '30px'}}
                                inputFormat="DD-MM-YYYY"
                                value={value.changeDate}
                                // onChange={(values) => {
                                //     console.log(values)
                                //
                                // }}
                                onChange={newValue => setValue({...value,changeDate: newValue})}
                                renderInput={(params) => <TextField size={"small"}
                                                                    fullWidth {...params} />}
                            />
                        </LocalizationProvider>

                    </div>
                    <div>

                        <div className={'label-input'}>Nội dung thay đổi<span className={'error-message'}>*</span>
                        </div>
                        <TextField
                            className={'formik-input'}
                            // variant="standard"
                            id='description'
                            name='description'
                            multiline
                            rows={5}
                            value={value.changingContent}
                            onChange={(event)=>{setValue({...value,changingContent: event.target.value})}}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" autoFocus onClick={handleCloseModalAddHistory}>
                        Hủy
                    </Button>
                    {/*{*/}
                    {/*    !(valueInput.trim() ==(name?name.trim():name)) ?   <Button disabled={true} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>Xóa</Button>*/}
                    {/*    :*/}
                    {/*        <Button  onClick={submit} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>Xóa</Button>*/}
                    {/*}*/}
                    <Button disabled={value.changingContent === ''||value.change_date.toString()==='Invalid Date'} onClick={submit} variant={'contained'} color={"error"}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}