import React from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Addoffer from './pages/Master Management/Addoffer';
import Addnews from './pages/Master Management/Addnews';
//import Newsedit from './pages/Master Management/Newsedit';
import Addslider from './pages/Master Management/Addslider';
import Fundrequest from './pages/Fund Request/Fundrequest';
//import Fundedit from './pages/Master Management/Fundedit';
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
          <Route path="/Addoffer" element={<Addoffer />} />
          <Route path="/Addnews" element={<Addnews />} />
          <Route path="/Addslider" element={<Addslider />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/editnews/:id" element={<Newsedit />} /> */}
          <Route path="/fundrequest" element={<Fundrequest />} />
          {/* <Route path="/editfund/:id" element={<Fundedit />} /> */}
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
