import React from "react";
import {Button, Divider, InputAdornment, Paper, TextField, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import SearchIcon from '@mui/icons-material/Search';
import { useDemoData } from '@mui/x-data-grid-generator';
import {DataGrid} from "@mui/x-data-grid";

export default function ManageAssets() {
    const { data } = useDemoData({
        dataSet: 'Commodity',
        // rowLength: 20,
        // maxColumns: 5,
    });
    return (
        <div className={'main-content'}>
            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent:'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        Quản lý tài sản
                    </Typography>
                    <Button variant="outlined" startIcon={<AddIcon />}>
                        Thêm
                    </Button>
                </div>
                <div className={'row'} style={{marginTop:'20px'}}>
                    <Button variant="text" startIcon={<VerticalAlignTopIcon />}>Import</Button>
                    <Button style={{marginLeft:'10px'}} variant="text" startIcon={<VerticalAlignBottomIcon/>}>Export</Button>
                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Tìm kiếm</h4>
                </div>
                <Divider light />
                <div className={'main-content-body-search'}>
                    <TextField
                        // label="TextField"
                        placeholder={'Tìm kiếm'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        // variant="standard"
                    />
                </div>
                <Divider light />
                <div className={'main-content-body-result'}>
                    <div style={{ height: '100vh', width: '100%' }}>
                        <DataGrid
                            {...data}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}