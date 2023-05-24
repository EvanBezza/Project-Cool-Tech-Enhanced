// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 1
// File Name: Home.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/GlobalStyle.css';

import { AuthContext } from '../App';

const Home = () => {
  const { role, isLoggedIn } = useContext(AuthContext); // Accesses the role and isLoggedIn values from the AuthContext

  return (
    <div className='container'>
      {isLoggedIn && role === 'admin' && (
        <>
          <h1>Manage Users</h1>
          <Link className="link" to="/user-management">User Management</Link> {/* Displays a link to the User Management page for admin users */}
        </>
      )}
      <h1>Manage Credentials</h1>
      {isLoggedIn && role && (
        <>
          <Link className="link" to="/add-credentials">Add Credential</Link> {/* Displays a link to the Add Credential page for logged-in users with a role */}
          <br></br>
          <Link className="link" to="/credential-list">List Credential</Link> {/* Displays a link to the Credential List page for logged-in users with a role */}
          <br></br>
        </>
      )}
      {isLoggedIn && (role === 'admin' || role === 'management') && (
        <>
          <Link className="link" to="/update-credential">Update Credential</Link> {/* Displays a link to the Update Credential page for admin or management users */}
          <br></br>
        </>
      )}
      
    </div>
  );
};

export default Home;
