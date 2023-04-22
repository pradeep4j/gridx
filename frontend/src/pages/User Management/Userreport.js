import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import * as Yup from 'yup'; // Yup is a JavaScript object schema validator.
import { useFormik } from 'formik'; //formik is third party React form library. It provides basic form programming 
//import FundApprovereject from './FundApprovereject';
const Userreport = () => {
    const navigate = useNavigate();
    const countries = countryList.getData();
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
    const [spinner, setSpinner] = useState(false);
    const [country, setCountry] = useState(countries[104].code);
    const [states, setStates] = useState();
    const [fromdate, setFromDate] = useState('');
    const [todate, setToDate] = useState('');
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState(0);
    const schema = Yup.object({
        email: Yup.string('')
            .email('Email is invalid!'),
        remarks: Yup.string('')
            .min(8, 'The Remarks must be minimum at least 8 characters.')
            .max(100, 'The Remarks must be minimum at least 100 characters.')
            .required('Remark is required!')
    });
    const initialValues = {
        userId: '',
        gdxamount: '',
        hash: '',
        type: '',
        remarks: ''
    }

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
       // relodreport(e);
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
    }, [dataPage]);
    let alluserdatas = [];
    const onStatusUpdate = async (e) => {
        e.preventDefault();
        const postBody = {
            fromdate: fromdate,
            todate: todate,
            userId: userId,
            status: status
        }
        setSpinner(true)
        await getuserreport(postBody).then(response => {

            if (response.status === 200 || response.status === true) {
                setSpinner(false);
                setAllUserdata(response.data.data);
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
    for (let i in alluserdata) {
        alluserdatas.push(alluserdata[i]);
    }
    count = alluserdatas?.length;
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
                {(openPopup) && <Edituserdetails addOrEdit={(e) => addOrEdit(e)} recordForEdit={recordForEdit} />}
            </Popup>
            <Typography variant="h5">User Report<Ptags>(All the field having * are required)</Ptags></Typography>
            <Typography variant="h6">Search Criteria</Typography>
            <Row style={{ width: '730px' }}>
                <Col>
                    <FormControl>
                        <TextFields value={formik.values.name}
                            id='userId'
                            name='name'
                            label="Name"
                            onChange={formik.handleChange}
                            //required
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        //style={{ lineHeight:1.0 }}
                        />
                    </FormControl>
                </Col>
                <Col>
                    <FormControl>
                        <TextField value={formik.values.mobile}
                            id='mobile'
                            name='mobile'
                            label="Mobile"
                            onChange={formik.handleChange}
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
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </FormControl>
                </Col>
            </Row>
            <FormControl>
                <DemoContainer style={{ width: '800px' }}
                    components={[

                    ]}
                >
                    <DemoItem label="From Date"  >
                        <TextField style={{ width: '225px' }} onChange={(e) => setFromDate(e.target.value)} value={fromdate} type="date" />
                    </DemoItem>

                    <DemoItem label="To Date" >

                        <TextField style={{ width: '225px' }} onChange={(e) => setToDate(e.target.value)} value={todate} type="date" />
                    </DemoItem>
                    {/* <DemoItem label="Country" >
                        <Select style={{ width: '225px' }}
                            name="country"
                            id="country"
                            onChange={(e) => setCountry(e.target.value)}
                            value={country}
                        >
                            {countries.map(country => (

                                <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>

                            ))}
                        </Select>
                    </DemoItem> */}
                </DemoContainer>

            </FormControl>
            <Row style={{ width: '490px' }}>
                <DemoContainer style={{ width: '800px' }}
                    components={[

                    ]}
                >
                    <Col>
                        <FormControl>

                            {/* <DemoItem label="State" >
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
                            </DemoItem> */}


                        </FormControl>
                    </Col>
                    <Col>
                        {/* <DemoItem label="City" >
                            <FormControl>
                                <TextField value={formik.values.city}
                                    id='city'
                                    name='city'
                                    onChange={formik.handleChange}
                                    error={formik.touched.city && Boolean(formik.errors.city)}
                                    helperText={formik.touched.city && formik.errors.city}
                                />
                            </FormControl>
                        </DemoItem> */}
                    </Col>

                </DemoContainer>
            </Row>
            <Row style={{ width: '480px' }}>
                <Col style={{ width: '230px' }}>
                    <FormControl>
                        <TextFields value={formik.values.userId}
                            id='userId'
                            name='userId'
                            label="User Id"
                            onChange={formik.handleChange}
                            //required
                            error={formik.touched.userId && Boolean(formik.errors.userId)}
                            helperText={formik.touched.userId && formik.errors.userId}
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
                            onChange={formik.handleChange}
                            error={formik.touched.walletaddress && Boolean(formik.errors.walletaddress)}
                            helperText={formik.touched.walletaddress && formik.errors.walletaddress}
                            style={{ width: '225px' }}
                        />
                    </FormControl>
                </Col>
            </Row>
            <FormControl>
                <Buttons variant="contained" id="submitting" type="submit" onClick={formik.handleSubmit}>Search</Buttons>
            </FormControl>
            <Row className='align-items-center'>
                <Col>
                    <center><h4><u>User List ({`${count || 0}`})</u></h4></center>
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
                                    className='table-sm text-center' style={{ overflow: 'auto' }}>
                                    <thead className='fonts'>
                                        <tr>
                                            {/* <td style={{ widtd: '10px' }}>#</td> */}
                                            <td >User Id</td>
                                            <td >Name</td>
                                            <td >Username</td>
                                            <td >Sponser Id</td>
                                            <td >Mobile</td>
                                            <td >Email</td>
                                            {/* <td >City</td> */}
                                            <td >Creation Date</td>
                                            {/* <td >Daily Deduction %</td> */}
                                            {/* <td >Daily Addition %</td> */}
                                            <td >Active Status</td>
                                            <td >Withdraw</td>
                                            <td >Edit</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {true ?
                                            (/*alluserdatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((funds) =>*/

                                                <tr >
                                                    {/* <td>{funds.userId}</td>
                                                    <td>{funds.name}</td>
                                                    <td >{funds.sponsor}</td>
                                                    <td >{funds.mobile}</td>
                                                    <td >{funds.email}</td>
                                                    <td >{funds.created_at}</td>
                                                    {/* <td ><a /*className='btn btn-success btn-sm' target="_blank" href={funds.hashUrl
                                                    } >{(funds.hash).slice(0, 30)}</a></td> 
                                                    <td >{funds.created_at}</td>
                                                    <td>{funds.created_at}</td>
                                                    <td>{funds.created_at}</td>
                                                    <td>{funds.created_at}</td>
                                                    <td>{funds.created_at}</td> */}
                                                    <td>hello</td>
                                                    <td>{ }</td>
                                                    <td >{ }</td>
                                                    <td >{ }</td>
                                                    <td >{ }</td>
                                                    <td >{ }</td>
                                                    <td >{ }</td>
                                                    {/* <td ><input 
                                                        style={{ width: '125px',lineHeight:0.5 }}
                                                        placeholder='0.00'
                                                        type="number"
                                                    /></td> */}
                                                    <td></td>
                                                    {/* <td>{}</td> */}
                                                    <td><Button variant="contained" style={{ backgroundColor: 'green' }} >Enable</Button>{/*<Button variant="contained" style={{ backgroundColor: 'red', pointerEvents: 'none' }} >Disable</Button>*/}</td>
                                                    <td><Button variant="contained" color="primary" onClick={() => openInPopupForUpdate()}>Edit User</Button></td>
                                                </tr>)/*)*/ : (listContent = <tr><td colSpan='11'><h5>No record found!</h5></td></tr>)
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
width: 30%;
line-height:2.5;
`
const TextFields = styled(TextField)`
width:'20px';
line-height:0.5;
`
