import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomeStyles.css'

import { AuthContext } from '../App';

const Home = () => {
  const { role, isLoggedIn } = useContext(AuthContext);

  return (
    <div>
      <h1>Credential Management</h1>
      {isLoggedIn && role && (
        <>
          <Link className="link" to="/add-credentials">Add Credential</Link>
          <br></br>
          <Link className="link" to="/credential-list">List Credential</Link>
          <br></br>
        </>
      )}
      {isLoggedIn && (role === 'admin' || role === 'management') && (
        <>
          <Link className="link" to="/update-credential">Update Credential</Link>
          <br></br>
        </>
      )}
      {isLoggedIn && role === 'admin' && (
        <>
          <h1>User Management</h1>
          <Link className="link" to="/user-management">User Management</Link>
        </>
      )}
    </div>
  )
}

export default Home
