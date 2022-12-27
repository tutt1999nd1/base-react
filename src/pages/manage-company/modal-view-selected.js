import React, {useEffect, useState} from "react";

import ReactModal from 'react-modal-resizable-draggable';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {red} from "@mui/material/colors";
import {Divider} from "@mui/material";
import {changeVisibilityTableAll} from "../../constants/utils";
import {DataGrid, viVN} from "@mui/x-data-grid";

export default function ModalViewSelected(props) {
    const {openModalViewSelected, handleCloseModalViewSelected,columns,listResult} = props
    const [listResultConvert,setListResult] = useState([])
    useEffect(() => {
        // alert(name)
        let result =[];
        for(let i = 0; i < listResult.length; i++) {
            listResult[i].index = i+1;
            result.push(listResult[i]);
        }
        setListResult(result);
    }, [openModalViewSelected,columns])
    useEffect(()=>{

    },[])

    return (
        <ReactModal
            initWidth={1200}
            initHeight={600}
            onFocus={() => console.log("Modal is clicked")}
            className={"my-modal-custom-class"}
            onRequestClose={handleCloseModalViewSelected}
            isOpen={openModalViewSelected}>
            {/*<h3>My Modal</h3>*/}
            <div className={'modal-header-resize'}>
                <div className={'modal-header-resize-tittle'}>
                    Danh sách đã chọn
                </div>
                <IconButton
                    color="primary"
                    aria-label="close"
                    onClick={handleCloseModalViewSelected}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        zIndex:9999,
                    }}
                >
                    <CloseIcon  sx={{
                        color: "white !important",
                    }}
                    />
                </IconButton>
            </div>
            <Divider></Divider>
            <div className={'modal-body-resize main-content-body-result  '}>
                <DataGrid
                    // getRowHeight={() => 'auto'}
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    labelRowsPerPage={"Số kết quả"}
                    density="standard"
                    rows={listResultConvert}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    // loading={loading}
                    disableSelectionOnClick
                    sx={{
                        // boxShadow: 2,
                        overflowX: 'scroll',
                        border: 1,
                        borderColor: 'rgb(255, 255, 255)',
                        '& .MuiDataGrid-iconSeparator': {
                            display: 'none',
                        }
                    }}

                />
            </div>
        </ReactModal>
    )
}