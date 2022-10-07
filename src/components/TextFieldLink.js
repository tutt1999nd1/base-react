import React, {useEffect, useState} from "react";
import {InputAdornment, TextField} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function TextFieldLink(props) {
    const {item,index,changeValue,deleteValueLink, updateValue, deleteValue,disable} = props
    useEffect(()=>{
    },[props])
    const handleChane = (e) => {
        changeValue(e.target.value,index)
    }
    const handleDelete = () => {
        deleteValueLink(index,item)
    }
    return (
        <div className={'text-field-link'}>
            <TextField

                disabled={disable}
                value={item.download_link}
                size={"small"}
                className={'formik-input'}
                onChange={handleChane}
                // variant="standard"
                InputProps={{
                    endAdornment: (
                        <InputAdornment >
                            <DeleteOutlineIcon   style={{cursor: "pointer"}}                 onClick={handleDelete}

                                                 color={"error"} />
                        </InputAdornment>
                    ),
                }}
            />
            {/*<div className={'delete-file'}><DeleteOutlineIcon*/}
            {/*    style={{cursor: "pointer"}}*/}
            {/*    color={"error"}*/}
            {/*    onClick={handleDelete}*/}
            {/*    // onClick={() => {*/}
            {/*    //     deleteFileLocal(e.name)*/}
            {/*    // }}*/}
            {/*></DeleteOutlineIcon></div>*/}
        </div>

    );
};

