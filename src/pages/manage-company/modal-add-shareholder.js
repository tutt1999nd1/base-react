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


export default function ModalAddShareholder(props) {
    const {openModalAddShareholder, handleCloseModalAddShareholder, companyId, setIsRefresh, isRefresh} = props
    const [value, setValue] = useState({companyId: companyId, memberId: '', position: 'CĐ', memberName: ''})
    const [listMember, setListMember] = useState([]);

    const submit = () => {
        handleCloseModalAddShareholder();
        addShareholderApi({company_id: value.companyId,member_name:value.memberName, member_id: value.memberId,position:value.position}).then(r => {
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
        setValue({companyId: companyId, memberId: '', memberName: '',position:"CĐ"})
        // alert(name)

    }, [openModalAddShareholder])
    useEffect(() => {
        getListMemberApi({paging: false}).then(r => {
            // console.log("r.data.companies",r.data);

            if (r.data.member_entities) {
                setListMember(convertToAutoComplete(r.data.member_entities, 'name'))

            } else {
                setListMember([])
            }

        }).catch(e => {

        })
    }, [])
    const handleChangePosition = (e) => {
        setValue({...value, position: e.target.value})
    }
    const getListMemberApi = (data) => {
        return apiManagerMember.getListMember(data);
    }
    const addShareholderApi = (data) => {
        return apiManagerCompany.addShareHolder(data);
    }
    return (
        <div>
            <Dialog open={openModalAddShareholder} onClose={handleCloseModalAddShareholder}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Thêm cổ đông
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalAddShareholder}
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
                <DialogContent style={{width: '450px', height: '150px'}} dividers className={"model-project"}>
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
                                <MenuItem value={'CTHĐQT'}>Chủ tịch hội đồng quản trị</MenuItem>
                                <MenuItem value={'PCTHĐQT'}>Phó chủ tịch hội đồng quản trị</MenuItem>
                                <MenuItem value={'CĐ'}>Cổ đông</MenuItem>
                            </Select>

                        </FormControl>
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" autoFocus onClick={handleCloseModalAddShareholder}>
                        Hủy
                    </Button>
                    <Button disabled={value.memberName === ''} onClick={submit} variant={'contained'}
                            color={"error"}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}