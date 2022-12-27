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


export default function ModalAddMember(props) {
    const {openModalAddMember, handleCloseModalAddMember,companyId,setIsRefresh,isRefresh} = props
    const [value,setValue] = useState({companyId:companyId,memberId:'',position:'TGĐ',memberName:''})
    const [listMember, setListMember] = useState([]);

    const submit = () => {
        handleCloseModalAddMember();
        addMemberCompanyApi({company_id:value.companyId,member_name:value.memberName,member_id:value.memberId,position:value.position,type:'TV'}).then(r=>{
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
        setValue({companyId:companyId,memberId:'',position:'TGĐ',memberName:''})
        // alert(name)

    }, [openModalAddMember])
    useEffect(()=>{
        getListMemberApi({paging: false}).then(r => {
            // console.log("r.data.companies",r.data);

            if (r.data.member_entities) {
                setListMember(convertToAutoComplete(r.data.member_entities, 'name'))

            } else {
                setListMember([])
            }

        }).catch(e => {

        })
    },[])
    const handleChangePosition = (e) => {
      setValue({...value,position: e.target.value})
    }
    const getListMemberApi = (data) => {
        return apiManagerMember.getListMember(data);
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
                        <div className={'label-input'}>Thành viên<span className={'error-message'}>*</span>
                        </div>
                        <Autocomplete
                            id="combo-box-demo"
                            options={listMember}
                            value={{
                                id: value.memberId,
                                label: value.memberName,
                            }
                            }
                            freeSolo
                            inputValue={value.memberName}

                            renderInput={(params) => < TextField  {...params} />}
                            size={"small"}
                            onInputChange={(event, newValue) => {
                                setValue({...value,memberId: "",memberName:newValue})
                            }
                            }
                            onChange={(event, newValue) => {
                                console.log("new_value", newValue)
                                if (newValue){
                                    setValue({...value,memberId: newValue.id,memberName:newValue.label})
                                }
                                else{
                                    setValue({...value,memberId: '',memberName:''})
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
                                <MenuItem value={'TGĐ'}>Tổng giám đốc</MenuItem>
                                <MenuItem value={'PTGĐ'}>Phó tổng giám đốc</MenuItem>
                                <MenuItem value={'KTT'}>Kế toán trưởng</MenuItem>
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
                    <Button disabled={value.memberName === ''} onClick={submit} variant={'contained'} color={"error"}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}