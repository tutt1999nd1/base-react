import React, {useEffect, useState} from "react";
import {
    Button,
    Divider,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import {useNavigate, useSearchParams} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {currencyFormatter} from "../../constants/utils";
import apiManagerSOF from "../../api/manage-sof";
import Axios from "axios";
import FileDownload from "js-file-download";
import {useSelector} from "react-redux";
import apiManagerChargingEst from "../../api/manage-charging-est";
import {DataGrid, GridColDef, viVN} from "@mui/x-data-grid";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function DetailSOF(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [listCharging, setListCharging] = useState([]);
    const [idDetail, setIdDetail] = useState(null)
    const [openModalDel, setOpenModalDel] = useState(false)
    const currentUser = useSelector(state => state.currentUser)
    const [listResult, setListResult] = React.useState({
        page: 0,
        pageSize: 10,
        rows: [
            // {
            //     id:1,
            //     asset_name:'2',
            //     asset_group_name:'111',
            //     asset_type_name:'111',
            //     initial_value:'111',
            //     capital_value:'111',
            //     current_credit_value:'111',
            //     max_capital_value:'111',
            //     status:'111',
            //     description:'Thông tin chứng khoán ngày hôm nay rất tệ'
            // }
        ],
        total: 0
    });
    const [info, setInfo] = useState({
        id: '',
        capital_company: {id: 0},
        capital_category: {id: 0},
        capital_campaign: {id: 0},
        supplier: {id: 0},
        lending_amount: null,
        owner_full_name: null,
        owner_user_id: null,
        lending_start_date: null,
        status: null,
        lending_in_month: null,
        interest_period: null,
        interest_rate: null,
        grace_principal_in_month: null,
        grace_interest_in_month: null,
        interest_rate_type: null,
        reference_interest_rate: null,
        interest_rate_rage: null,
        list_attachments: []
    })
    const handleCloseModalDel = () => {
        setOpenModalDel(false)
    }
    const backList = () => {
        navigate('/sof')
    }
    useEffect(() => {
        if (idDetail) {
            getListSOFApi({id: idDetail, page_size: 1}).then(r => {
                setInfo(r.data.source_of_funds[0])
                console.log(r.data.source_of_funds[0])
            }).catch(e => {

            })
            getListChargingEstApi({
                'paging': false,
                // 'charging_date_from':moment(timeSearch.start).format('DD-MM-YYYY'),
                // 'charging_date_to':moment(timeSearch.end).format('DD-MM-YYYY'),
                // 'company_name': nameSearch === '' ? null : nameSearch,
                // 'contact_detail': contactSearch === 0 ? null : contactSearch,
                // 'tax_number': taxSearch === 0 ? null : taxSearch,
                'sof_id': idDetail,
            }).then(r => {
                // setLoading(false)
                console.log("r", r)
                let arr;
                if(r.data.sof_charging_ests){
                    arr = convertArr(r.data.sof_charging_ests)
                }
                else arr = []
                setListResult({...listResult, rows: (arr), total: r.data.page.total_elements});
            }).catch(e => {
                // setLoading(false)
                console.log(e)
            })
        }
    }, [idDetail])
    const convertArr = (arr) => {

        let listConvert = [];
        for (let i = 0; i < arr.length; i++) {
            let key = arr[i].company.company_name+arr[i].charging_date;
            if (listConvert.filter(e => e.key === key).length === 0) {
                listConvert.push({
                    key: key,
                    chargingDate:arr[i].charging_date ,
                    companyName:arr[i].company.company_name,
                    sof: [arr[i]],
                    total:arr[i].charging_amount
                })
            } else
                for (let j = 0; j < listConvert.length; j++) {
                    if (listConvert[j].key === key) {
                        listConvert[j].sof.push(arr[i]);
                        listConvert[j].total = listConvert[j].total+arr[i].charging_amount;
                    }

                }
        }
        console.log("listConvert", listConvert)
        for (let i = 0; i < listConvert.length; i++) {
            listConvert[i].total = currencyFormatter(listConvert[i].total);
            for (let j = 0; j < listConvert[i].sof.length; j++) {
                listConvert[i].sof[j].principal = currencyFormatter(listConvert[i].sof[j].principal)
                listConvert[i].sof[j].charging_amount = currencyFormatter(listConvert[i].sof[j].charging_amount)
                listConvert[i].sof[j].charging_type = listConvert[i].sof[j].charging_type==='INTEREST'?'Tiền lãi':listConvert[i].sof[j].charging_type==='PRINCIPAL'?'Tiền gốc':'Tiền lãi ân hạn';
            }
        }
        return listConvert;
    }
    useEffect(() => {
        if (location.get('id')) {
            setIdDetail(location.get('id'));
        } else navigate('/sof')

    }, [location])
    const submitDelete = () => {
        // alert("tutt20")
        deleteSOFApi(info.id).then(r => {
            toast.success('Xóa thành công', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                navigate(`/sof`)
            }, 1050);

        }).catch(e => {
            toast.error('Có lỗi xảy ra', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        })

    }
    const getListSOFApi = (data) => {
        return apiManagerSOF.getListSOF(data);
    }


    const update = () => {
        navigate(`/sof/update?id=${idDetail}`)
    }
    const getListChargingEstApi = (data) => {
        // setLoading(true)
        return apiManagerChargingEst.getListChargingEst(data);
    }
    const deleteSOFBtn = () => {
        setOpenModalDel(true)
    }
    const deleteSOFApi = (id) => {
        return apiManagerSOF.deleteSOF(id);
    }

    const downloadFile = (url) => {
        Axios.get(url, {
            headers: {'Authorization': `Bearer ${currentUser.token}`},
            responseType: 'blob'
        }).then(response => {
            let nameFile = response.headers['content-disposition'].split(`"`)[1]
            FileDownload(response.data, nameFile);
        }).catch(e => {
        })
    }

    return (
        <div className={'main-content main-content-detail'}>
            {/*<div className={`loading ${false ? '' : ''}`}>*/}
            {/*    /!*<div className={`loading    `}>*!/*/}
            {/*    <ClipLoader*/}
            {/*        color={'#1d78d3'} size={50} css={css`color: #1d78d3`} />*/}
            {/*</div>*/}
            <ModalConfirmDel name={info.id + ""} openModalDel={openModalDel}
                             handleCloseModalDel={handleCloseModalDel} submitDelete={submitDelete}></ModalConfirmDel>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Button onClick={backList} style={{marginBottom: '10px'}} variant="text"
                    startIcon={<KeyboardBackspaceIcon/>}>Nguồn vốn</Button>

            <div className={'main-content-header'}>
                <div className={'row'} style={{justifyContent: 'space-between'}}>
                    <Typography variant="h5" className={'main-content-tittle'}>
                        {info.id}
                    </Typography>
                    <Button onClick={update} style={{marginBottom: '10px'}} variant="outlined"
                            startIcon={<BorderColorOutlinedIcon/>}>Cập nhật</Button>

                </div>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Thông tin chi tiết</h4>
                </div>
                <Divider light/>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        ID
                    </div>
                    <div className={'text-info-content'}>
                        {info.id}
                    </div>
                </div>
                <Divider></Divider>

                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Công ty vay
                    </div>
                    <div className={'text-info-content'}>
                        {info.capital_company.company_name}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Đối tượng cung cấp vốn
                    </div>
                    <div className={'text-info-content'}>
                        {info.supplier.supplier_name}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>Hạng mục</div>
                    <div className={'text-info-content'}>
                        {info.capital_category.category_name}

                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Mục đích vay
                    </div>
                    <div className={'text-info-content'}>
                        {info.capital_campaign.campaign_name}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Trạng thái
                    </div>
                    <div className={'text-info-content'}>
                        {info.status == 'UNPAID' ? 'Chưa tất toán' : info.status == 'PAID' ? 'Đã tất toán' : info.status === 'A_PART_PRINCIPAL_OFF' ? 'Off 1 phần gốc' : 'Đã off gốc, chưa trả lã'}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>Số tiền vay</div>
                    <div className={'text-info-content'}>
                        {currencyFormatter(info.lending_amount)}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Người quản lý
                    </div>
                    <div className={'text-info-content'}>
                        {info.owner_full_name}
                    </div>
                </div>
                {/*<div className={'row-detail'}>*/}
                {/*    <div className={'text-info-tittle'}>*/}
                {/*        Trạng thái*/}
                {/*    </div>*/}
                {/*    <div className={'text-info-content'}>*/}

                {/*    </div>*/}
                {/*</div>*/}
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Ngày vay
                    </div>
                    <div className={'text-info-content'}>
                        {info.lending_start_date}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Thời gian vay
                    </div>
                    <div className={'text-info-content'}>
                        {info.lending_in_month}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>Số kỳ trả gốc</div>
                    <div className={'text-info-content'}>
                        {info.principal_period}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Số kỳ trả lãi
                    </div>
                    <div className={'text-info-content'}>
                        {info.interest_period}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Lãi suất hợp đồng vay
                    </div>
                    <div className={'text-info-content'}>
                        {info.interest_rate}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>Thời gian ân hạn gốc</div>
                    <div className={'text-info-content'}>
                        {info.grace_principal_in_month}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Thời gian ân hạn lãi
                    </div>
                    <div className={'text-info-content'}>
                        {info.grace_interest_in_month}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Loại lãi suất
                    </div>
                    <div className={'text-info-content'}>
                        {info.interest_rate_type}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>Lãi suất tham chiếu</div>
                    <div className={'text-info-content'}>
                        {info.reference_interest_rate}
                    </div>
                </div>
                <Divider></Divider>
                <div className={'row-detail'}>
                    <div className={'text-info-tittle'}>
                        Biên độ lãi suất
                    </div>
                    <div className={'text-info-content'}>
                        {info.interest_rate_rage}
                    </div>
                </div>
                <Divider></Divider>


            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Tính lãi</h4>
                </div>
                <Divider light/>
                <div style={{height: '500px', width: '100%'}}>
                    <TableContainer  style={{height:'100%', width: '100%',overflow:"auto"}}>
                        {/*<div style={{height: '100%', width: '100%'}}>*/}
                        <Table stickyHeader  className={"table-custom"}>
                            <TableHead >
                                <TableRow >
                                    <TableCell align="center">Ngày trả lãi</TableCell>
                                    <TableCell align="center">Công ty vay</TableCell>
                                    <TableCell align="center">Tổng phải trả(VNĐ)</TableCell>

                                    <TableCell align="center">Giá trị vay(VNĐ)</TableCell>
                                    {/*start_date*/}
                                    <TableCell align="center">Ngày vay</TableCell>
                                    {/*end_date*/}
                                    <TableCell align="center">Ngày trả gốc</TableCell>
                                    {/*nums_of_interest_day*/}
                                    <TableCell align="center">Ngày tính lãi</TableCell>
                                    {/*interest_rate*/}
                                    <TableCell align="center">Lãi xuất(%)</TableCell>
                                    {/*//charging_amount*/}
                                    <TableCell align="center">Số tiền phải trả(VNĐ)</TableCell>
                                    {/*charging_type*/}
                                    <TableCell align="center">Loại tiền lãi</TableCell>
                                    {/*interest_period*/}
                                    <TableCell align="center">Số kỳ trả lãi</TableCell>
                                    {/*principal_period*/}
                                    <TableCell align="center">Số kỳ trả gốc</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{overflowY:"auto"}}>
                                <div className={`message-table-empty ${listResult.rows.length===0?'':'hidden'}`}>Không có dữ liệu</div>
                                {listResult.rows.map(item => (
                                    <>
                                        <TableRow>
                                            <TableCell rowSpan={item.sof.length + 1}>
                                                {item.chargingDate}
                                            </TableCell>
                                            <TableCell rowSpan={item.sof.length + 1}>
                                                {item.companyName}
                                            </TableCell>
                                            <TableCell rowSpan={item.sof.length + 1}>
                                                <div className={'error-message'}>
                                                    {item.total}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {item.sof.map(detail => (
                                            <TableRow>
                                                <TableCell><div >{detail.principal}</div></TableCell>
                                                <TableCell>{detail.start_date}</TableCell>
                                                <TableCell>{detail.end_date}</TableCell>
                                                <TableCell>{detail.nums_of_interest_day}</TableCell>
                                                <TableCell>{detail.interest_rate}</TableCell>
                                                <TableCell><div className={'error-message'}>
                                                    {detail.charging_amount}
                                                </div>
                                                </TableCell>
                                                <TableCell>{detail.charging_type}</TableCell>
                                                <TableCell>{detail.interest_period}</TableCell>
                                                <TableCell>{detail.principal_period}</TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                        {/*<TablePagination*/}
                        {/*    rowsPerPageOptions={[5, 10, 25]}*/}
                        {/*    component="div"*/}
                        {/*    count={listResult.total}*/}
                        {/*    rowsPerPage={listResult.pageSize}*/}
                        {/*    page={listResult.page}*/}
                        {/*    onPageChange={(page) => setListResult((prev) => ({...prev, page}))}*/}
                        {/*    onPageChange={handleChangePage}*/}
                        {/*    onRowsPerPageChange={handleChangeRowsPerPage}*/}
                        {/*/>*/}
                    </TableContainer>
                </div>
                <Divider></Divider>
            </div>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Tài liệu đính kèm</h4>
                </div>
                <Divider light/>
                {
                    info.list_attachments.map((e, i) => (
                        <div style={{cursor: "pointer"}} className={'row-detail'}
                             onClick={() => downloadFile(e.download_link)}>
                            <div className={'text-info-content text-decoration'}>
                                {e.file_name || e.download_link}
                            </div>
                        </div>
                    ))
                }

                <Divider></Divider>


            </div>

            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>Quản lý</h4>
                </div>
                <Divider light/>
                <div style={{padding: '20px'}}>
                    <Button onClick={deleteSOFBtn} color={'error'} style={{marginBottom: '10px'}} variant="outlined">Xóa
                        dữ liệu</Button>
                    <div className={'text-info-content'}>
                        Thao tác này sẽ xóa toàn bộ dữ liệu của bản ghi
                    </div>
                </div>

            </div>

        </div>
    )
}
