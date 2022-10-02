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
    return ` ${currency.replace(
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
export const convertTo = () => {

}
export default Utils;
