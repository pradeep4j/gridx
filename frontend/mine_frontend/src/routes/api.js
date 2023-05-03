import axios from 'axios';
import {getToken} from '../utils/localStorage'
//alert(`${getAdminUrl}/addoffer`)
const URL = 'http://localhost:5000/admin'; 
//const URL = 'http://gridxecosystem.in:5000/admin'; 
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
  //  const config = {
       /* headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }*/
  //  }
    return await axios.post(`${URL}/addoffer`,data/*,config*/);
}
export const addnews = async(data) => {
    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
    return await axios.post(`${URL}/addnews`,data,config);
}
export const getuserreport = async(data) => {
    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
    //alert(JSON.stringify(data)); return;
    //return await axios.post('http://52.66.201.237:5000/admin/usersList',data,config); //live
    return await axios.post(`${URL}/usersList`,data,config);
}
export const getnewsbyId = async(id) => {
   /* const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }*/
    return await axios.post(`${URL}/slider/${id}`/*,config*/);
}
export const allnews = async(id) => {  
    /*const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }*/
    return await axios.get(`${URL}/allnews/${id}`/*,config*/);
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
    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
    return await axios.post(`${URL}/walletrequest`,data,config);
   // return await axios.post('http://52.66.201.237:5000/admin/walletRequest',data);
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
export const useractivationreport = async(data) => {  //all users except logged in user
    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
    return await axios.post(`${URL}/updateUser`,data,config);
}
export const editUserFromAdminById = async(data) => {  //all users except logged in user
    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
    return await axios.post(`${URL}/updateUser`,data,config);
}
export const savegdxprice = async(data) => {
    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
    //alert(`${URL}/updateSetting`)
    return await axios.post(`${URL}/updateSetting`,data,config);
}
export const getgdxrate = async(data) => {
    const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }
    return await axios.post(`${URL}/getSetting`,data,config);
}



