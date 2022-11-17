import { getText } from 'number-to-text-vietnamese';
import {Box, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material";
const Utils= {
    localizedTextsMap :{
        columnMenuHideColumn: "Ẩn",
        columnMenuShowColumns: "Hiện",
        noRowsLabel:"Không có kết quả",
        toolbarColumns:"Cột",
        toolbarDensity: 'Khoảng cách',
        toolbarDensityLabel: 'Khoảng cách',
        toolbarDensityCompact: 'Nhỏ',
        toolbarDensityStandard: 'Tiêu chuẩn',
        toolbarDensityComfortable: 'Rộng',
        MuiTablePagination: {
            labelDisplayedRows: ({ from, to, count }) =>
                `${from} - ${to} của ${count}`,
        },
        footerTotalRows: 'Total Rows:',
    },
};

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);

}
export const VNnum2words = (e) => {
        if(e<999999999999999)
            return getText(e)
    else return ''
}
export const currencyFormatter = (value) => {
    const options = {
        significantDigits: 1,
        thousandsSeparator: '.',
        decimalSeparator: ',',
        symbol: ''
    }
    if (typeof value !== 'number') value = 0.0
    value = value.toFixed(options.significantDigits)

    const [currency, decimal] = value.split('.')
    return `${currency.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        options.thousandsSeparator
    )}`
    // )}${options.decimalSeparator}${decimal} ${options.symbol}`
}
 export const convertToAutoComplete = (arr,name) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].label=arr[i][name];
    }
    return arr;
}
export const convertToTreeTable = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if(arr[i].childs.length==0){
            delete arr[i].childs;
        }
        else convertToTreeTable(arr[i].childs)
    }
    return arr;

}
export const convertToAutoCompleteMail = (arr,name) => {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
        if(arr[i][name]){
            newArr.push({
                id:arr[i][name],
                label:arr[i][name]
            })
        }

    }
    return newArr;
}
export const listOptionMonth = [
    {id:6,label:'6'},
    {id:12,label:'12'},
    {id:24,label:'24'},
    {id:36,label:'36'},
    {id:120,label:'120'},


]
export const convertToPieChart = (arr,name) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].name=arr[i][name];
        arr[i].value= Math.round(arr[i].total_value/1000000000 * 100) / 100;    }
    return arr;
}
export const sum = function (arr,prop) {
    var total = 0
    for ( var i = 0, _len = arr.length; i < _len; i++ ) {
        total += arr[i][prop]
    }
    return total
}
export const pending = function () {
    alert("Tính năng đang phát triển")
}

export const convertToBarChart = (arr,name) => {
    let listValue = [];
    let listName =[]
    for (let i = 0; i < arr.length; i++) {
        listName.push(arr[i][name]);
        listValue.push(Math.round(arr[i].total_value/1000000000 * 100) / 100)
    }
    return {listName:listName,listValue:listValue};
}
export const convertTo = () => {

}
export default Utils;
export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
export function checkColumnVisibility(table,column) {
    let tableVisibility = JSON.parse(localStorage.getItem('tableVisibility'))||{};

    if(tableVisibility[table]){
        return tableVisibility[table].includes(column)
    }
    return false
}
export function changeVisibilityTable(table,column,hide) {
    let tableVisibility = JSON.parse(localStorage.getItem('tableVisibility'))||{};
    if (hide){
        tableVisibility[table].push(column);
    }
    else {
        tableVisibility[table] = tableVisibility[table].filter(e => e !== column);
    }
    localStorage.setItem('tableVisibility',JSON.stringify(tableVisibility))

}
export function typeToName(type) {
    let object = {
        'TGĐ':'Tổng giám đốc',
        'PTGĐ':'Phó tổng giám đốc',
        'KTT':'Kế toán trưởng',
        'CTHĐQT':'Chủ tịch hội đồng quản trị',
        'CĐ':'Cổ đông',
        'PCTHĐQT':'Phó chủ tịch hội đồng quản trị',
        'CT':'Chủ tịch',
        'PCT':'Phó chủ tịch',
        'HĐQT':'Hội đồng quản trị',
        'lend':'Vay thêm',
        'pay':'Trả gốc'
    }
    return object[type]||'';
}
export function changeVisibilityTableAll(table,event) {
    let tableVisibility = JSON.parse(localStorage.getItem('tableVisibility'))||{};
    if(!tableVisibility[table])tableVisibility[table]=[];
    for ( let variable in event){
        if(event[variable] ===true){
            if(tableVisibility[table].includes(variable)){
                tableVisibility[table] = tableVisibility[table].filter(e => e !== variable);
            }
        }
        else {
            if(!tableVisibility[table].includes(variable)){
                tableVisibility[table].push(variable);
            }
        }
    }
    localStorage.setItem('tableVisibility',JSON.stringify(tableVisibility))
}
export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
