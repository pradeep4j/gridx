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
import { getuserreport } from '../../routes/api';
import Edituserdetails from './Edituserdetails';
import getDateString from '../../utils/getdatestring';
import Popup from "../../components/Popup";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import * as Yup from 'yup'; // Yup is a JavaScript object schema validator.
import { useFormik } from 'formik'; //formik is third party React form library. It provides basic form programming 
//import FundApprovereject from './FundApprovereject';
const Userreport = () => {
    const navigate = useNavigate();
    let alluserdatas = [];
    //const countries = countryList.getData();
    const statesval = jsonData.states;
    const modalWidth = '900px';
    const [open, setOpen] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [pageTitle, setPageTitle] = useState('')
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [dataPage, setDataPage] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [alluserdata, setAllUserdata] = useState();

    const [pageCount, setpageCount] = useState(0);
    let limit = 10;

    const [spinner, setSpinner] = useState(false);
    //  const [country, setCountry] = useState(countries[104].code);
    const [states, setStates] = useState();
    const [fromdate, setFromDate] = useState('');
    const [todate, setToDate] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [totaluser, setTotalUser] = useState();
    const [mobile, setMobile] = useState('');
    const schema = Yup.object({
        /*  email: Yup.string('')
              .email('Email is invalid!'),
          remarks: Yup.string('')
              .min(8, 'The Remarks must be minimum at least 8 characters.')
              .max(100, 'The Remarks must be minimum at least 100 characters.')
              .required('Remark is required!')*/
    });
    const initialValues = {
        //  page: 2,
        name: "",
        mobile: "",
        email: "",
        username: "",
        address: "",
        // range: ["2023-4-16", "2023-4-18"]

    }
    // DEFINING PAGENATION VALUES
    const perPage = 10;
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    const PerPageChange = (value) => {
        setSize(value);
        const newPerPage = Math.ceil(totaluser / value);
        if (current > newPerPage) {
            setCurrent(newPerPage);
        }
    };

    const getData = (current, pageSize) => {
        // Normally you should get the data from the server
        // console.log(alluserdata);
        return alluserdata.slice((current - 1) * pageSize, current * pageSize);
    };

    const PaginationChange = (page, pageSize) => {
        setCurrent(page);
        setSize(pageSize);
    };

    const PrevNextArrow = (current, type, originalElement) => {

        if (type === "prev") {
            // alert(current)
            return (
                <button >
                    <KeyboardArrowLeftIcon onClick={relodreportPrew} />
                </button>
            );
        }
        if (type === "next") {
            return (
                <button >
                    <KeyboardArrowRightIcon onClick={relodreportNext} />
                </button>
            );
        }
        return originalElement;
    };
    //for inline validations via Yup and formik
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: schema,
        onSubmit: (values, { resetForm }) => {
            onStatusUpdate(values, resetForm);
        }
    });
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
        setPageTitle('Edit User Details');
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
    // alert(country);
    useEffect(() => {
        setPage(0);
        if (current > 1) {
            alert()
            setAllUserdata();
        }
        setpageCount(Math.ceil(totaluser / limit));
    }, [limit]);

    const relodreportPrew = async (e) => {
        // alert()
        // setAllUserdata();
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
        const postBody = {
            page: current - 1,
            search: username,
            range: daterange
        }
        // alert(JSON.stringify(postBody)); return;
        setSpinner(true)
        await getuserreport(postBody).then(response => {
            //  alert(response.data.status)
            if (response.data.status === true) {
                setSpinner(false);
                setAllUserdata(response.data.data[0].users);
                setTotalUser(response.data.data[0].totalUser);
                //  alert(response.data.status)
                //  alert(JSON.stringify(response.data.data[0].users))
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
    const fetchComments = async (currentPage) => {
        const res = await fetch(
            `http://localhost:3004/comments?_page=${currentPage}&_limit=${limit}`
            // `https://jsonplaceholder.typicode.com/comments?_page=${currentPage}&_limit=${limit}`
        );
        const data = await res.json();
        return data;
    };

    const handlePageClick = async (data) => {
        // console.log(data.selected);
       // alert(data.selected)
        let currentPage = data.selected + 1;

       // const commentsFormServer = await fetchComments(currentPage);
       
        // alert()
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
        const postBody = {
            page: currentPage,
            search: username,
            range: daterange
        }
        // alert(JSON.stringify(postBody)); return;
        setSpinner(true)
        await getuserreport(postBody).then(response => {
            //  alert(response.data.status)
            if (response.data.status === true) {
                setSpinner(false);
                setAllUserdata(response.data.data[0].users);
                setTotalUser(response.data.data[0].totalUser);
                //  alert(response.data.status)
                //  alert(JSON.stringify(response.data.data[0].users))
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
        // scroll to the top
        //window.scrollTo(0, 0)
    };
    const relodreportNext = async (e) => {
        // setAllUserdata();
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
        const postBody = {
            page: current + 1,
            search: username,
            range: daterange
        }
        // alert(JSON.stringify(postBody)); return;
        setSpinner(true)
        await getuserreport(postBody).then(response => {
            //  alert(response.data.status)
            if (response.data.status === true) {
                setSpinner(false);
                setAllUserdata(response.data.data[0].users);
                setTotalUser(response.data.data[0].totalUser);
                //  alert(response.data.status)
                //  alert(JSON.stringify(response.data.data[0].users))
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
    const relodreport = async (e) => {
        // alert()
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
        const postBody = {
            page: current,
            search: username,
            range: daterange
        }
        // alert(JSON.stringify(postBody)); return;
        setSpinner(true)
        await getuserreport(postBody).then(response => {
            //  alert(response.data.status)
            if (response.data.status === true) {
                setSpinner(false);
                setAllUserdata(response.data.data[0].users);
                setTotalUser(response.data.data[0].totalUser);
                //  alert(response.data.status)
                //  alert(JSON.stringify(response.data.data[0].users))
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
    const onStatusUpdate = async (val) => {
        //e.preventDefault();
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
        const postBody = {
            page: current,
            search: username,
            range: daterange
        }
        // alert(JSON.stringify(postBody)); return;
        setSpinner(true)
        await getuserreport(postBody).then(response => {

            if (response.data.status === true) {
                setSpinner(false);
                setAllUserdata(response.data.data[0].users);
                setTotalUser(response.data.data[0].totalUser);
                //  alert(JSON.stringify(response.data.data[0].users))
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
    //   let listContent;
    //   let count = 0;
    for (let i in alluserdata) {
        alluserdatas.push(alluserdata[i]);
    }
    // count = totaluser;
    //console.log(alluserdata);
    //alert(totaluser)
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
            <Popup openPopup={openPopup} pageTitle={pageTitle} setOpenPopup={setOpenPopup} width={modalWidth}>
                {(openPopup) && <Edituserdetails addOrEdit={addOrEdit} recordForEdit={recordForEdit} />}
            </Popup>
            <Typography variant="h5">User Report<Ptags>(All the field having * are required)</Ptags></Typography>
            <Typography variant="h6">Search Criteria</Typography>
            <Row style={{ width: '975px' }}>
                <Col >
                    <DemoContainer
                        components={[

                        ]}
                    >
                        <DemoItem label="Search"  >
                            <TextFields value={formik.values.username}
                                id='name'
                                name='username'
                                //  label="Name"
                                onChange={(e) => setUsername(e.target.value)}
                                //required
                                placeholder='Username/Mobile/Email/GDXAddress'
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                                //style={{ lineHeight:1.0 }}
                                style={{ width: '310px' }}
                            />
                        </DemoItem>



                    </DemoContainer>
                    {/* <FormControl>
                        <TextFields value={formik.values.name}
                            id='name'
                            name='name'
                            label="Name"
                            onChange={(e) => setName(e.target.value)}
                            //required
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        //style={{ lineHeight:1.0 }}
                        />
                    </FormControl> */}
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
                {/* <Col>
                    <FormControl>
                        <TextField value={formik.values.mobile}
                            id='mobile'
                            name='mobile'
                            label="Mobile"
                            onChange={(e) => setMobile(e.target.value)}
                            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                            helperText={formik.touched.mobile && formik.errors.mobile}
                        />
                    </FormControl>
                </Col>
                <Col>
                    <FormControl>
                        <TextField value={formik.values.email}
                            id='email'
                            name='email'
                            label="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </FormControl>
                </Col> */}
            </Row>

            {/* <Row style={{ width: '490px' }}>
                <DemoContainer style={{ width: '800px' }}
                    components={[

                    ]}
                >
                    <Col>
                        <FormControl>

                            <DemoItem label="State" >
                                {country === 'IN' ?
                                    <Select style={{ width: '225px' }}
                                        name="state"
                                        id="state"
                                        onChange={(e) => setStates(e.target.value)}
                                        value={states}
                                    >
                                        {statesval.map(statei => (

                                            <MenuItem key={statei.state_code} value={statei.state_code}>{statei.name}</MenuItem>

                                        ))}

                                    </Select>
                                    : <Select style={{ width: '225px' }}
                                        name="state"
                                        id="state"
                                        defaultValue={0}
                                        onChange={(e) => setStates(e.target.value)}
                                        value={states}
                                    >
                                        <MenuItem key={0} value={0}>Select State</MenuItem>
                                    </Select>}
                                {/* <Select style={{ width: '225px' }}
                                    defaultValue={0}
                                    name="state"
                                    id="state"
                                    onChange={(e) => setState(e.target.value)}
                                    value={status}
                                >
                                    <MenuItem value="">Select Status</MenuItem>
                                    <MenuItem value={0}>Pending</MenuItem>
                                    <MenuItem value={1}>Approved</MenuItem>
                                    <MenuItem value={2}>Rejected</MenuItem>
                                </Select> }
                            </DemoItem> 

                        </FormControl>
                    </Col>
                    <Col>
                        <DemoItem label="City" >
                            <FormControl>
                                <TextField value={formik.values.city}
                                    id='city'
                                    name='city'
                                    onChange={formik.handleChange}
                                    error={formik.touched.city && Boolean(formik.errors.city)}
                                    helperText={formik.touched.city && formik.errors.city}
                                />
                            </FormControl>
                        </DemoItem> 
                    </Col>

                </DemoContainer>
            </Row>
             <Row style={{ width: '480px' }}>
                <Col style={{ width: '230px' }}>
                    <FormControl>
                        <TextFields value={formik.values.username}
                            id='username'
                            name='username'
                            label="User Id"
                            onChange={(e) => setUsername(e.target.value)}
                            //required
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            style={{ width: '225px' }}
                        />
                    </FormControl>
                </Col>
                <Col style={{ width: '220px' }}>
                    <FormControl>
                        <TextFields value={formik.values.walletaddress}
                            id='walletaddress'
                            name='walletaddress'
                            label="Wallet Address"
                            onChange={(e) => setAddress(e.target.value)}
                            error={formik.touched.walletaddress && Boolean(formik.errors.walletaddress)}
                            helperText={formik.touched.walletaddress && formik.errors.walletaddress}
                            style={{ width: '225px' }}
                        />
                    </FormControl>
                </Col> ({`${count || 0}`})
            </Row> */}


            {spinner ? (
                <Loading />
            ) :
                (<div className='container mt-5' >
                    <div className='row'>
                        <div className='col-md-11'>
                            <div className='card'>
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
                                            <td >Name</td>
                                            <td >Username</td>
                                            <td >Mobile</td>
                                            <td >Email</td>
                                            {/* <td >City</td> */}
                                            <td >Creation Date</td>
                                            {/* <td >Daily Deduction %</td> */}
                                            {/* <td >Daily Addition %</td> */}
                                            <td >Withdraw</td>
                                            <td style={{ width: '150px' }}>Edit</td>
                                        </tr>
                                    </thead>
                                    <tbody>{console.log(alluserdatas)}
                                        {totaluser > 0 ? (alluserdatas.slice((current - 1) * size, current * size).map((funds) =>

                                            <tr key={funds._id}>
                                                <td>{funds.name}</td>
                                                <td>{funds.username}</td>
                                                <td >{funds.mobile}</td>
                                                <td >{funds.email}</td>
                                                <td >{getDateString(funds.created_at)}</td>
                                                <td><Button variant="contained" style={{ backgroundColor: 'green' }} >Enable</Button>{/*<Button variant="contained" style={{ backgroundColor: 'red', pointerEvents: 'none' }} >Disable</Button>*/}</td>
                                                <td ><Button variant="contained" color="primary" onClick={() => openInPopupForUpdate(funds)}>Edit User</Button></td>
                                            </tr>)) : (<tr><td colSpan='9'><h5>No record found!</h5></td></tr>)
                                        }
                                    </tbody>
                                </Table>
                                {/* {count > 0 ?
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={count}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                    : ''} */}

                                {/* USING PAGENATION 
                                {totaluser > 0 ?
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
                                    : ''}*/}
                                {totaluser > 0 ?
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
                                    : ''}
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
        </Container>)
}

export default Userreport;
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
width: 100%;
line-height:3.1;
margin-top:'15%';
margin: 39% auto 0 auto;
`
const TextFields = styled(TextField)`
width:'20px';
line-height:0.5;
`
