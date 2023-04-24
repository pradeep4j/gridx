import React,{useState} from 'react';
import { Typography, FormGroup, FormControl, TextField, styled, Button, InputLabel, Select, MenuItem, FormLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup'; // Yup is a JavaScript object schema validator.
import { useFormik } from 'formik'; //formik is third party React form library. It provides basic form programming and validation
import { updatestatuswithremark } from '../../routes/api';
import { useForm, Form } from '../../components/useForm';
const FundApprovereject = ({ addOrEdit,recordForEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const schema = Yup.object({
        type: Yup.string('')
            .required('Status is required!'),
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
    const savedValues = {
        userId: recordForEdit.userId,
        gdxamount: recordForEdit.gdxamount,
        hash: recordForEdit.hash,
        type: '',
        remarks: ''
    }
    //for inline validations via Yup and formik
    const formik = useFormik({
        initialValues: (savedValues || initialValues),
        enableReinitialize: true,
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
            //alert(response.data.status); return;
            if (response.data.status === true) {
                
                toast.success('GridX Fund Status is updated Successfully!', {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
            else {
                toast.error(response.data.message, {
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
<form onSubmit={formik.handleSubmit}>
        <Container>
            <Typography variant="h5">
                <Ptags>Update GridX Fund Status</Ptags><p style={{ fontSize: '12px' }}>(All the field are required)</p></Typography>
            <FormControl>
                <TextField value={formik.values.userId}
                    id='userId'
                    name='userId'
                    label="User Id"
                    onChange={formik.handleChange}
                    disabled
                    error={formik.touched.userId && Boolean(formik.errors.userId)}
                    helperText={formik.touched.userId && formik.errors.userId}
                />
            </FormControl>
            <FormControl>
                <TextField value={formik.values.gdxamount}
                    id='gdxamount'
                    name='gdxamount'
                    label="GDX Amount"
                    onChange={formik.handleChange}
                    disabled
                    error={formik.touched.gdxamount && Boolean(formik.errors.gdxamount)}
                    helperText={formik.touched.gdxamount && formik.errors.gdxamount}
                />
            </FormControl>
            <FormControl>
                <TextField value={formik.values.hash}
                    id='hash'
                    name='hash'
                    label="Transaction Id"
                    onChange={formik.handleChange}
                    disabled
                    error={formik.touched.hash && Boolean(formik.errors.hash)}
                    helperText={formik.touched.hash && formik.errors.hash}
                />
            </FormControl>
            <FormControl>
                <InputLabel required error={formik.touched.type && Boolean(formik.errors.type)}
                    helperText={formik.touched.type && formik.errors.type}>Status</InputLabel>
                <Select
                    value={formik.values.type}
                    label="Status"
                    name="type"
                    onChange={formik.handleChange}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    helperText={formik.touched.type && formik.errors.type}
                >
                    <MenuItem value="Approve">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
                <Spannings id="status-error">{(formik.touched.type && formik.errors.type) ? <div>{formik.errors.type}</div> : ''}   </Spannings>
            </FormControl>
            <FormControl>
                <TextField value={formik.values.remarks}
                    label="Remarks"
                    name="remarks"
                    onChange={formik.handleChange} 
                    multiline
                    rows={4}
                    error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                    helperText={formik.touched.remarks && formik.errors.remarks} />
            </FormControl>
            <FormControl>
                <Buttons variant="contained" type="submit" >Update</Buttons>
            </FormControl>
        </Container>
        </form>
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