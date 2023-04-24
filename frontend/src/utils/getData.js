import axios from "axios";
import {http,getToken} from '../utils/localStorage';
//const URL = 'http://localhost:5000/admin'; 
const URL = 'http://gridxecosystem.in:5000/admin'; 
const getData = async (props) => {

//   const token = getCookie('gridx-client');
    const response = await axios.post(
        `${URL}/usersList`,
        props.cred,
        {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
            withCredentials: true,
        },
    );
	// const config = {
    //     headers: {
    //         "Content-Type":"application/json",
    //         Authorization : `Bearer ${getToken()}`
    //     }
    // }
    //alert(JSON.stringify(data)); return;
    // return await axios.post(`${URL}/usersList`,data,config);
    return response;
};

export default getData;
