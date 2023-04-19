import React, { useContext } from 'react';
import { Typography, FormGroup, FormControl, TextField, styled, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup'; // Yup is a JavaScript object schema validator.
import { useFormik } from 'formik'; //formik is third party React form library. It provides basic form programming and validation

import AuthContext from "../store/AuthContext";
import axios from 'axios';
axios.defaults.withCredentials = true;
const Login = () => {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const loginUser = authCtx.loginUser;
    const schema = Yup.object({
        email: Yup.string('')
            .email('Enter a valid email')
            .required('Email is required'),
        password: Yup.string('')
            .min(8, 'The password must be at least 8 characters.')
            .required('Password is required'),
    });
    //for inline validations via Yup and formik
    const formik = useFormik({
        initialValues: {
            email: 'customer@customer.com',
            password: '12345678',
        },
        validationSchema: schema,
        onSubmit: (values, { resetForm }) => {
            onCustomerLogin(values, resetForm);
        }
    });

    const onCustomerLogin = async (val) => {
        const postBody = {
            email: val.email,
            password: val.password
        }
        // api call
        await axios.post('http://localhost:8000/api/login', postBody).then(response => {
            if (response.status === 201) {
                localStorage.setItem('token', JSON.stringify(response.data.access_token));
                localStorage.setItem('user', JSON.stringify(response.data));
                toast.success('Customer is Logged in Successfully!', {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
                loginUser();
                navigate('/dashboard');
            }
            else if (response.data === 404) {
                toast.error('User Not Found!.', {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
            else if (response.data === 400) {
                toast.error('Email/Password is wrong!', {
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
            <Typography variant="h5">Login<p style={{ fontSize: '10px' }}>(All the field having * are required)</p></Typography>
            <FormControl>
                <TextField value={formik.values.email}
                    required='required'
                    id='email'
                    name='email'
                    label="Email"
                    onChange={formik.handleChange}
                    /* inputProps={{ maxLength: 50 }} */
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
            </FormControl>
            <FormControl>
                <TextField value={formik.values.password}
                    required='required'
                    id='password'
                    name='password'
                    label="Password"
                    onChange={formik.handleChange}
                    /* inputProps={{ maxLength: 50 }} */
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    type="password"
                />
            </FormControl>

            <FormControl>
                <Buttons variant="contained" type="submit" onClick={formik.handleSubmit}>Login</Buttons>
            </FormControl>
            <FormControl>
                <Link to="/register" >
                    {"Don't have an account? Sign Up"}
                </Link>
            </FormControl>
        </Container>

    )
}

export default Login;
const Container = styled(FormGroup)`
width: 30%;
margin: 3% auto 0 auto;
& > div {
    margin-top:10px;
}
`
const Buttons = styled(Button)`
width: 40%;
`