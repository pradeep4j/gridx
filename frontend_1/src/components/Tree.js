import React, { useEffect, useState } from 'react';
import { Button, FormGroup, styled, Divider } from '@mui/material';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import { red } from '@mui/material/colors';
import { toast } from 'react-toastify';
//import { Row, Col, Table } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
var flag = false;
const Tree = () => {

    const [treedata, setTreeData] = useState([]);
    const [treedataLeft, setTreeDataLeft] = useState([]);
    const [treedataRight, setTreeDataRight] = useState([]);
    const [leftCount, setLeftCount] = useState([]);
    const [rightCount, setRightCount] = useState([]);
    const navigate = useNavigate();
    const gettoken = localStorage.getItem('token');
    const token = JSON.parse(gettoken);
    const user_details = localStorage.getItem('user');
    const user = JSON.parse(user_details);
    //   console.log(user.id);
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }
    const getTree = async () => {
        flag = false;
        await axios.get(`http://localhost:8000/api/tree/${user.email}`, config).then(response => {

            if (response.status === 201) {
                if (response.data.length === 0) {
                    setTreeData([{ useremail: user.email, left: "", right: "", leftcount: 0, rightcount: 0 }]);
                }
                else if (response.data.length === 1 && (response.data[0].leftcount === 0 || response.data[0].rightcount === 0)) {
                    setTreeData(response.data);
                }
                else if (response.data[0].leftcount === 1 && response.data[0].rightcount === 1) {
                    setTreeData(response.data);
                }
                else {
                    setTreeData(response.data[0]);
                    setTreeDataLeft(response.data[1]);
                    setTreeDataRight(response.data[2]);
                }
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
    const subtree = async (childemail) => {    //having left or right count greater than 1 then this function will be used for creating hyperlink to elaborate their chield
        flag = true;
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        await axios.get(`http://localhost:8000/api/tree/${childemail}`, config).then(response => {
            if (response.status === 201) {
                // alert(response.data + 'else');
                setTreeData(response.data[0]);
                setTreeDataLeft(response.data[1]);
                setTreeDataRight(response.data[2]);
            }
            if (response.data.length === 1 && (response.data[0].leftcount === 0 || response.data[0].rightcount === 0)) {
                setTreeData(response.data);
            }
            else if (response.data[0].leftcount === 1 && response.data[0].rightcount === 1) {
                setTreeData(response.data);
            }
            else {
                //  alert(response.data.message + 'else');
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
    //console.log(treedata);
    useEffect(() => {
        getTree();
    }, [])
    const goBack = () => {
        navigate(-1);
    }
    return (<Container>

        <table align="center" style={{ textAlign: 'center', width: '40%' }}>
            {/* firest level chield creation start*/}
            {treedata.map((item) =>
                <> <tr>
                    <td colSpan="2">< PersonIcon sx={{ color: "green" }} style={{ fontSize: '50px' }} /></td>
                </tr>
                    <tr><td colSpan="2">{item.useremail}</td></tr>
                    <tr >
                        <td align="center" width="50%">
                            <tr>
                                <td >< PersonIcon sx={{ color: "green" }} style={{ fontSize: '35px' }} />
                                </td>
                            </tr>
                            <tr>
                                <td>{item.leftcount > 1 ? (<a alt="Click to see childs" style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer' }} onClick={(e) => subtree(item.left)} >{item.left}</a>) : item.left}
                                </td>
                            </tr>
                        </td>
                        <td align="center">
                            <tr>
                                <td>< PersonIcon sx={{ color: "green" }} style={{ fontSize: '35px' }} /></td>
                            </tr>
                            <tr>
                                <td>
                                    {item.rightcount > 1 ? (<a alt="Click to see childs" style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer' }} onClick={(e) => subtree(item.right)} alt="W3Schools">{item.right}</a>) : item.right}
                                </td>
                            </tr>
                        </td>
                    </tr>
                    {/* firest level chield creation end*/}
                    {/* second level left chield creation start */}
                    <tr><td>
                        {flag === false && treedataLeft.map((itemleft) =>
                            <>
                                <tr >
                                    <td width="100%">
                                        <tr>
                                            <td align="center">< PersonIcon sx={{ color: "green" }} style={{ fontSize: '35px' }} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{itemleft.leftcount > 1 ? (<a alt="Click to see childs" style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer' }} onClick={(e) => subtree(itemleft.left)} >{itemleft.left}</a>) : itemleft.left}
                                            </td>
                                        </tr>
                                    </td>

                                    <td >
                                        <tr>
                                            <td>< PersonIcon sx={{ color: "green" }} style={{ fontSize: '35px' }} /></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {itemleft.rightcount > 1 ? (<a alt="Click to see childs" style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer' }} onClick={(e) => subtree(itemleft.right)} >{itemleft.right}</a>) : itemleft.right}
                                            </td>
                                        </tr>
                                    </td>
                                </tr>
                            </>
                        )}
                    </td><td>
                            {/* second level left chield creation ends */}
                            {/* second level right chield creation start */}
                            {flag === false && treedataRight.map((itemright) =>
                                <>
                                    <tr >
                                        <td width="100%">
                                            <tr>
                                                <td align="center">< PersonIcon sx={{ color: "green" }} style={{ fontSize: '35px' }} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{itemright.leftcount > 1 ? (<a alt="Click to see childs" style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer' }} onClick={(e) => subtree(itemright.left)} >{itemright.left}</a>) : itemright.left}
                                                </td>
                                            </tr>
                                        </td>

                                        <td >
                                            <tr>
                                                <td>< PersonIcon sx={{ color: "green" }} style={{ fontSize: '35px' }} /></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {itemright.rightcount > 1 ? (<a alt="Click to see childs" style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer' }} onClick={(e) => subtree(itemright.right)} >{itemright.right}</a>) : itemright.right}
                                                </td>
                                            </tr>
                                        </td>
                                    </tr>
                                </>
                            )}

                        </td>
                    </tr>
                    {/* second level left chield creation ends */}
                </>

            )}
        </table>

    </Container >);

}

export default Tree;
const Container = styled(FormGroup)`
width:'100px';
margin: 4% auto 0 auto;
`