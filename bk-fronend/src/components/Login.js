import React, { useContext } from 'react';
import { Typography, FormGroup, FormControl, TextField, styled, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup'; // Yup is a JavaScript object schema validator.
import { useFormik } from 'formik'; //formik is third party React form library. It provides basic form programming and validation
import { login, getImageUrl } from '../routes/api';
import AuthContext from "../store/AuthContext";
import companyLogo from './logo_dark.jpg';
const Login = () => {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const loginUser = authCtx.loginUser;
    const schema = Yup.object({
        username: Yup.string('')
            .required('Username is required')
            .min(4, 'The Username must be at least 4 characters.'),
        password: Yup.string('')
            .min(8, 'The password must be at least 8 characters.')
            .required('Password is required')
            .matches(/^(?=.*\d)(?=.*[@#\-_$%^&+=ยง!\?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=ยง!\?]+$/,"Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters!"),
    });
    //for inline validations via Yup and formik
    const formik = useFormik({
        initialValues: {
            username: 'GDXsadmin',
            password: 'April@52684',
        },
        validationSchema: schema,
        onSubmit: (values, { resetForm }) => {
            onCustomerLogin(values, resetForm);
        }
    });

    const onCustomerLogin = async (val) => {
        const postBody = {
            username: val.username,
            password: val.password
        }
        // api call
        await login(postBody).then(response => {
            if (response.status === 201) {
                localStorage.setItem('token', JSON.stringify(response.data.access_token));
                localStorage.setItem('user', JSON.stringify(response.data));
                toast.success('GRIDX Admin is Logged in Successfully!', {
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
            <Typography variant="h5">
                <div>
                    <img src={companyLogo} width="60%" alt="logo" />
                </div>
                </Typography>
                <Typography variant="h5">
                    <Ptags>GridX Admin Login</Ptags><p style={{ fontSize: '12px' }}>(All the field having * are required)</p></Typography>
                <FormControl>
                    <TextField value={formik.values.username}
                        required='required'
                        id='username'
                        name='username'
                        label="Username"
                        onChange={formik.handleChange}
                        /* inputProps={{ maxLength: 50 }} */
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
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
        </Container>

    )
}

export default Login;
const Container = styled(FormGroup)`
width: 30%;
margin: 8% auto 0 auto;
& > div {
    margin-top:10px;
}
`
const Buttons = styled(Button)`
width: 100%;
line-height: 3.0;
`
const Ptags = styled('p')`
font-size: '20px';
font-weight: 300;
letter-spacing: -0.025em;
color: #253992;
line-height: 1.2;
`