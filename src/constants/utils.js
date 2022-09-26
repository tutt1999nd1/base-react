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


export const currencyFormatter = (value) => {
    const options = {
        significantDigits: 1,
        thousandsSeparator: '.',
        decimalSeparator: ',',
        symbol: 'VNĐ'
    }
    if (typeof value !== 'number') value = 0.0
    value = value.toFixed(options.significantDigits)

    const [currency, decimal] = value.split('.')
    return ` ${currency.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        options.thousandsSeparator
    )}${options.decimalSeparator}${decimal} ${options.symbol}`
}
export default Utils;
