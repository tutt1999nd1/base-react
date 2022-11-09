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
    const [value, setValue] = useState({companyId: companyId, memberId: '', position: 'TGĐ', memberName: ''})
    const [listMember, setListMember] = useState([]);

    const submit = () => {
        handleCloseModalAddShareholder();
        addShareholderApi({company_id: value.companyId, member_id: value.memberId,position:value.position}).then(r => {
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
        setValue({companyId: companyId, memberId: '', memberName: ''})
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
                        <div className={'label-input'}>Nhân viên<span className={'error-message'}>*</span>
                        </div>
                        <Autocomplete
                            id="combo-box-demo"
                            options={listMember}
                            value={{
                                id: value.memberId,
                                label: value.memberName,
                            }
                            }

                            renderInput={(params) => < TextField  {...params} />}
                            size={"small"}
                            onChange={(event, newValue) => {
                                // setCompanySearch(newValue)
                                console.log("new_value", newValue)
                                if (newValue) {
                                    setValue({...value, memberId: newValue.id, memberName: newValue.label})
                                    // setFieldValue('capital_company_id', newValue.id)
                                    // setFieldValue('capital_campaign_name', newValue.label)
                                    // setIdCompanyCurrent(newValue.id)
                                } else {
                                    setValue({...value, memberId: '', memberName: ''})
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
                    <Button variant="outlined" autoFocus onClick={handleCloseModalAddShareholder}>
                        Hủy
                    </Button>
                    <Button disabled={value.memberId === ''} onClick={submit} variant={'contained'}
                            color={"error"}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}