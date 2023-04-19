import React, { useState } from 'react';
import axios from 'axios';
import { Typography, TextField, FormControl, FormGroup, Button, styled, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
const Join = () => {
    const user_details = localStorage.getItem('user');
    const user = JSON.parse(user_details);
    const navigate = useNavigate();
    const initialValues = {
        email: '',
        under_useremail: user.email,
        side: ''
    }
    const Schema = Yup.object({
        email: Yup.string('')
            .required('Email is required!')
            .email('Email is not Valid!'),
        side: Yup.string('')
            .required('Side is required!')
    })
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Schema,
        onSubmit: (values, { resetForm }) => {
            onJoin(values, resetForm)
        }

    })
    const onJoin = async (val) => {

        const formData = new FormData();

        formData.append('email', val.email);
        formData.append('under_useremail', val.under_useremail);
        formData.append('side', val.side);
        const token = localStorage.getItem('token');
        const parsedToken = JSON.parse(token);
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${parsedToken}`
            }
        }
        await axios.post('http://localhost:8000/api/join', formData, config).then(response => {
            //  alert(response.status)
            if (response.status === 201 && (response.data !== 401 && response.data !== 402 && response.data !== 403)) {
                navigate('/dashboard');

                toast.success(response.data, {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
            else if (response.data === 401) {
                toast.error('The side you selected is not available.', {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
            else if (response.data === 402) {
                toast.error('Invalid Under Email.', {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
            else if (response.data === 403) {
                toast.error('This user id(Email) is already availble.', {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
        }).catch(error => {
            toast.error(error.message, {
                position: "bottom-right",
                hideProgressBar: false,
                progress: undefined,
            });
        });

    }
    return (
        <Container>
            <Typography variant="h5"><center>Join MLM</center></Typography>
            <FormControl>
                <TextField
                    value={formik.values.email}
                    required
                    name="email"
                    label="Email"
                    inputProps={{ maxLength: 30 }}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
            </FormControl>
            <FormControl>
                <TextField
                    value={formik.values.under_useremail}
                    required
                    name="under_useremail"
                    label="Under User Id(Email)"
                    inputProps={{ maxLength: 30 }}
                    onChange={formik.handleChange}
                    error={formik.touched.under_useremail && Boolean(formik.errors.under_useremail)}
                    helperText={formik.touched.under_useremail && formik.errors.under_useremail}
                />
            </FormControl>
            <FormControl>
                <FormLabel required error={formik.touched.side && Boolean(formik.errors.side)}
                    helperText={formik.touched.side && formik.errors.side}>Side</FormLabel>
                <RadioGroup value={formik.values.side}
                    row
                    name="side" // eslint-disable-next-line no-unused-expressions 
                    onChange={(e) => { formik.handleChange; formik.setFieldValue("side", e.currentTarget.value) }}
                    required >
                    <FormControlLabel
                        value="left"
                        control={<Radio />}
                        label="Left"
                    />
                    <FormControlLabel
                        value="right"
                        control={<Radio />}
                        label="Right"
                    />
                </RadioGroup>
            </FormControl>
            <Spannings id="gender-error">{(formik.touched.side && formik.errors.side) ? <div>{formik.errors.side}</div> : ''}   </Spannings>
            <FormControl>
                <Button variant="contained" type="submit" id="submitting" onClick={(e) => formik.handleSubmit()}>Join MLM</Button>
            </FormControl>
        </Container >);
}
export default Join;
const Container = styled(FormGroup)`
width: 30%;
margin: 3% auto 0 auto;
& > div {
    margin-top:10px;
}
`
const Spannings = styled(FormLabel)`
color: #d32f2f;
font-size:13px;
`
    // < PersonIcon sx = {{ color: "green" }} style = {{ fontSize: '50px' }} />