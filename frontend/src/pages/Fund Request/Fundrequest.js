import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { Table } from 'antd';
//import dayjs from 'dayjs';
import '../../hide.css';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Table, Row, Col } from 'react-bootstrap';
//import Allfundrecord from './Allfundrecord';
import { Typography, FormGroup, Select, TextField, FormControl, MenuItem, styled, Button, TablePagination, FormLabel, Paper } from '@mui/material';
import Loading from "../../components/Loading";
import { toast } from 'react-toastify';
import { getallfundrequest } from '../../routes/api';
import getDateString from '../../utils/getdatestring';
import Popup from "../../components/Popup";
import FundApprovereject from './FundApprovereject';
const Fundrequest = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [pageTitle, setPageTitle] = useState('');
    const [modalWidth, setModalWidth] = useState();
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [dataPage, setDataPage] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [allfundContent, setallfundContent] = useState();
    const [spinner, setSpinner] = useState(false);
    const [fromdate, setFromDate] = useState('');
    const [todate, setToDate] = useState('');
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState(0);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    const openInPopupForUpdate = (item) => {
        setRecordForEdit(item);
        setOpenPopup(true);
        setPageTitle('Edit Fund Request Status');
        setModalWidth('500px');
    }
    const addOrEdit = (e) => {
        //alert(fromdate+'='+todate+'='+userId+'='+status)
        relodreport(e);
        setRecordForEdit(null);
        setOpenPopup(false);
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 2));
        setPage(0);
    };
    const relodreport = async () => {
        const postBody = {
            fromdate: fromdate,
            todate: todate,
            userId: userId,
            status: status
        }
        // alert(JSON.stringify(postBody));
        setSpinner(true)
        await getallfundrequest(postBody).then(response => {

            if (response.data.status === true) {
                setSpinner(false);
                setallfundContent(response.data.data);
            }
            else {
                setSpinner(false);
                toast.error(response.message.data, {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
        }).catch((error) => {
            setSpinner(false);
            console.log(error.message);
            /*  toast.error(error.message, {
                      position: "bottom-right",
                      hideProgressBar: false,
                      progress: undefined,
              });*/
        });
    }
    const fundlist = async () => {
        const postBody = {
            fromdate: fromdate,
            todate: todate,
            userId: userId,
            status: status
        }
        // alert(JSON.stringify(postBody));
        setSpinner(true)
        await getallfundrequest(postBody).then(response => {

            if (response.status === 200 || response.status === true) {
                setSpinner(false);
                setallfundContent(response.data.data);
            }
            else {
                setSpinner(false);
                toast.error(response.data, {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
        }).catch((error) => {
            setSpinner(false);
            console.log(error.message);
            /*  toast.error(error.message, {
                      position: "bottom-right",
                      hideProgressBar: false,
                      progress: undefined,
              });*/
        });
    }
    useEffect(() => {
        fundlist();
        setPage(0);
    }, [dataPage]);
    let allfundContents = [];
    const onSubmit = async (e) => {
        e.preventDefault();
        const postBody = {
            fromdate: fromdate,
            todate: todate,
            userId: userId,
            status: status
        }
        // alert(JSON.stringify(postBody));
        setSpinner(true)
        await getallfundrequest(postBody).then(response => {

            if (response.status === 200 || response.status === true) {
                setSpinner(false);
                setallfundContent(response.data.data);
            }
            else {
                setSpinner(false);
                toast.error(response.data, {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
        }).catch((error) => {
            setSpinner(false);
            console.log(error.message);
            /*  toast.error(error.message, {
                      position: "bottom-right",
                      hideProgressBar: false,
                      progress: undefined,
              });*/
        });

    }
    let listContent;
    let count = 0;
    for (let i in allfundContent) {
        allfundContents.push(allfundContent[i]);
    }
    count = allfundContents?.length;
    //alert(spinner)
    /*  if (spinner) {
          listContent = <tr><td colSpan='9'><h5>Loading...</h5></td></tr>
      }
      else {
          count = allfundContent?.length;
          //  alert(count)
          // listContent = allfundContents.map((funds) => (<Allfundrecord Allfundrecord={funds} />)) 
          allfundContent && allfundContent?.length > 0 ?
              (listContent = allfundContent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((funds) => (<Allfundrecord Allfundrecord={funds} />))) : (listContent = <tr><td colSpan='9'><h5>No record found!</h5></td></tr>)
  
      }*/

    return (
        <Container>
            <Popup openPopup={openPopup} pageTitle={pageTitle} setOpenPopup={setOpenPopup} modalWidth={modalWidth}>
                {(openPopup) && <FundApprovereject addOrEdit={(e) => addOrEdit(e)} recordForEdit={recordForEdit} />}
            </Popup>
            {/* <Popup
                title="Edit Fund Request Status"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <FundApprovereject
                    recordForEdit={recordForEdit}
                     />
            </Popup> */}
            <Typography variant="h5">Fund Request<Ptags></Ptags></Typography>

            <FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                        components={[

                        ]}
                    >
                        <DemoItem label="From Date">
                            <TextField onChange={(e) => setFromDate(e.target.value)} value={fromdate} type="date" />
                        </DemoItem>

                        <DemoItem label="To Date" >

                            <TextField onChange={(e) => setToDate(e.target.value)} value={todate} type="date" />
                        </DemoItem>
                        <DemoItem label="User Id" >
                            <TextField onChange={(e) => setUserId(e.target.value)} value={userId} />
                        </DemoItem>
                        <DemoItem label="Status" >

                            <Select style={{ width: '150px' }}
                                defaultValue={0}
                                name="status"
                                id="status"
                                onChange={(e) => setStatus(e.target.value)}
                                value={status}
                            >
                                <MenuItem value="">Select Status</MenuItem>
                                <MenuItem value={0}>Pending</MenuItem>
                                <MenuItem value={1}>Approved</MenuItem>
                                <MenuItem value={2}>Rejected</MenuItem>
                            </Select>
                        </DemoItem>
                    </DemoContainer>
                </LocalizationProvider>
            </FormControl>

            <FormControl>
                <Buttons variant="contained" id="submitting" type="submit" onClick={(e) => { onSubmit(e) }}>Search</Buttons>
            </FormControl>

            {spinner ? (
                <Loading />
            ) :
                (<div className='container mt-5' >
                    <div className='row'>
                        <div className='col-md-11'>
                            <div className='card'>
                                <Row className='align-items-center'>
                                    <Col>
                                        <h6><u>Fund Requests ({`${count || 0}`})</u></h6>
                                    </Col>
                                </Row>
                                <Table scope="col"
                                    striped
                                    bordered
                                    responsive
                                    className='table-sm text-center' style={{ overflow: 'auto' }}>
                                    <thead className='fonts'>
                                        <tr>
                                            {/* <td style={{ widtd: '10px' }}>#</td> */}
                                            <td >User Id</td>
                                            <td >User Name</td>
                                            <td >Deposit Wallet</td>
                                            <td >Date of Request</td>
                                            <td >Approve Date</td>
                                            <td >Amount</td>
                                            <td >Transaction Id</td>
                                            <td >Remark</td>
                                            <td >Status</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allfundContents && allfundContents?.length > 0 ?
                                            (allfundContents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((funds) =>

                                                <tr key={funds._id}>
                                                    <td>{funds.userId}</td>
                                                    <td>{funds.userName}</td>
                                                    <td >GDX</td>
                                                    <td >{getDateString(funds.created_at)}</td>
                                                    <td >{getDateString(funds.updated_at)}</td>
                                                    <td >{(funds.gdxamount).toFixed(2)}</td>
                                                    <td ><a /*className='btn btn-success btn-sm'*/ target="_blank" href={funds.hashUrl
                                                    } >{(funds.hash).slice(0, 30)}</a></td>
                                                    <td >{funds.remarks}</td>
                                                    <td>{funds.status === 1 ? (<Button variant="contained" style={{ backgroundColor: 'green', pointerEvents: 'none' }} >Approved</Button>) : funds.status === 2 ? (<Button variant="contained" style={{ backgroundColor: 'red', pointerEvents: 'none' }} >Rejected</Button>) : <Button variant="contained" /*style={{ backgroundColor: 'green' }}*/ onClick={() => openInPopupForUpdate(funds)}>Approve/Reject</Button>}</td>
                                                </tr>)) : (<tr><td colSpan='9'><h5>No record found!</h5></td></tr>)
                                        }
                                    </tbody>
                                </Table>
                                {count > 0 ?
                                    <TablePagination
                                        rowsPerPageOptions={[0]}
                                        component="div"
                                        count={count}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                    : ''}
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
        </Container>)
}

export default Fundrequest;
const Container = styled(FormGroup)`
width: 80%;
margin: 3% auto 0 20%;
& > div {
    margin-top:10px;
}
`
const Spanning = styled(FormLabel)`
color: red;
font-size:12px;
`
const Ptags = styled('p')`
font-size:12px;
`
const Buttons = styled(Button)`
width: 30%;
`
