import React from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Addoffer from './pages/Master Management/Addoffer';
import Addnews from './pages/Master Management/Addnews';
import Withdrawlrequest from './pages/Withdrawl Request/Withdrawlrequest';
import Addslider from './pages/Master Management/Addslider';
import Fundrequest from './pages/Fund Request/Fundrequest';
//import Fundedit from './pages/Fund Request/Fundedit';
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
          <Route path="/Addoffer" element={<PrivateRoute><Addoffer /></PrivateRoute>} />
          <Route path="/Addnews" element={<PrivateRoute><Addnews /></PrivateRoute>} />
          <Route path="/Addslider" element={<PrivateRoute><Addslider /></PrivateRoute>} /> 
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/withdrawlrequest" element={<PrivateRoute><Withdrawlrequest /></PrivateRoute>} /> 
          <Route path="/fundrequest" element={<PrivateRoute><Fundrequest /></PrivateRoute>} />
          {/* <Route path="/editfund/:id" element={<PrivateRoute><Fundedit /></PrivateRoute>} />  */}
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
