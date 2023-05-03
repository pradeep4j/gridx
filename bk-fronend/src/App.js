import React from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Addoffer from './pages/Master Management/Addoffer';
import Addnews from './pages/Master Management/Addnews';
import Addslider from './pages/Master Management/Addslider';
import Withdrawlrequest from './pages/Withdrawl Request/Withdrawlrequest';
import Priceinsert from './pages/Master Management/Priceinsert';
import Fundrequest from './pages/Fund Request/Fundrequest';
import FundApprovereject from './pages/Fund Request/FundApprovereject';
import Pinactivation from './pages/Fund Request/Pinactivation';  //User Activation
import Pinactivationreport from './pages/User Management/Pinactivationreport'; //User Activation Report
import Userreport from './pages/User Management/Userreport';
import Edituserdetails from './pages/User Management/Edituserdetails';
import Dashboard from './components/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// React Notification  
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from './store/AuthContext';

const App = () => {
  alert(process.env.PREFIX_ADMIN_ROUTE)
  return (
    <Router>
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/userreport" element={<PrivateRoute><Userreport /></PrivateRoute>} />
          <Route path="/Addoffer" element={<PrivateRoute><Addoffer /></PrivateRoute>} />
          <Route path="/Addnews" element={<PrivateRoute><Addnews /></PrivateRoute>} />
          <Route path="/Addslider" element={<PrivateRoute><Addslider /></PrivateRoute>} />
          <Route path="/Priceinsert" element={<PrivateRoute><Priceinsert /></PrivateRoute>} />
          <Route path="/pinactivation" element={<PrivateRoute><Pinactivation /></PrivateRoute>} />
          <Route path="/pinactivationreport" element={<PrivateRoute><Pinactivationreport /></PrivateRoute>} />  
          <Route path="/withdrawlrequest" element={<PrivateRoute><Withdrawlrequest /></PrivateRoute>} /> 
          <Route path="/fundrequest" element={<PrivateRoute><Fundrequest /></PrivateRoute>} />
          <Route path="/editfund/:id" element={<PrivateRoute><FundApprovereject /></PrivateRoute>} /> 
          <Route path="/edituser/:id" element={<PrivateRoute><Edituserdetails /></PrivateRoute>} /> 
          {/** live routes
           
          <Route exact path="/9910c765099bd20851b270fc9d759253" element={<Login />} />
          <Route path="/9910c765099bd20851b270fc9d759253/register" element={<Register />} />
          <Route path="/9910c765099bd20851b270fc9d759253/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
          <Route path="/9910c765099bd20851b270fc9d759253/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/9910c765099bd20851b270fc9d759253/userreport" element={<PrivateRoute><Userreport /></PrivateRoute>} />
          <Route path="/9910c765099bd20851b270fc9d759253/Addoffer" element={<PrivateRoute><Addoffer /></PrivateRoute>} />
          <Route path="/9910c765099bd20851b270fc9d759253/Addnews" element={<PrivateRoute><Addnews /></PrivateRoute>} />
          <Route path="/9910c765099bd20851b270fc9d759253/Addslider" element={<PrivateRoute><Addslider /></PrivateRoute>} />
          <Route path="/9910c765099bd20851b270fc9d759253/Priceinsert" element={<PrivateRoute><Priceinsert /></PrivateRoute>} />
          <Route path="/9910c765099bd20851b270fc9d759253/pinactivation" element={<PrivateRoute><Pinactivation /></PrivateRoute>} />
          <Route path="/9910c765099bd20851b270fc9d759253/pinactivationreport" element={<PrivateRoute><Pinactivationreport /></PrivateRoute>} />  
          <Route path="/9910c765099bd20851b270fc9d759253/withdrawlrequest" element={<PrivateRoute><Withdrawlrequest /></PrivateRoute>} /> 
          <Route path="/9910c765099bd20851b270fc9d759253/fundrequest" element={<PrivateRoute><Fundrequest /></PrivateRoute>} />
          <Route path="/9910c765099bd20851b270fc9d759253/editfund/:id" element={<PrivateRoute><FundApprovereject /></PrivateRoute>} /> 
          <Route path="/9910c765099bd20851b270fc9d759253/edituser/:id" element={<PrivateRoute><Edituserdetails /></PrivateRoute>} />
           */}
        </Routes>
      </AuthContextProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );

}

export default App;
