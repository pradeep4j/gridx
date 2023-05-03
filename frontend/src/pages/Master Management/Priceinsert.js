import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../hide.css';
import { Table, Row, Col } from 'react-bootstrap';
import { Typography, FormGroup, Select, TextField, FormControl, MenuItem, styled, Button, TablePagination, FormLabel, Paper } from '@mui/material';
import Loading from "../../components/Loading";
import { toast } from 'react-toastify';
import { savegdxprice,getgdxrate } from '../../routes/api';
import * as Yup from 'yup'; // Yup is a JavaScript object schema validator.
import { useFormik } from 'formik'; //formik is third party React form library. It provides basic form programming 
const Priceinsert = () => {
    const navigate = useNavigate();
    const [spinner, setSpinner] = useState(false);
    const [price, setRate] = useState('');
    const [getprice, getPrice] = useState('');
    const schema = Yup.object({
        price: Yup.string('')
        .required('Price is Required!')
    });
    const initialValues = {
        price:''
    }
    const savedValues = {
        price:getprice
    }
    useEffect(() => {
        const postBody = {
            type:"gdx_rate"
        }
        setSpinner(true)
    const getRate = async() => {
        await getgdxrate(postBody).then(response => {
            if (response.data.status === true) {
             //   alert(response.data.gdx_rate)
                setSpinner(false);
                getPrice(response.data.data.gdx_rate);
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
        getRate();
    },[])
    //for inline validations via Yup and formik
    const formik = useFormik({
        initialValues: (savedValues || initialValues),
        validationSchema: schema,
        enableReinitialize:true,
        onSubmit: (values, { resetForm }) => {
            onPriceInsert(values, resetForm);
        }
    });

    const onPriceInsert = async(val) => {
        const postBody = {
            type: 'gdx_rate',
            value: val.price
        }
       // alert(JSON.stringify(postBody))
        setSpinner(true)
        await savegdxprice(postBody).then(response => {
            if (response.data.status === true) {
                setSpinner(false);
                toast.success(response.data.message, {
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

            <Typography variant="h5">Price Insert<Ptags>(All the field having * are required)</Ptags></Typography>
            <FormControl>
                <TextField value={formik.values.price} 
                            required='required'
                            id="price"
                            name="price" 
                            label="Price"  
                            onChange={formik.handleChange} 
                            inputProps={{ maxLength: 20 }} 
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price} 
                            style={{ width: '350px' }}
                            />
            </FormControl>
            <FormControl>
                <Buttons variant="contained" id="submitting" type="submit" onClick={formik.handleSubmit }>Set Price</Buttons>
            </FormControl>
            
        </Container>)
}

export default Priceinsert;
const Container = styled(FormGroup)`
width: 40%;
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
line-height:2.9;

`
