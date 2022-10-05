import {Box, Divider, Grid, Tab,Tabs, Tooltip} from "@mui/material";
import React, {useState} from "react";
import ReactECharts from 'echarts-for-react';
import BarChartIcon from '@mui/icons-material/BarChart';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import {a11yProps, TabPanel} from "../../constants/utils";
export default function Dashboard() {
    const [tab, setTab] = React.useState(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };
    const [typeChartAsset,setTypeChartAsset] = useState('pie');
    const [typeChartSOF,setTypeChartSOF] = useState('category');
    const options = {
        // legend: {
        //     data: ['Cho vay', 'Dự án', 'Đầu tư tài chính','Tài sản bất động sản']
        // },
        // title: {
        //     text: 'Referer of a Website',
        //     subtext: 'Fake Data',
        //     left: 'center'
        // },
        // grid: {top: 8, right: 8, bottom: 80, left: 50},
        xAxis: {
            triggerEvent: true,
            type: 'category',
            data: ['Cho vay', 'Dự án','Đầu tư tài chính', 'Tài sản bất động sản'],
            axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {
            name: 'Tiền (Triệu VNĐ)',
            type: 'value',
            // axisLabel: {
            //     formatter: '{value} Tr VNĐ'
            // }
        },
        series: [
            {
                data: [1000, 2000, 1700, 1300],
                type: 'bar',
                smooth: true,
            },
        ]
        ,
        tooltip: {
            trigger: 'axis',
        },
    };
    const option_pie = {
        // title: {
        //     text: 'Referer of a Website',
        //     subtext: 'Fake Data',
        //     left: 'center'
        // },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            bottom: 0,
        },
        series: [
            {
                // name: 'Access From',]
                label: {
                    formatter: '{b}: {@[' + '1' + ']} ({d}%)'
                },
                encode: {
                    value: '11',
                    tooltip: '11'
                },
                type: 'pie',
                radius: '75%',
                data: [
                    { value: 10020, name: 'Cho vay' },
                    { value: 2000, name: 'Dự án' },
                    { value: 1700, name: 'Đầu tư tài chính' },
                    { value: 1300, name: 'Tài sản bất động sản' },
                    // { value: 300, name: 'Video Ads' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    return(
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                    <Tab label="Dashboard" {...a11yProps(0)} />
                    <Tab label="Độ ưu tiên" {...a11yProps(1)} />
                    {/*<Tab label="Item Three" {...a11yProps(2)} />*/}
                </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
                <Box>
                    <Grid container spacing={4} style={{padding:'20px'}} >
                        <Grid item xs={6} md={12}>
                            <div className={'widget'}>
                                <div className={'widget-tittle'}>
                                    <h4>Thống kê</h4>
                                </div>
                                <Divider light/>
                                <div className={'widget-content'}>
                                    <div className={'list-table'}>
                                        <div className={'wrapper-table'}>
                                            <div className={'tittle-table'}>
                                                Tài sản:
                                            </div>
                                            <table>
                                                <tr>
                                                    <th>Khoản mục</th>
                                                    <th>Giá trị (VNĐ)</th>
                                                </tr>
                                                <tr>
                                                    <td>Dự án</td>
                                                    <td>2000</td>
                                                </tr>
                                                <tr>
                                                    <td>Cho vay</td>
                                                    <td>1000</td>
                                                </tr>
                                                <tr>
                                                    <td>Đầu tư tài chính</td>
                                                    <td>1700</td>
                                                </tr>
                                                <tr>
                                                    <td>Tài sản bất động sản</td>
                                                    <td>1300</td>
                                                </tr>
                                                <tr className={'row-total'}>
                                                    <th>Tổng</th>
                                                    <th>100000</th>
                                                </tr>
                                            </table>

                                        </div>
                                        <div className={'wrapper-table'}>
                                            <div className={'tittle-table'}>
                                                Nguồn vốn:
                                            </div>
                                            <table>
                                                <tr>
                                                    <th>Khoản mục</th>
                                                    <th>Giá trị (VNĐ)</th>
                                                </tr>
                                                <tr>
                                                    <td>Tín dụng</td>
                                                    <td>2000</td>
                                                </tr>
                                                <tr>
                                                    <td>Trái phiếu</td>
                                                    <td>1000</td>
                                                </tr>
                                                <tr>
                                                    <td>Bán cổ phần</td>
                                                    <td>1700</td>
                                                </tr>
                                                <tr>
                                                    <td>Nợ khác</td>
                                                    <td>1300</td>
                                                </tr>
                                                <tr className={'row-total'}>
                                                    <th>Tổng</th>
                                                    <th>100000</th>
                                                </tr>
                                            </table>

                                        </div>
                                    </div>


                                </div>
                            </div>

                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className={'widget'}>
                                <div className={'widget-tittle'}>
                                    <h4>Tài sản</h4>
                                </div>
                                <Divider light/>
                                <div className={'widget-content'}>
                                    <div className={'type-bar'}>
                                        <Tooltip title={'Đồ thị thanh'}>
                                            <BarChartIcon color={`${typeChartAsset==='category'?'primary':''}`} className={'icon'} onClick={()=>{setTypeChartAsset('category')}}></BarChartIcon>
                                        </Tooltip>
                                        <Tooltip title={'Đồ thị tròn'}>
                                            <DonutLargeIcon color={`${typeChartAsset==='pie'?'primary':''}`} className={'icon'} onClick={()=>{setTypeChartAsset('pie')}}></DonutLargeIcon>
                                        </Tooltip>
                                    </div>
                                    {/*<ReactECharts  />*/}
                                    <ReactECharts  notMerge={true} option={typeChartAsset==='category'?options:option_pie} />
                                </div>
                            </div>

                        </Grid>
                        <Grid item xs={6} md={6}>
                            <div className={'widget'}>
                                <div className={'widget-tittle'}>
                                    <h4>Nguồn vốn</h4>
                                </div>
                                <Divider light/>
                                <div className={'widget-content'}>
                                    <div className={'type-bar'}>
                                        <Tooltip title={'Đồ thị thanh'}>
                                            <BarChartIcon color={`${typeChartSOF==='category'?'primary':''}`} className={'icon'} onClick={()=>{setTypeChartSOF('category')}}></BarChartIcon>
                                        </Tooltip>
                                        <Tooltip title={'Đồ thị tròn'}>
                                            <DonutLargeIcon color={`${typeChartSOF==='pie'?'primary':''}`} className={'icon'} onClick={()=>{setTypeChartSOF('pie')}}></DonutLargeIcon>
                                        </Tooltip>
                                    </div>
                                    {/*<ReactECharts  />*/}
                                    <ReactECharts  notMerge={true} option={typeChartSOF==='category'?options:option_pie} />
                                </div>
                            </div>

                        </Grid>
                    </Grid>
                </Box>
            </TabPanel>
            <TabPanel value={tab} index={1}>
                Độ ưu tiên
            </TabPanel>

        </Box>
    )
}