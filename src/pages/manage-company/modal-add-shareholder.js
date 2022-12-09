import DialogContent from "@mui/material/DialogContent";
import {
    Autocomplete,
    Button,
    FormControl,
    FormHelperText,
    Grid, InputAdornment,
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
import {
    calculatePercent,
    capitalizeFirstLetter,
    convertToAutoComplete,
    currencyFormatter,
    VNnum2words
} from "../../constants/utils";
import apiManagerCompany from "../../api/manage-company";
import {toast} from "react-toastify";
import apiManagerMember from "../../api/manage-member";
import {NumericFormat} from "react-number-format";


export default function ModalAddShareholder(props) {
    const {infoShareholder,isAddShareholder,idUpdateShareholder,openModalAddShareholder, handleCloseModalAddShareholder, companyId, setIsRefresh, isRefresh,sumAmountShareholder} = props
    const [info, setInfo] = useState({
        companyId: companyId,
        memberId: '',
        position: 'CĐ',
        memberName: '',
        amountShare: 0
    })
    const [listMember, setListMember] = useState([]);

    const submit = () => {
        handleCloseModalAddShareholder();
        if(isAddShareholder){
            addShareholderApi({
                company_id: info.companyId,
                member_name: info.memberName,
                member_id: info.memberId,
                position: info.position,
                amount_share:info.amountShare
            }).then(r => {
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
        else {
            updateCompanyShareholderApi({
                id:idUpdateShareholder,
                company_id: info.companyId,
                member_name: info.memberName,
                member_id: info.memberId,
                position: info.position,
                amount_share:info.amountShare
            }).then(r => {
                toast.success('Cập nhật thành công', {
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

    }
    useEffect(() => {
        setInfo({companyId: companyId, memberId: '', memberName: '', position: "CĐ", amountShare: 0})
        // alert(name)

    }, [openModalAddShareholder])
    useEffect(() => {
        if(!isAddShareholder){
            console.log("infoShareholder",infoShareholder)
            setInfo({companyId: companyId, memberId: infoShareholder.member_id, memberName: infoShareholder.name, position: infoShareholder.position, amountShare: infoShareholder.amount_share})
        }
    },[infoShareholder,openModalAddShareholder  ])
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
        setInfo({...info, position: e.target.value})
    }
    const getListMemberApi = (data) => {
        return apiManagerMember.getListMember(data);
    }
    const addShareholderApi = (data) => {
        return apiManagerCompany.addShareHolder(data);
    }
    const updateCompanyShareholderApi = (data) => {
        return apiManagerCompany.updateCompanyShareholder(data);
    }
    return (
        <div>
            <Dialog open={openModalAddShareholder} onClose={handleCloseModalAddShareholder}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        {isAddShareholder?"Thêm cổ đông":"Cập nhật cổ đông"}
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalAddShareholder}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{width: '450px', height: '300px'}} dividers className={"model-project"}>
                    <div className="form-input">
                        <div className={'label-input'}>Thành viên<span className={'error-message'}>*</span>
                        </div>
                        <Autocomplete
                            id="combo-box-demo"
                            options={listMember}
                            value={{
                                id: info.memberId,
                                label: info.memberName,
                            }
                            }
                            freeSolo
                            inputValue={info.memberName}

                            renderInput={(params) => < TextField  {...params} />}
                            size={"small"}
                            onInputChange={(event, newValue) => {
                                setInfo({...info, memberId: "", memberName: newValue})
                            }
                            }
                            onChange={(event, newValue) => {
                                console.log("new_value", newValue)
                                if (newValue) {
                                    setInfo({...info, memberId: newValue.id, memberName: newValue.label})
                                } else {
                                    setInfo({...info, memberId: '', memberName: ''})
                                }
                            }}
                        />
                    </div>
                    <div className="form-input">
                        <div className={'label-input'}>Vị trí<span className={'error-message'}>*</span>
                        </div>
                        <FormControl fullWidth>
                            <Select
                                size={'small'}
                                labelId="asset_type_label"
                                value={info.position}
                                onChange={handleChangePosition}

                                // size='small'
                            >
                                <MenuItem value={'CTHĐQT'}>Chủ tịch hội đồng quản trị</MenuItem>
                                <MenuItem value={'PCTHĐQT'}>Phó chủ tịch hội đồng quản trị</MenuItem>
                                <MenuItem value={'CĐ'}>Cổ đông</MenuItem>
                            </Select>

                        </FormControl>
                    </div>
                    <div>
                        <div className={'label-input'}>Số lượng cổ phần/Vốn góp<span className={'error-message'}>*</span>
                        </div>
                        <NumericFormat
                            size={'small'}
                            customInput={TextField}
                            className={'formik-input text-right'}
                            thousandSeparator={"."}
                            decimalSeparator={","}
                            value={info.amountShare}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                            }}
                            onValueChange={(values) => {
                                const {formattedValue, value, floatValue} = values;
                                const re = /^[0-9\b]+$/;
                                if (re.test(floatValue) || floatValue === undefined) {
                                    setInfo({...info, amountShare: floatValue})
                                }
                            }}
                        />
                        <Typography className={'uppercase'} variant="caption" display="block"
                                    gutterBottom>
                            {info.amountShare ? `*Bằng chữ: ${capitalizeFirstLetter(VNnum2words(info.amountShare))} đồng` : ''}
                        </Typography>
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" autoFocus onClick={handleCloseModalAddShareholder}>
                        Hủy
                    </Button>
                    <Button disabled={info.memberName === '' || info.amountShare === 0 || info.amountShare === ''}
                            onClick={submit} variant={'contained'}
                            color={"error"}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}