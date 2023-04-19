import axios from 'axios';
const URL = 'http://localhost:8000'; 
export const getUrl = () => {
        return URL;
}
export const setProduct = (products) => {
        const productInfos = localStorage.setItem("cartInfo",JSON.stringify(products));
        return productInfos;
}
export const getProduct = () => {
        const productInfos = localStorage.getItem("cartInfo");
        const productValues = JSON.parse(productInfos);
        return productValues;
}
export const removeProduct = () => {
       localStorage.removeItem("cartInfo");
}
export const getAPIUrl = () => {
        let URL = `${getUrl()}/api/user`;
        return URL;

}
export const getAPIUrlProducts = () => {
        let URL = `${getUrl()}/api/product`;
        return URL;
}
export const getAPIUrlCarts = () => {
        let URL = `${getUrl()}/api/cart`;
        return URL;
}
export const getAPIUrlOrders = () => {
        let URL = `${getUrl()}/api/order`;
        return URL;
}
export const getToken = () => {
        let userInfos = localStorage.getItem('userInfo');
        const userToken = JSON.parse(userInfos);
        if(userToken){
                return userToken.access_token;
        }
}
export const setUser = (user_logged) =>
{
        const user = localStorage.setItem('userInfo',JSON.stringify(user_logged))
        return user;
}
export const getUser = () =>
{
        let userInfo = localStorage.getItem('userInfo');
        const user_detail = JSON.parse(userInfo);
        return user_detail;
}
export const removeUser = () =>
{   
        localStorage.removeItem('userInfo');
        localStorage.clear();
}
export const isUserLoggedIn = () => {
       // alert(getUser())
      if(getUser()===null)
            return false;     
      else   
            return true;       
}
export const http = axios.create({
        baseURL:`${getAPIUrl()}`,
    });