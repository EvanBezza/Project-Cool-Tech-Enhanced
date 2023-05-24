import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './components/Home'
import AddCredentials from './components/AddCredentials'
import ListCredentials from './components/CredentialList'
import UpdateCredential from './components/UpdateCredential'
import UserManagement from './components/UserManagement'

export const AuthContext = React.createContext()

const PrivateRoute = ({ roleRequired, children }) => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem('role');
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true' ? true : false;

  useEffect(() => {
    const requiredRoles = roleRequired.split(',');

    if (!isLoggedIn || !requiredRoles.includes(role)) {
      navigate('/');
    }
  }, [isLoggedIn, role, navigate, roleRequired]);

  return children;
};


const App = () => {
  const [role, setRole] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    const userRole = sessionStorage.getItem('role')
    const loggedStatus = sessionStorage.getItem('isLoggedIn') === 'true' ? true : false
    setRole(userRole)
    setIsLoggedIn(loggedStatus)
  }, [])
  
  const handleSuccess = () => {
    const userRole = sessionStorage.getItem('role')
    const loggedStatus = sessionStorage.getItem('isLoggedIn') === 'true' ? true : false
    setRole(userRole)
    setIsLoggedIn(loggedStatus)
  }

  return (
    <AuthContext.Provider value={{ role, isLoggedIn, handleSuccess }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/add-credentials" element={<PrivateRoute roleRequired="normal,management,admin"><AddCredentials /></PrivateRoute>} /> 
          <Route path="/credential-list" element={<PrivateRoute roleRequired="normal,management,admin"><ListCredentials /></PrivateRoute>} />
          <Route path="/update-credential" element={<PrivateRoute roleRequired="management,admin"><UpdateCredential /></PrivateRoute>} />
          <Route path="/user-management" element={<PrivateRoute roleRequired="admin"><UserManagement /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
