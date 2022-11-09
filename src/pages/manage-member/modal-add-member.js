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


export default function ModalAddMember(props) {
    const {openModalAddMember, handleCloseModalAddMember,memberId, save,setIsRefresh,isRefresh} = props
    const [value,setValue] = useState({companyId:'',memberId:memberId,position:'NV',companyName:''})
    const [listCompany, setListCompany] = useState([]);

    const submit = () => {
        handleCloseModalAddMember();
        addMemberCompanyApi({company_id:value.companyId,member_id:value.memberId,position:value.position}).then(r=>{
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
        })
    }
    useEffect(() => {
        setValue({companyId:'',memberId:memberId,position:'NV',companyName:''})
        // alert(name)

    }, [openModalAddMember])
    useEffect(()=>{
        getListCompanyApi({paging: false}).then(r => {
            console.log("r tutt", r.data)
            // console.log("r.data.companies",r.data);

            if (r.data.companies) {
                setListCompany(convertToAutoComplete(r.data.companies, 'company_name'))

            } else {
                setListCompany([])
            }

        }).catch(e => {

        })
    },[])
    const handleChangePosition = (e) => {
      setValue({...value,position: e.target.value})
    }
    const getListCompanyApi = (data) => {
        return apiManagerCompany.getListCompany(data);
    }
    const addMemberCompanyApi = (data) => {
        return apiManagerCompany.addCompanyMember(data);
    }
    return (
        <div>
            <Dialog open={openModalAddMember} onClose={handleCloseModalAddMember}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Thêm thành viên vào công ty
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalAddMember}
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
                <DialogContent style={{width: '450px', height: '200px'}} dividers className={"model-project"}>
                    <div className="form-input">
                        <div className={'label-input'}>Công ty<span className={'error-message'}>*</span>
                        </div>
                        <Autocomplete
                            id="combo-box-demo"
                            options={listCompany}
                            value={{
                                id: value.companyId,
                                label: value.companyName,
                            }
                            }

                            renderInput={(params) => < TextField  {...params} />}
                            size={"small"}
                            onChange={(event, newValue) => {
                                // setCompanySearch(newValue)
                                console.log("new_value", newValue)
                                if (newValue){
                                    setValue({...value,companyId: newValue.id,companyName:newValue.label})
                                    // setFieldValue('capital_company_id', newValue.id)
                                    // setFieldValue('capital_campaign_name', newValue.label)
                                    // setIdCompanyCurrent(newValue.id)
                                }
                                else{
                                    setValue({...value,companyId: '',companyName:''})
                                    // setFieldValue('capital_company_id', '')
                                    // setFieldValue('capital_campaign_name', '')
                                    // setIdCompanyCurrent(0)
                                }
                            }}
                        />
                    </div>
                    <div>

                        <div className={'label-input'}>Vị trí<span className={'error-message'}>*</span>
                        </div>
                        <FormControl fullWidth>
                            <Select
                                size={'small'}
                                labelId="asset_type_label"
                                value={value.position}
                                onChange={handleChangePosition}

                                // size='small'
                            >
                                <MenuItem value={'NV'}>Nhân viên</MenuItem>
                                <MenuItem value={'BGĐ'}>Ban giám đốc</MenuItem>

                            </Select>

                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" autoFocus onClick={handleCloseModalAddMember}>
                        Hủy
                    </Button>
                    {/*{*/}
                    {/*    !(valueInput.trim() ==(name?name.trim():name)) ?   <Button disabled={true} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>Xóa</Button>*/}
                    {/*    :*/}
                    {/*        <Button  onClick={submit} variant={'contained'} className={`vmp-btn ${!(valueInput.trim() ==(name?name.trim():name)) ? 'not-allowed' : ''}`}>Xóa</Button>*/}
                    {/*}*/}
                    <Button disabled={value.companyId === ''} onClick={submit} variant={'contained'} color={"error"}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}