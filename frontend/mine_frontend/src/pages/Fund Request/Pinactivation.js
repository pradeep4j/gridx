import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../hide.css';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Table, Row, Col } from 'react-bootstrap';
import { Typography, FormGroup, Select, TextField, FormControl, MenuItem, styled, Button, TablePagination, FormLabel, Radio, RadioGroup, FormControlLabel,InputAdornment} from '@mui/material';
import Loading from "../../components/Loading";
import { toast } from 'react-toastify';
import { pinactivation } from '../../routes/api';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import * as Yup from 'yup'; // Yup is a JavaScript object schema validator.
import { useFormik } from 'formik'; //formik is third party React form library. It provides basic form programming and validation
const Pinactivation = () => {
    const [spinner, setSpinner] = useState(false);
    const [wallettype, setWalletType] = useState('ext');
    const [pin, setPin] = useState(1);

    const schema = Yup.object({
        gdxamount: Yup.number()
            .required('GDX amount is required!')
            .min(50, "Amount should be minimum 50!")
            .max(1000, "Amount should be maximum up to 1000!"),
        //.matches(/^((50|[0-4]?[0-9])|\+?0*([0-9]{1,8}|1000))$/,"Amount must be a number between 50 and 1000!"),
        username: Yup.string('')
            .required('Username is required!')
    });
    //for inline validations via Yup and formik
    const formik = useFormik({
        initialValues: {
            gdxamount: '',
            username: ''
        },
        validationSchema: schema,
        onSubmit: (values, { resetForm }) => {
            onPinactivation(values, resetForm);
        }
    });
    const onPinactivation = async (val) => {
        const postBody = {
            gdxamount: val.gdxamount,
            username: 'GDX'+val.username,
            wallettype: wallettype,
            pintype: pin
        }
      //  alert(JSON.stringify(postBody)); return;
        setSpinner(true);
        await pinactivation(postBody).then(response => {
           // alert(response.data.status)
            if (response.data.status === true ) {
                setSpinner(false);
                toast.success('Selected user id activation is successfull!', {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
            else {
                setSpinner(false);
                toast.error(response.data.message, {
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
            <Typography variant="h5">Pin Activation<Ptags><p style={{ fontSize: '12px' }}>(All the field having * are required)</p></Ptags></Typography>
            {spinner && <Loading />}
            <FormControl>
                <FormLabel style={{ color: 'black', fontSize: '15px' }}>Wallet Type</FormLabel>
                <RadioGroup
                    row
                    name="wallettype"
                    //value={wallettype}
                    defaultValue="ext"
                    onChange={(e) => setWalletType(e.target.value)}
                        /* error={formik.touched.gender && Boolean(formik.errors.gender)} 
                                helperText={formik.touched.gender && formik.errors.gender*}*/>
                    
                    <RadioFonts
                        value="ext"
                        control={<Radio />}
                        label="External Wallet"
                    />
                </RadioGroup>
            </FormControl>
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                        components={[

                        ]}
                    >
                        <DemoItem label="Select Pin" style={{ color: 'black' }}>
                            <Select style={{ width: '150px' }}
                                defaultValue={0}
                                name="pin"
                                onChange={(e) => setPin(e.target.value)}
                                value={pin}
                            >
                                <MenuItem value={1}>Dummmy Pin</MenuItem>
                                <MenuItem value={2}>Premium Pin</MenuItem>
                                <MenuItem value={3}>Power Pin</MenuItem>
                            </Select>
                        </DemoItem>

                        <DemoItem label="User Id" style={{ color: 'black' }}>
                            <TextField value={formik.values.username}
                                required='required'
                                id='username'
                                name='username'
                                // label="User Id"
                                onChange={formik.handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" ><Typography variant="headline" component="h6" style={{ fontWeight:'bold' }}>GDX</Typography></InputAdornment>,
                                }}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                            />
                        </DemoItem>
                        <DemoItem label="Amount" style={{ color: 'black' }}>
                            <TextField value={formik.values.gdxamount}
                                required='required'
                                id='gdxamount'
                                name='gdxamount'
                                label={<AttachMoneyIcon />}
                                onChange={formik.handleChange}
                                type="number"
                                error={formik.touched.gdxamount && Boolean(formik.errors.gdxamount)}
                                helperText={formik.touched.gdxamount && formik.errors.gdxamount}
                            />
                        </DemoItem>
                    </DemoContainer>
                </LocalizationProvider>
            </FormControl>

            <FormControl>
                <Buttons variant="contained" id="submitting" type="submit" onClick={formik.handleSubmit}>Activate</Buttons>
            </FormControl>

        </Container>)
}

export default Pinactivation;
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
width: 30%;
`
const RadioFonts = styled(FormControlLabel)`
color:'black';
fontSize:'4px';
`
/*const Ptags = styled('p')`
font-size: '20px';
font-weight: 300;
letter-spacing: -0.025em;
color: #000103;
line-height: 0.9;
`*/
