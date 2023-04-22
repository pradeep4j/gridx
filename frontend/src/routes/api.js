import axios from 'axios';
import {http,getToken} from '../utils/localStorage'
const URL = 'http://localhost:5000/admin'; 
const IMAGE_URL = 'http://localhost:3000/gridx/frontend/assets'; 
export const getImageUrl = () => {
   // let URL = `${getUrl()}/api/user`;
    return IMAGE_URL;
}
export const getUrl = () => {
    return URL;
}
axios.defaults.withCredentials = true;  
///api of users starts
export const login = async(data) => {
  //  alert(`${URL}/login`)
   return await axios.post(`${URL}/login`,data);
}
export const logout = async() => {
    return await axios.get(`${URL}/logout`);
}
export const addoffer = async(data) => {
    const config = {
       /* headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }*/
    }
    return await axios.post(`${URL}/addoffer`,data/*,config*/);
}
export const addnews = async(data) => {
    const config = {
       /* headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }*/
    }
    return await axios.post(`${URL}/addnews`,data/*,config*/);
}
export const allUsers = async(id) => {
    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
    return await axios.get(`${URL}/allUsers/${id}`,config);
}
export const getnewsbyId = async(id) => {
   /* const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }*/
    return await axios.post(`${URL}/getnewsbyId/${id}`/*,config*/);
}
export const allnews = async(id) => {  
    /*const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }*/
    return await http.get(`${URL}/allnews/${id}`/*,config*/);
}
export const getallfundrequest = async(data) => {  
    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
  //  alert(`Bearer ${getToken()}`); return;
    return await axios.post(`${URL}/walletrequest`,data,config);
    //return await axios.post('http://52.66.201.237:5000/admin/walletrequest',data); //live
}
export const getrequestwithdrawl = async(data) => {  
    /*const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }*/
    return await axios.post('http://52.66.201.237:5000/admin/walletRequest',data);
}

export const updatestatuswithremark = async(data) => {  
    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
    return await axios.post(`${URL}/approveRejectWalletRequest`,data,config);
   // return await axios.post('http://52.66.201.237:5000/admin/approveRejectWalletRequest',data,config);
}
export const pinactivation = async(data) => {

    const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };
    return await axios.post(`${URL}/pinsystem`,data,config); //adding token header with request
}
export const editUserFromAdminById = async(data,id) => {  //all users except logged in user
    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
    return await http.put(`${URL}/userEditFromAdminById/${id}`,data,config);
}
export const deleteNews = async(id) => {
    return await axios.delete(`${URL}/deleteNews/${id}`);
}

export const getuserreport = async(data) => {

    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
    return await http.get(`${URL}/getuserreport`,data,config); 
}  

