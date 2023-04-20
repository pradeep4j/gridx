import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, FormGroup, FormControl, styled, Button, TextField, FormLabel, TablePagination } from '@mui/material';
import Loading from "../../components/Loading";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { addnews, allnews } from '../../routes/api';
import Allnewsrecord from './Allnewsrecord';
import { Table, Row, Col } from 'react-bootstrap';
import '../../hide.css';
const Addnews = () => {
        const navigate = useNavigate();
        const [dataPage, setDataPage] = useState(0);
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(5);
        const [spinner, setSpinner] = useState(false);
        const [allnewsContent, setallnewsContent] = useState([]);
        const handleChangePage = (event, newPage) => setPage(newPage);

        const handleChangeRowsPerPage = (event) => {
                setRowsPerPage(parseInt(event.target.value, 2));
                setPage(0);
        };
        const initialValues = {
                news: ''
        }
        const schema = Yup.object({
                news: Yup.string()
                        .required("New content is required!")
        })
        const formik = useFormik({
                initialValues: initialValues,
                validationSchema: schema,
                onSubmit: (values, { resetForm }) => {
                        onAddNews(values, resetForm);
                }
        });
        const getallnews = async () => {
                
                await allnews().then(response => {
                       // setSpinner(true);
                        if (response.status === 201) {
                              //  setSpinner(false);
                                setallnewsContent(response.data);
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
                getallnews();
                setPage(0);
        }, [dataPage]);
        let listContent;
        let count = 0;
        if (spinner) {
                listContent = <tr><td colSpan='4'><h5>Loading...</h5></td></tr>
        }
        else {
                count = allnewsContent?.length;
                {
                        allnewsContent && allnewsContent?.length > 0 ?
                                (listContent = allnewsContent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((news) => (<Allnewsrecord Allnewsrecord={news} />))) : (listContent = <tr><td colSpan='4'><h5>No record found</h5></td></tr>)
                }
        }

        const onAddNews = async (val) => {

                const postBody = {
                        news: val.news
                }
                
                await addnews(postBody).then(response => {
                       // setSpinner(true);
                        document.getElementById("submitting").innerText = "Adding News...Please wait";
                        document.getElementById("submitting").disabled = true;
                        if (response.status === 201) {
                                setSpinner(false);
                                toast.success('News Added Successfully!', {
                                        position: "bottom-right",
                                        hideProgressBar: false,
                                        progress: undefined,
                                });
                        }
                        else {
                                setSpinner(false);
                                toast.error(response.data, {
                                        position: "bottom-right",
                                        hideProgressBar: false,
                                        progress: undefined,
                                });
                                document.getElementById("submitting").innerText = "Add News";
                                document.getElementById("submitting").disabled = false;
                        }

                       // setSpinner(false);
                }).catch((error) => {
                        setSpinner(false);
                        toast.error(error.message, {
                                position: "bottom-right",
                                hideProgressBar: false,
                                progress: undefined,
                        });
                        document.getElementById("submitting").innerText = "Add News";
                        document.getElementById("submitting").disabled = false;
                });

        }
        return (
                <Container>

                        <Typography variant="h5">Add News<Ptags>(All the field having * are required)</Ptags></Typography>
                        {spinner && <Loading />}
                        <FormControl>
                                <TextField value={formik.values.news}
                                        label="Add News"
                                        name="news"
                                        onChange={formik.handleChange} required
                                        multiline
                                        rows={4}
                                        error={formik.touched.news && Boolean(formik.errors.news)}
                                        helperText={formik.touched.news && formik.errors.news} />
                        </FormControl>
                        <FormControl>
                                <Buttons variant="contained" id="submitting" type="submit" onClick={(e) => formik.handleSubmit()}>Add News</Buttons>
                        </FormControl>
                        <Row className='align-items-center'>
                                <Col>
                                        <center><h4>All news ({`${count || 0}`})</h4></center>
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
                                                                        <tr><td style={{ widtd:'10px' }}>#</td><td style={{ width:'700px',textAlign:'center' }}>News</td>
                                                                                <td style={{ width:'150px',textAlign:'center' }}>Status</td><td style={{ width:'150px',textAlign:'center' }}>Action</td>
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
                </Container>);
}

export default Addnews;
const Container = styled(FormGroup)`
width: 60%;
margin: 3% auto 0 auto;
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
width: 40%;
`
const Spannings = styled(FormLabel)`
color: #d32f2f;
font-size:13px;
`