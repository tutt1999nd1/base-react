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


export default function ModalAddCouncil(props) {
    const {openModalAddCouncil, handleCloseModalAddCouncil,companyId,setIsRefresh,isRefresh} = props
    const [value,setValue] = useState({companyId:companyId,memberId:'',position:'CT',memberName:''})
    const [listMember, setListMember] = useState([]);

    const submit = () => {
        handleCloseModalAddCouncil();
        addMemberCompanyApi({company_id:value.companyId,member_id:value.memberId,member_name:value.memberName,position:value.position,type:'HĐQT'}).then(r=>{
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
        setValue({companyId:companyId,memberId:'',position:'CT',memberName:''})
        // alert(name)

    }, [openModalAddCouncil])
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
            <Dialog open={openModalAddCouncil} onClose={handleCloseModalAddCouncil}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Thêm thành viên vào hội đồng quản trị
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalAddCouncil}
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
                                <MenuItem value={'CT'}>Chủ tịch</MenuItem>
                                <MenuItem value={'PCT'}>Phó chủ tịch</MenuItem>
                                <MenuItem value={'HĐQT'}>Hội đồng quản trị</MenuItem>
                            </Select>

                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" autoFocus onClick={handleCloseModalAddCouncil}>
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