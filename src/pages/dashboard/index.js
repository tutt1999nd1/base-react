import {Box, css, Divider, Grid, Tab, Tabs, Tooltip} from "@mui/material";
import React, {useEffect, useState} from "react";
import ReactECharts from 'echarts-for-react';
import BarChartIcon from '@mui/icons-material/BarChart';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import {
    a11yProps,
    convertToBarChart,
    convertToPieChart,
    convertToTreeTable,
    currencyFormatter,
    sum,
    TabPanel
} from "../../constants/utils";
import apiManagerAssets from "../../api/manage-assets";
import {useSelector} from "react-redux";
import apiManagerSOF from "../../api/manage-sof";
import { TreeTable, TreeState } from 'cp-react-tree-table';
import { Table } from 'antd';
import {ClipLoader} from "react-spinners";
const MOCK_DATA = [
        {
            data: { name: 'Company I', expenses: '105,000', employees: '22', contact: 'Makenzie Higgs' },
            childs: [
                {
                    data: { name: 'Department 1', expenses: '75,000', employees: '18', contact: 'Florence Carter' },
                },
            ]
        },
    {
        data: { name: 'Company 2', expenses: '105,000', employees: '22', contact: 'Makenzie Higgs' },
        childs: [
            {
                data: { name: 'Department 1', expenses: '75,000', employees: '18', contact: 'Florence Carter' },
            },
        ]
    },
];
export default function Dashboard() {
    const [treeValue,setTreeValue] = useState(TreeState.create(MOCK_DATA));
    const currentUser = useSelector(state => state.currentUser)
    const [listAsset,setListAsset] = useState([])
    const [listSOF,setListSOF] = useState([])
    const [tab, setTab] = React.useState(0);
    const [keyUpdateAsset,setKeyUpdateAsset] = useState(Math.random);
    const [keyUpdateSOF,setKeyUpdateSOF] = useState(Math.random);
    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };
    const [typeChartAsset,setTypeChartAsset] = useState('pie');
    const [typeChartSOF,setTypeChartSOF] = useState('category');
    const [optionPieAsset,setOptionPieAsset]=useState( {
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
            left: 0,
        },
        series: [
            {
                label: {
                    formatter: '{b}: {@[' + 'T???' + ']} T???({d}%)'
                },
                encode: {
                    value: '11',
                    tooltip: '11'
                },
                type: 'pie',
                radius: '75%',
                data: [

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
    })
    const [optionBarAsset,setOptionBarAsset]= useState({
        // legend: {
        //     data: ['Cho vay', 'D??? ??n', '?????u t?? t??i ch??nh','T??i s???n b???t ?????ng s???n']
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
            data: [],
            axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {
            name: 'Ti???n (T??? VN??)',
            type: 'value',
            // axisLabel: {
            //     formatter: '{value} Tr VN??'
            // }
        },
        series: [
            {
                data: [],
                type: 'bar',
                smooth: true,
            },
        ]
        ,
        tooltip: {
            trigger: 'axis',
        },
    })
    const [optionPieSOF,setOptionPieSOF]=useState( {
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
            left: 0,
        },
        series: [
            {
                label: {
                    formatter: '{b}: {@[' + 'T???' + ']} T???({d}%)'
                },
                encode: {
                    value: '11',
                    tooltip: '11'
                },
                type: 'pie',
                radius: '75%',
                data: [

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
    })
    const [optionBarSOF,setOptionBarSOF]= useState({
        // legend: {
        //     data: ['Cho vay', 'D??? ??n', '?????u t?? t??i ch??nh','T??i s???n b???t ?????ng s???n']
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
            data: [],
            axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {
            name: 'Ti???n (T??? VN??)',
            type: 'value',
            // axisLabel: {
            //     formatter: '{value} Tr VN??'
            // }
        },
        series: [
            {
                data: [],
                type: 'bar',
                smooth: true,
            },
        ]
        ,
        tooltip: {
            trigger: 'axis',
        },
    })
    useEffect(()=>{
        if(currentUser.token){
            getListAssetApi().then(r=>{
                let arr = convertToTreeTable(r.data.asset_aggregates)
                setListAsset(arr)
            })
            getListSOFApi().then(r=>{
                let arr = convertToTreeTable(r.data.sof_aggregates)
                setListSOF(arr)
            })
        }

    },[currentUser.token])
    useEffect(()=>{
        //assets
        let arrPieChart = convertToPieChart(listAsset,'group_name')
        let assetBar = convertToBarChart(listAsset,'group_name')
        let option_pieAsset_copy = {...optionPieAsset};
        option_pieAsset_copy.series[0].data = arrPieChart;
        setOptionPieAsset(option_pieAsset_copy)

        let optionBarAssetCopy = {...optionBarAsset};
        console.log("assetBar",assetBar)
        optionBarAssetCopy.series[0].data = assetBar.listValue;
        optionBarAssetCopy.xAxis.data = assetBar.listName;
        setOptionBarAsset(optionBarAssetCopy)

        //sof

        let arrPieChartSOF = convertToPieChart(listSOF,'category_name')
        let sofBar = convertToBarChart(listSOF,'category_name')
        let optionPieSOFCopy = {...optionPieSOF};
        optionPieSOFCopy.series[0].data = arrPieChartSOF;
        setOptionPieSOF(optionPieSOFCopy)

        let optionBarSOFCopy = {...optionBarSOF};
        console.log("assetBar",assetBar)
        optionBarSOFCopy.series[0].data = sofBar.listValue;
        optionBarSOFCopy.xAxis.data = sofBar.listName;
        setOptionBarSOF(optionBarSOFCopy)
        if(listAsset.length>0){
            setKeyUpdateAsset(Math.random)
        }
        if(listSOF.length>0){
            setKeyUpdateSOF(Math.random)
        }
    },[listAsset,listSOF,currentUser.token])

    const getListAssetApi = () => {
      return apiManagerAssets.getListAssetDashboard();
    }
    const getListSOFApi = () => {
      return apiManagerSOF.getListSOFDashboard();
    }

    const columnsAsset = [
        {
            title: 'Nh??m t??i s???n',
            dataIndex: 'group_name',
            key: 'group_name',
        },

        {
            title: 'Gi?? tr??? (VN??)',
            dataIndex: 'total_value',
            width: '30%',
            key: 'total_value',
            render: text => <div>{currencyFormatter(text)}</div>,
        },
    ];
    const columnsSOF = [
        {
            title: 'Kho???n m???c',
            dataIndex: 'category_name',
            key: 'category_name',
        },

        {
            title: 'Gi?? tr??? (VN??)',
            dataIndex: 'total_value',
            width: '30%',
            key: 'total_value',
            render: text => <div>{currencyFormatter(text)}</div>,
        },
    ];



    return(
        <Box sx={{ width: '100%',height:"100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                    <Tab className={"dashboardTab"} label="Dashboard" {...a11yProps(0)} />
                    <Tab className={"dashboardTab d-none"} label="????? ??u ti??n" {...a11yProps(1)} />
                    {/*<Tab label="Item Three" {...a11yProps(2)} />*/}
                </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
                <Box>
                    <Grid container spacing={4} style={{padding:'20px'}} >

                        <Grid item xs={12} md={6}>
                            <div className={'widget'}>
                                <div className={'widget-tittle'}>
                                    <h4>T??i s???n</h4>
                                </div>
                                <Divider light/>
                                <div key={keyUpdateAsset}  className={'widget-content'}>
                                    <div className={'type-bar'}>
                                        <Tooltip title={'????? th??? thanh'}>
                                            <BarChartIcon color={`${typeChartAsset==='category'?'primary':''}`} className={'icon'} onClick={()=>{setTypeChartAsset('category')}}></BarChartIcon>
                                        </Tooltip>
                                        <Tooltip title={'????? th??? tr??n'}>
                                            <DonutLargeIcon color={`${typeChartAsset==='pie'?'primary':''}`} className={'icon'} onClick={()=>{setTypeChartAsset('pie')}}></DonutLargeIcon>
                                        </Tooltip>
                                    </div>
                                    {/*<ReactECharts  />*/}
                                    <ReactECharts style={{width:'100%',height:'400px'}}   notMerge={true} option={typeChartAsset==='category'?optionBarAsset:optionPieAsset} />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className={'widget'}>
                                <div className={'widget-tittle'}>
                                    <h4>Ngu???n v???n</h4>
                                </div>
                                <Divider light/>
                                <div key={keyUpdateSOF}  className={'widget-content'}>
                                    <div className={'type-bar'}>
                                        <Tooltip title={'????? th??? thanh'}>
                                            <BarChartIcon color={`${typeChartSOF==='category'?'primary':''}`} className={'icon'} onClick={()=>{setTypeChartSOF('category')}}></BarChartIcon>
                                        </Tooltip>
                                        <Tooltip title={'????? th??? tr??n'}>
                                            <DonutLargeIcon color={`${typeChartSOF==='pie'?'primary':''}`} className={'icon'} onClick={()=>{setTypeChartSOF('pie')}}></DonutLargeIcon>
                                        </Tooltip>
                                    </div>
                                    {/*<ReactECharts  />*/}
                                    <ReactECharts style={{width:'100%',height:'400px'}}   notMerge={true} option={typeChartSOF==='category'?optionBarSOF:optionPieSOF} />
                                </div>
                            </div>
                        </Grid>

                        <Grid item xs={6} md={12}>
                            <div className={'widget'}>
                                <div className={'widget-tittle'}>
                                    <h4>Th???ng k??</h4>
                                </div>
                                <Divider light/>
                                <div className={'widget-content'}>
                                    <div className={'list-table'}>
                                        <div className={'wrapper-table'}>
                                            <div className={'tittle-table'}>
                                                T??i s???n:
                                            </div>
                                            <Table key={keyUpdateAsset} rowKey="id" columns={columnsAsset} dataSource={listAsset} pagination={false} expandable={{expandRowByClick:true,defaultExpandAllRows: true,childrenColumnName: "childs" }}
                                                    summary={pageData => {
                                                        return (
                                                            <>
                                                                <Table.Summary.Row>
                                                                    <Table.Summary.Cell><th style={{color:"#1F2251"}}>T???ng</th></Table.Summary.Cell>
                                                                    <Table.Summary.Cell>
                                                                        <th style={{color:"#1F2251"}}>{currencyFormatter(sum(listAsset,"total_value"))} </th>
                                                                    </Table.Summary.Cell>
                                                                </Table.Summary.Row>
                                                            </>
                                                        );
                                                    }}
                                            />

                                        </div>

                                        <div className={'wrapper-table'}>
                                            <div className={'tittle-table'}>
                                                Ngu???n v???n:
                                            </div>
                                            <Table key={keyUpdateAsset} rowKey="id" columns={columnsSOF} dataSource={listSOF} pagination={false} expandable={{expandRowByClick:true,defaultExpandAllRows: true,childrenColumnName: "childs" }}
                                                    summary={pageData => {
                                                        return (
                                                            <>
                                                                <Table.Summary.Row>
                                                                    <Table.Summary.Cell><th style={{color:"#1F2251"}}>T???ng</th></Table.Summary.Cell>
                                                                    <Table.Summary.Cell>
                                                                        <th style={{color:"#1F2251"}}>{currencyFormatter(sum(listSOF,"total_value"))} </th>
                                                                    </Table.Summary.Cell>
                                                                </Table.Summary.Row>
                                                            </>
                                                        );
                                                    }}
                                            />
                                        </div>
                                    </div>


                                </div>
                            </div>

                        </Grid>

                        {/*<Grid item xs={6} md={6}>*/}
                        {/*    <div className={'widget'}>*/}
                        {/*        <div className={'widget-tittle'}>*/}
                        {/*            <h4>Ngu???n v???n</h4>*/}
                        {/*        </div>*/}
                        {/*        <Divider light/>*/}
                        {/*        <div className={'widget-content'}>*/}
                        {/*            <div className={'type-bar'}>*/}
                        {/*                <Tooltip title={'????? th??? thanh'}>*/}
                        {/*                    <BarChartIcon color={`${typeChartSOF==='category'?'primary':''}`} className={'icon'} onClick={()=>{setTypeChartSOF('category')}}></BarChartIcon>*/}
                        {/*                </Tooltip>*/}
                        {/*                <Tooltip title={'????? th??? tr??n'}>*/}
                        {/*                    <DonutLargeIcon color={`${typeChartSOF==='pie'?'primary':''}`} className={'icon'} onClick={()=>{setTypeChartSOF('pie')}}></DonutLargeIcon>*/}
                        {/*                </Tooltip>*/}
                        {/*            </div>*/}
                        {/*            /!*<ReactECharts  />*!/*/}
                        {/*            <ReactECharts  notMerge={true} option={typeChartSOF==='category'?options:optionPieAsset} />*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Box>
            </TabPanel>
            <TabPanel value={tab} index={1}>
                ????? ??u ti??n
            </TabPanel>

        </Box>
    )
}