import React from 'react';
import { Typography, FormGroup, FormControl, TextField, styled, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup'; // Yup is a JavaScript object schema validator.
import { useFormik } from 'formik'; //formik is third party React form library. It provides basic form programming and validation
import axios from 'axios';


const Register = () => {

    const navigate = useNavigate();
    const initialValues = {
        name: '',
        email: '',
        password: '',
        repassword: ''
    };

    //for inline validations via Yup and formik
    const schema = Yup.object({
        name: Yup.string('')
            .required('Name is required'),
        email: Yup.string('')
            .email('Enter a valid email')
            .required('Email is required'),
        password: Yup.string('')
            .min(8, 'The password must be at least 8 characters.')
            .required('Password is required'),
        repassword: Yup.string('')
            .min(8, 'The password must be at least 8 characters.')
            .required('Re Password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: schema,
        onSubmit: (values, { resetForm }) => {
            onUserRegister(values, resetForm);
        }
    });

    const onUserRegister = async (val) => {
        const postBody = {
            name: val.name,
            email: val.email,
            password: val.password
        }

        await axios.post('http://localhost:8000/api/register', postBody).then(response => {
            if (response.status === 201) {
                navigate('/login');
                toast.success('Customer is created in Successfully!', {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
            else if (response.data === 409) {
                // alert(resp.data.message.email);
                toast.error('Email has alreay been taken!', {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
            else {
                // alert(resp.data.message + 'else');
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

            <Typography variant="h5">Sign Up User<p style={{ fontSize: '10px' }}>(All the field having * are required)</p></Typography>
            <FormControl>
                <TextField value={formik.values.name}
                    required='required'
                    id='name'
                    name='name'
                    label="Name"
                    onChange={formik.handleChange}
                    inputProps={{ maxLength: 50 }}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />

            </FormControl>
            <FormControl>
                <TextField value={formik.values.email}
                    required='required'
                    id='email'
                    name='email'
                    label="Email"
                    onChange={formik.handleChange}
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
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    type="password"
                />
            </FormControl>
            <FormControl>
                <TextField value={formik.values.repassword}
                    required='required'
                    id='repassword'
                    name='repassword'
                    label="Retype Password"
                    onChange={formik.handleChange}
                    /* inputProps={{ maxLength: 50 }} */
                    error={formik.touched.repassword && Boolean(formik.errors.repassword)}
                    helperText={formik.touched.repassword && formik.errors.repassword}
                    type="password"
                />
            </FormControl>

            <FormControl>
                <Button variant="contained" component="label" type="submit" onClick={(e) => formik.handleSubmit()}>Add User</Button>
            </FormControl>
        </Container>

    )
}

export default Register;
const Container = styled(FormGroup)`
width: 30%;
margin: 3% auto 0 auto;
& > div {
    margin-top:10px;
}
`
