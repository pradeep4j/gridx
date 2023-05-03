import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, FormGroup, ImageList, Select, FormControl, MenuItem, InputLabel, styled, Button, ImageListItem, FormLabel } from '@mui/material';
import Loading from "../../components/Loading";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { addoffer } from '../../routes/api';
const Addoffer = () => {
        const navigate = useNavigate();
       // const [duration, setDuration] = useState('1');
        const [spinner, setSpinner] = useState(false);
        const [image, setImage] = useState('');
        const initialValues = {
                duration: '',
                image: ''
        }
        const schema = Yup.object({
                duration: Yup.string()
                        .required("Duration is required!"),
                image: Yup.mixed()
                        .nullable()
                        .required("Image is required!")
                        .test('type', "We only support jpeg/jpg/png/bmp formats", function (value) {
                                //alert('Here='+value.type)
                                return value && (value.type === "image/jpeg" ||
                                        value.type === "image/bmp" ||
                                        value.type === "image/jpg" ||
                                        value.type === "image/png")
                        })
        })
        const formik = useFormik({
                initialValues: initialValues,
                validationSchema: schema,
                onSubmit: (values, { resetForm }) => {
                        onAddOffer(values, resetForm);
                }
        })
        const handleProductImageUpload = (e) => {
                const file = e.target.files[0];

                TransformFileData(file);
        };
        //reading image using The FileReader object lets web applications asynchronously read the contents of files (or raw data buffers) stored on the user's computer, using File or Blob objects to specify the file or data to read.
        const TransformFileData = (file) => {
                const reader = new FileReader();
                const fileType = file.type;
                let types = false;
                if (fileType !== "image/jpeg" && fileType !== "image/bmp" && fileType !== "image/jpg" && fileType !== "image/png") {
                        types = true;
                }
                else {
                        types = false;
                }
                if (types === false) {
                        if (file) {
                                reader.readAsDataURL(file);
                                reader.onloadend = () => {
                                        setImage(reader.result);
                                }
                        }
                }
                else {
                        setImage("");
                }
        };
        const onAddOffer = async (val) => {

                const postBody = {
                        name: val.name,
                        image: image
                }
                setSpinner(true);
                await addoffer(postBody).then(response => {
                        document.getElementById("submitting").innerText = "Adding Offer...Please wait";
                        document.getElementById("submitting").disabled = true;
                        if (response.status === 201) {
                                toast.success('Offer Added Successfully!', {
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
                                document.getElementById("submitting").innerText = "Add Offer";
                                document.getElementById("submitting").disabled = false;
                        }

                        setSpinner(false);
                }).catch((error) => {
                        toast.error(error.message, {
                                position: "bottom-right",
                                hideProgressBar: false,
                                progress: undefined,
                        });
                        document.getElementById("submitting").innerText = "Add Offer";
                        document.getElementById("submitting").disabled = false;
                });

        }
        return (
                <Container>

                        <Typography variant="h5">Add Offer <Ptags>(All the field having * are required)</Ptags></Typography>
                        {spinner && <Loading />}
                        <FormControl>
                                <InputLabel required error={formik.touched.duration && Boolean(formik.errors.duration)}
                                        helperText={formik.touched.duration && formik.errors.duration}>Offer Type</InputLabel>
                                <Select
                                        value={formik.values.duration}
                                        label="Duration"
                                        name="duration"
                                        onChange={formik.handleChange}
                                        error={formik.touched.duration && Boolean(formik.errors.duration)}
                                        helperText={formik.touched.duration && formik.errors.duration}
                                >
                                        <MenuItem value={1}>Before Login</MenuItem>
                                        <MenuItem value={2}>After Login</MenuItem>
                                </Select>
                        <Spannings id="duration-error">{(formik.touched.duration && formik.errors.duration)?<div>{formik.errors.duration}</div>:''}   </Spannings> 
                        </FormControl>
                        <FormControl>
                                <ImageList>

                                        <Ptags ><Typography style={{fontSize:'13px'}}>Choose an image</Typography>
                                                <input
                                                        id="image"
                                                        accept="image/*"
                                                        name="image"
                                                        type="file"
                                                        onChange={(e) => {
                                                                handleProductImageUpload(e); formik.setTouched({
                                                                        ...formik.touched.image
                                                                }); formik.setFieldValue("image", e.target.files[0])
                                                        }}
                                                />
                                        </Ptags>
                                        <ImagePreview>
                                                {image ? (
                                                        <>
                                                                <img src={image} alt="error!" />
                                                        </>
                                                ) : (
                                                        <p>Offer image upload preview will appear here!</p>
                                                )}
                                        </ImagePreview>
                                </ImageList>
                                <Spannings id="iamges">{(formik.touched.image && formik.errors.image) ? <div>{formik.errors.image}</div> : null}</Spannings>
                        </FormControl>
                        <FormControl>
                                <Buttons variant="contained" id="submitting" type="submit" onClick={(e) => formik.handleSubmit()}>Add Offer</Buttons>
                        </FormControl>
                </Container>)
}

export default Addoffer;
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
width: 40%;
`
const ImagePreview = styled(ImageListItem)`
  border: 1px solid rgb(183, 183, 183);
  max-width: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(78, 78, 78);

  img {
    max-width: 100%;
  }
`;
const Spannings = styled(FormLabel)`
color: #d32f2f;
font-size:13px;
`