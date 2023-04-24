import React from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Addoffer from './pages/Master Management/Addoffer';
import Addnews from './pages/Master Management/Addnews';
import Withdrawlrequest from './pages/Withdrawl Request/Withdrawlrequest';
//import Addslider from './pages/Master Management/Addslider';
import Fundrequest from './pages/Fund Request/Fundrequest';
import FundApprovereject from './pages/Fund Request/FundApprovereject';
import Pinactivation from './pages/Fund Request/Pinactivation';
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
  return (
    <Router>
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/userreport" element={<PrivateRoute><Userreport /></PrivateRoute>} />
          <Route path="/Addoffer" element={<PrivateRoute><Addoffer /></PrivateRoute>} />
          <Route path="/Addnews" element={<PrivateRoute><Addnews /></PrivateRoute>} />
          <Route path="/pinactivation" element={<PrivateRoute><Pinactivation /></PrivateRoute>} />  
          <Route path="/withdrawlrequest" element={<PrivateRoute><Withdrawlrequest /></PrivateRoute>} /> 
          <Route path="/fundrequest" element={<PrivateRoute><Fundrequest /></PrivateRoute>} />
          <Route path="/editfund/:id" element={<PrivateRoute><FundApprovereject /></PrivateRoute>} /> 
          <Route path="/edituser/:id" element={<PrivateRoute><Edituserdetails /></PrivateRoute>} /> 
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
