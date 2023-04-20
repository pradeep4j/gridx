import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Table, Row, Col } from 'react-bootstrap';
import Allfundrecord from './Allfundrecord';
import { Typography, FormGroup, Select, TextField, FormControl, MenuItem, styled, Button, TablePagination, FormLabel } from '@mui/material';
import Loading from "../../components/Loading";
import { toast } from 'react-toastify';
import { getallfundrequest } from '../../routes/api';
const Fundrequest = () => {
    const navigate = useNavigate();
    const [dataPage, setDataPage] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [allfundContent, setallfundContent] = useState([]);
    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 2));
        setPage(0);
    };
    const [spinner, setSpinner] = useState(false);
    const [fromdate, setFromDate] = useState('');
    const [todate, setToDate] = useState('');
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState(0);
    const getfundrequest = async () => {

        await getallfundrequest().then(response => {
            // setSpinner(true);
            if (response.status === 201) {
                //  setSpinner(false);
                setallfundContent(response.data);
            }
            else {
                //  setSpinner(false);
                toast.error(response.data, {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
        }).catch((error) => {
            //  setSpinner(false);
            console.log(error.message);
            /*  toast.error(error.message, {
                      position: "bottom-right",
                      hideProgressBar: false,
                      progress: undefined,
              });*/
        });
    }
    useEffect(() => {
        //fetchign all news
        getfundrequest();
        setPage(0);
    }, [dataPage]);
    let listContent;
    let count = 0;
    if (spinner) {
        listContent = <tr><td colSpan='9'><h5>Loading...</h5></td></tr>
    }
    else {
        count = allfundContent?.length;
        {
            allfundContent && allfundContent?.length > 0 ?
                (listContent = allfundContent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((funds) => (<Allfundrecord Allfundrecord={funds} />))) : (listContent = <tr><td colSpan='4'><h5>No record found</h5></td></tr>)
        }
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        const postBody = {
            fromdate: fromdate,
            todate: todate,
            userId: userId,
            status: status
        }
        alert(JSON.stringify(postBody)); return;
    }
    return (
        <Container>

            <Typography variant="h5">Fund Request<Ptags></Ptags></Typography>
            {spinner && <Loading />}
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                        components={[
                            'DatePicker'
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
            <Row className='align-items-center'>
                <Col>
                    <center><h4><u>Fund Requests ({`${count || 0}`})</u></h4></center>
                </Col>
            </Row>
            {spinner ? (
                <Loading />
            ) :
                (<div className='container mt-5' >
                    <div className='row'>
                        <div className='col-md-11'>
                            <div className='card'>

                                <Table scope="col"
                                    striped
                                    bordered
                                    responsive
                                    className='table-sm text-center'>
                                    <thead className='fonts'>
                                        <tr><td style={{ widtd: '10px' }}>#</td><td style={{ width: '100px', textAlign: 'center' }}>Status</td><td style={{ width: '100px', textAlign: 'center' }}>User Id</td><td style={{ width: '100px', textAlign: 'center' }}>User Name</td>
                                            <td style={{ width: '150px', textAlign: 'center' }}>Deposit Wallet</td><td style={{ width: '150px', textAlign: 'center' }}>Date of Request</td><td style={{ width: '150px', textAlign: 'center' }}>Approve Date</td><td style={{ width: '150px', textAlign: 'center' }}>Amount</td>
                                            <td style={{ width: '150px', textAlign: 'center' }}>Transaction Id</td>
                                            <td style={{ width: '100px', textAlign: 'center' }}>Remark</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listContent}
                                    </tbody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[0]}
                                    component="div"
                                    count={count}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />

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
