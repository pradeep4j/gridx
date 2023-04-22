import React, { useState } from 'react';
import { Typography, FormGroup, FormControl, TextField, styled, Button, InputLabel, Select, MenuItem, FormLabel, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { toast } from 'react-toastify';
import * as Yup from 'yup'; // Yup is a JavaScript object schema validator.
import { useFormik } from 'formik'; //formik is third party React form library. It provides basic form programming and validation
import { updatestatuswithremark } from '../../routes/api';
import { useForm, Form } from '../../components/useForm';
import { Table, Row, Col } from 'react-bootstrap';
const FundApprovereject = ({ addOrEdit, recordForEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    //const [openPopup, setOpenPopup] = useState(true);
    // alert(JSON.stringify(recordForEdit))
    const schema = Yup.object({
        name: Yup.string('')
            .required('Name is required!'),
        username: Yup.string('')
            .required('Name is required!')
            .min(8, 'The Remarks must be minimum at least 8 characters.'),
        email: Yup.string('')
            .email('Enter a valid email')
            .required('Email is required'),
        mobile: Yup.number('')
            .required('Mobile is required!')
            .min(10, 'The Mobile should be minimum at least 10 numbers.')
            .max(10, 'The Mobile should be maximum at least 10 numbers.'),
        address: Yup.string('')
            .required('Address is required!')
            .min(6, 'The Address should be minimum at least 6 numbers.'),
        password: Yup.string('')
            .min(8, 'The password must be at least 8 characters.')
            .required('Password is required')
            .matches(/^(?=.*\d)(?=.*[@#\-_$%^&+=ยง!\?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=ยง!\?]+$/, "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters!"),
    });
    const initialValues = {
        name: '',
        username: '',
        mobile: '',
        address: '',
        email: '',
        password: ''
    }
    /* const savedValues = {
         userId: '',//recordForEdit.userId,
         gdxamount: '',//recordForEdit.gdxamount,
         hash: '',//recordForEdit.hash,
         type: '',
         remarks: ''
          name: '',
        username: '',
        mobile: '',
        address:'',
        email: '',
        password: ''
     }*/
    //for inline validations via Yup and formik
    const formik = useFormik({
        initialValues: /*(savedValues || */initialValues,//),
        // enableReinitialize: true,
        validationSchema: schema,
        onSubmit: (values, { resetForm }) => {
            onStatusUpdate(values, resetForm);
        }
    });
    const handleClose = () => {
        setDescription('');
        addOrEdit(values, resetForm);
        // recordForEdit(false)
    };
    const {
        values,
        resetForm
    } = useForm(initialValues, true);
    const onStatusUpdate = async (val) => {

        const postBody = {
            requestId: recordForEdit._id,
            type: val.type,
            remarks: val.remarks
        }
        // alert(JSON.stringify(postBody)); return;
        // api call
        await updatestatuswithremark(postBody).then(response => {
            if (response.status === 200) {

                toast.success('GridX Fund Status is updated Successfully!', {
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
            handleClose();
        }).catch(error => {
            console.log(error.message);
            // toast.error(error.message, {
            //     position: "bottom-right",
            //     hideProgressBar: false,
            //     progress: undefined,
            // });
        });
    }

    return (
        <Form onClick={formik.handleSubmit}>
            <Container>
                <Typography variant="h5">
                    <Ptags>Update GridX User Details</Ptags><p style={{ fontSize: '12px' }}>(All the field having * are required)</p></Typography>
                <Row style={{ width: '530px' }}>
                    <Col>
                        <FormControl>
                            <TextField value={formik.values.name}
                                id='name'
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
                            <TextField value={formik.values.username}
                                id='username'
                                name='username'
                                label="Username"
                                onChange={formik.handleChange}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                            />
                        </FormControl>
                    </Col>
                </Row>
                <Row style={{ width: '530px' }}>
                    <Col>
                        <FormControl>
                            <TextField value={formik.values.mobile}
                                id='mobile'
                                name='mobile'
                                label="Mobile"
                                type="number"
                                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10) }}
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
                                //required
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            //style={{ lineHeight:1.0 }}
                            />
                        </FormControl>
                    </Col>

                </Row>
                <FormControl>
                    <TextField value={formik.values.address}
                        label="Address"
                        name="address"     ///it  will be hash value = token
                        onChange={formik.handleChange} required
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                        style={{ width: '490px' }}
                    />
                </FormControl>

                <Row style={{ width: '530px' }}>
                    <Col>
                        <FormControl>
                            <TextField value={formik.values.password}
                                id='password'
                                name='password'
                                label="Password"
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </FormControl>
                    </Col>
                </Row>
                <FormControl>
                    <Buttons variant="contained" type="submit" >Update</Buttons>
                </FormControl>
            </Container>
        </Form>
    )
}

export default FundApprovereject;
const Container = styled(FormGroup)`
width: 100%;
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
line-height: 0.9;
`
const Spannings = styled(FormLabel)`
& > div {
    margin-left:14px;
}
color: #d32f2f;
font-size:12px;
`