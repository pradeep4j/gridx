import axios from "axios";
import {getToken} from '../utils/localStorage';
const URL = 'http://localhost:5000/admin'; 
//const URL = 'http://gridxecosystem.in:5000/admin'; 
const getData = async (props) => {
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
    return response;
};

export default getData;
