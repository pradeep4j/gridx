import React, { useState,useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Typography, FormGroup, FormControl, styled, Button, TextField, FormLabel, TablePagination } from '@mui/material';
import Loading from "../../components/Loading";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { addnews, allnews,getnewsbyId } from '../../routes/api';

import { Table, Row, Col } from 'react-bootstrap';
const Newsedit = () => {
        const navigate = useNavigate();
        const {id} = useParams();
        const [spinner, setSpinner] = useState(false);
        const [newsContent, setnewsContent] = useState([]);

        const initialValues = {
                news: ''
        }
        const savedValues = {
            news: newsContent
        }
        const schema = Yup.object({
                news: Yup.string()
                        .required("New content is required!")
        })
        const formik = useFormik({
                initialValues: (savedValues || initialValues),
                validationSchema: schema,
                enableReinitialize:true,
                onSubmit: (values, { resetForm }) => {
                    onEditNews(values, resetForm);
                }
        });
        const getnews = async (id) => {
                setSpinner(true);
                await getnewsbyId(id).then(response => {
                        if (response.status === 201) {
                                setSpinner(false);
                                setnewsContent(response.data);
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
                        toast.error(error.message, {
                                position: "bottom-right",
                                hideProgressBar: false,
                                progress: undefined,
                        });
                });
        }
        useEffect(() => {
                getnews(id);
        }, []);
        

        const onEditNews = async (val) => {

                const postBody = {
                        news: val.news
                }
                setSpinner(true);
                await addnews(postBody).then(response => {
                        document.getElementById("submitting").innerText = "Editing News...Please wait";
                        document.getElementById("submitting").disabled = true;
                        if (response.status === 201) {
                                toast.success('News Updated Successfully!', {
                                        position: "bottom-right",
                                        hideProgressBar: false,
                                        progress: undefined,
                                });
                        }
                        else {
                                toast.error(response.data, {
                                        position: "bottom-right",
                                        hideProgressBar: false,
                                        progress: undefined,
                                });
                                document.getElementById("submitting").innerText = "Edit News";
                                document.getElementById("submitting").disabled = false;
                        }

                        setSpinner(false);
                }).catch((error) => {
                        toast.error(error.message, {
                                position: "bottom-right",
                                hideProgressBar: false,
                                progress: undefined,
                        });
                        document.getElementById("submitting").innerText = "Edit News";
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
                                <Buttons variant="contained" id="submitting" type="submit" onClick={(e) => formik.handleSubmit()}>Edit News</Buttons>
                        </FormControl>
                        
                </Container>);
}

export default Newsedit;
const Container = styled(FormGroup)`
width: 40%;
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