import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from "rc-pagination";
import ReactPaginate from "react-paginate";
import jsonData from '../../utils/states.json';
import '../../hide.css';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { Table, Row, Col } from 'react-bootstrap';
//import Allfundrecord from './Allfundrecord';
import countryList from 'country-list';
import { Typography, FormGroup, Select, TextField, FormControl, MenuItem, styled, Button, TablePagination, FormLabel, Paper } from '@mui/material';
import Loading from "../../components/Loading";
import { toast } from 'react-toastify';
import { useractivationreport } from '../../routes/api';
//import Edituserdetails from './Edituserdetails';
import getDateString from '../../utils/getdatestring';

import * as Yup from 'yup'; // Yup is a JavaScript object schema validator.
import { useFormik } from 'formik'; //formik is third party React form library. It provides basic form programming 
const Pinactivationreport = () => {
    const navigate = useNavigate();
    const [dataPage, setDataPage] = useState(0);
    const [page, setPage] = useState(1);
    const [useractivationdata, setUserActivationData] = useState();

    let limit = 10;

    const [spinner, setSpinner] = useState(false);
    //  const [country, setCountry] = useState(countries[104].code);
    const [fromdate, setFromDate] = useState('');
    const [todate, setToDate] = useState('');
    const [username, setUsername] = useState('');
    const [totaluser, setTotalUser] = useState();

    let daterange;
    if (fromdate !== '') {
        daterange = [fromdate, fromdate];
    }
    if (todate !== '') {
        daterange = [todate, todate];
    }
    if (fromdate !== '' && todate !== '') {
        daterange = [fromdate, todate];
    }
    if (fromdate === '' && todate === '') {
        daterange = "";
    }
    useEffect(() => {
        const postBody = {
            page: page,
            search: username,
            range: daterange
        }
        const getUserData = async () => {
            await useractivationreport(postBody).then(response => {
                if (response.data.status === true) {
                    setSpinner(false);
                    setUserActivationData(response.data.data?.[0].users);
                    setTotalUser(response.data.data?.[0].totalUser);
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
        getUserData();
    }, [dataPage, page]);
    const schema = Yup.object({
    });
    const initialValues = {
    }

    //for inline validations via Yup and formik
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: schema,
        onSubmit: (values, { resetForm }) => {
            onPinActivationReport(values, resetForm);
        }
    });

    const onPinActivationReport = async (val) => {
        const postBody = {
            page: page,
            search: username,
            range: daterange
        }

        setSpinner(true)
        await useractivationreport(postBody).then(response => {

            if (response.data.status === true) {
                setSpinner(false);
                setUserActivationData(response.data.data[0].users);
                setTotalUser(response.data.data[0].totalUser);
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

    return (
        <Container>
            <Typography variant="h5">User Activation Report</Typography>
            <Typography style={{ fontSize: '17px' }}>Search Criteria</Typography>
            <Row >
                <Col >
                    <DemoContainer
                        components={[

                        ]}
                    >
                        <DemoItem label="Search"  >
                            <TextFields value={username}
                                id='name'
                                name='username'
                                //  label="Name"
                                onChange={(e) => setUsername(e.target.value)}
                                //required
                                placeholder='Name/Username/Mobile/Email/GDXAddress'
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                                //style={{ lineHeight:1.0 }}
                                style={{ width: '350px' }}
                            />
                        </DemoItem>



                    </DemoContainer>
                </Col>
                <Col >
                    <FormControl>
                        <DemoContainer
                            components={[

                            ]}
                        >
                            <DemoItem label="From Date"  >
                                <TextField style={{ width: '175px' }} onChange={(e) => setFromDate(e.target.value)} value={fromdate} type="date" />
                            </DemoItem>

                            <DemoItem label="To Date" >

                                <TextField style={{ width: '175px' }} onChange={(e) => setToDate(e.target.value)} value={todate} type="date" />
                            </DemoItem>
                        </DemoContainer>
                    </FormControl>
                </Col>
                <Col>
                    <FormControl>
                        <Buttons variant="contained" id="submitting" type="submit" onClick={formik.handleSubmit}>Search</Buttons>
                    </FormControl>
                </Col>
            </Row>
            {spinner ? (
                <Loading />
            ) :
                (<div className='container mt-5' >
                    <div className='row'>
                        <div className='col-md-11'>
                            <div className='card' style={{ marginLeft:'-15px' }}>
                                <Row >
                                    <Col >
                                        <h6><u>User Count : ({`${totaluser || 0}`})</u></h6>
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
                                            <td >Username</td>
                                            <td >Name</td>
                                            <td >Mobile</td>
                                            <td >Email</td>
                                            <td >Type</td>
                                            <td >Amount in $</td>
                                            <td >Amount in GDX</td>
                                            <td >Creation Date</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {totaluser > 0 ? (useractivationdata.map((funds) =>
                                            <tr key={funds._id}>
                                                <td>{funds.username}</td>
                                                <td>{funds.name}</td>
                                                <td >{funds.mobile}</td>
                                                <td >{funds.email}</td>
                                                <td >Daily Deduction %</td>
                                                <td >Daily Addition %</td>
                                                <td></td>
                                                <td >{getDateString(funds.created_at)}</td>
                                            </tr>)) : (<tr><td colSpan='9'><h5>No record found!</h5></td></tr>)
                                        }
                                    </tbody>
                                </Table>
                                {totaluser > 0 ? <div className="pagination">
                                    <span
                                        className={page === 1 ? "inactive" : "active"}
                                        onClick={page > 1 ? () => setPage(prev => prev - 1) : ''}
                                    >
                                        ◀️
                                    </span>
                                    <span className="rc-pagination-item">
                                        {page}...{Math.ceil(totaluser / limit)}
                                    </span>
                                    {/*[...Array(totaluser / limit)].map((_, index) => {
                                        return (
                                            <span
                                                className={page == index + 1 && "active-page-num"}
                                                onClick={() => setPage(index + 1)}
                                            >
                                                {index + 1}
                                            </span>
                                        );
                                    })*/}
                                    <span
                                        className={page === totaluser / limit ? "inactive" : "active"}
                                        onClick={page < Math.ceil(totaluser / limit) ? () => setPage(prev => prev + 1) : ''}
                                    >
                                        ▶️
                                    </span>
                                </div>
                                    : ''}
                                {/*totaluser > 0 ?
                                    <TablePagination
                                        rowsPerPageOptions={[]}//{[5, 10, 25]}
                                        component="div"
                                        count={totaluser}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                            : ''*/}

                                {/* USING PAGENATION */}
                                {/*totaluser > 0 ?
                                    <Pagination
                                        className="pagination-data"
                                        showTotal={(total, range) =>
                                            `Showing ${range[0]}-${range[1]} of ${total}`
                                        }
                                        onChange={PaginationChange}
                                        total={totaluser}
                                        current={current}
                                        pageSize={size}
                                        showSizeChanger={false}
                                        itemRender={PrevNextArrow}
                                        onShowSizeChange={PerPageChange}
                                    />
                                    : ''*/}
                                {/*totaluser > 0 ?
                                    <ReactPaginate
                                        previousLabel={"previous"}
                                        nextLabel={"next"}
                                        breakLabel={"..."}
                                        pageCount={totaluser}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handlePageClick}
                                        containerClassName={"pagination justify-content-center"}
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        activeClassName={"active"}
                                    />
                                    : ''*/}

                            </div>
                        </div>
                    </div>
                </div>
                )
            }
        </Container >)
}

export default Pinactivationreport;
const Container = styled(FormGroup)`
width: 80%;
margin: 3% auto 0 25%;
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
width: 100%;
line-height:3.1;
margin-top:'15%';
margin: 39% auto 0 auto;
`
const TextFields = styled(TextField)`
width:'20px';
line-height:0.5;
`
