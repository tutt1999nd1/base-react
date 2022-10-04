import DialogContent from "@mui/material/DialogContent";
import {Button, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";


export default function ModalConfirmDel(props) {
    const {openModalDel, handleCloseModalDel, name, submitDelete} = props
    const [valueInput, setValueInput] = useState('');
    const handleChangeInput = (event) => {
        setValueInput(event.target.value);
    }
    const submit = () => {
        handleCloseModalDel();
        submitDelete();
        setValueInput('')
    }
    useEffect(() => {
        setValueInput('')
        // alert(name)

    }, [openModalDel])
    return (
        <div>
            <Dialog open={openModalDel} onClose={handleCloseModalDel}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Xác nhận xóa
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalDel}
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
                <DialogContent dividers className={"model-project"}>
                    <div className="form-input">
                        <div className="label confirm-delete-dataset">
                            <div>Để xác nhận xóa, vui lòng nhập lại thông tin sau</div>
                            <strong className={"text-bold"}>{name}</strong>
                        </div>
                        <TextField
                            // disabled={!isModalCreateMeeting}
                            fullWidth
                            autoFocus={true}
                            id="roomName"
                            name="roomName"
                            value={valueInput}
                            onChange={handleChangeInput}
                            size="small"
                            // placeholder={t('placeholder.enterInfor')}

                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" autoFocus onClick={handleCloseModalDel}>
                        Hủy
                    </Button>
                    {
                        !(valueInput == name) ?   <Button variant={'contained'} className={`vmp-btn ${!(valueInput == name) ? 'not-allowed' : ''}`}>Xóa</Button>
                        :
                            <Button  onClick={submit} variant={'contained'} className={`vmp-btn ${!(valueInput == name) ? 'not-allowed' : ''}`}>Xóa</Button>
                    }
                </DialogActions>
            </Dialog>
        </div>
    )
}