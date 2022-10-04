import {Box, Divider, Grid} from "@mui/material";
import React, {useState} from "react";
import ReactECharts from 'echarts-for-react';
import BarChartIcon from '@mui/icons-material/BarChart';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
export default function Dashboard() {
    const [type,setType] = useState(true);
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
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                // name: 'Access From',
                type: 'pie',
                radius: '75%',
                data: [
                    { value: 1000, name: 'Cho vay' },
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
        <Box>
            <Grid container spacing={4} style={{padding:'20px'}} >
                <Grid item xs={6} md={6}>
                    <div className={'widget'}>
                        <div className={'widget-tittle'}>
                            Tài sản
                        </div>
                        <Divider light/>
                        <div className={'widget-content'}>
                            <div className={'type-bar'}>
                                <BarChartIcon className={'icon'} onClick={()=>{setType(!type)}}></BarChartIcon>
                                <DonutLargeIcon className={'icon'} onClick={()=>{setType(!type)}}></DonutLargeIcon>
                            </div>
                            {/*<ReactECharts  />*/}
                            <ReactECharts  notMerge={true} option={type?options:option_pie} />
                        </div>
                    </div>

                </Grid>
                <Grid item xs={6} md={6}>
                    <div className={'widget'}>
                        <div className={'widget-tittle'}>
                            Tài sản
                        </div>
                        <Divider light/>
                    </div>

                </Grid>
                <Grid item xs={6} md={6}>
                    <div className={'widget'}>
                        <div className={'widget-tittle'}>
                            Tài sản
                        </div>
                        <Divider light/>
                    </div>

                </Grid>

            </Grid>



        </Box>
    )
}