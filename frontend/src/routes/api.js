import axios from 'axios';
import {http,getToken} from '../utils/localStorage'
const URL = 'http://localhost:8000/api/user'; 
axios.defaults.withCredentials = true;  
///api of users starts
export const login = async(data) => {
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
export const getallfundrequest = async(id) => {  
    /*const config = {
        headers: {
            "Content-Type":"application/json",
            Authorization : `Bearer ${getToken()}`
        }
    }*/
    return await http.get(`${URL}/getallfundrequest/${id}`/*,config*/);
}
export const updateUsersProfileById = async(data,id) => {

    const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };
    return await http.put(`${URL}/update-user-profile/${id}`,data,config); //adding token header with request
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

export const confirmUser = async(token) => {

    const config = {
        headers: {
          "Content-Type": "application/json"
        },
      };
    return await http.get(`${URL}/confirmuser/${token}`,config); //adding token header with request
}  
export const validateCaptcha = async(token) =>{  //this ruote is only for reCaptcha verification from backend
    return await axios.post(`${URL}/tokenCaptcha`,token);  //sending captcha token to backend to validate
}
///api of users end