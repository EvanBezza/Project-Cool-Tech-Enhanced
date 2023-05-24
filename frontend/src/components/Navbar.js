// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 1
// File Name: Navbar.js

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

import '../styles/NavStyles.css';
import logo from '../images/noun-tech-2624685.png';
import Login from './Login';
import Register from './Register';

const Navbar = () => {
  const [isCardOpen, setIsCardOpen] = useState(true); // Tracks whether the credential request card is open
  const [showLoginForm, setShowLoginForm] = useState(true); // Tracks whether to show the login form or register form
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') === 'true'); // Tracks the user's login status

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Removes the token from session storage
    sessionStorage.removeItem('role'); // Removes the role from session storage
    setIsLoggedIn(false); // Updates the login status to false
    sessionStorage.setItem('isLoggedIn', false); // Updates the login status in session storage
    window.location.reload(); // Reloads the page to reflect the logout state
  };

  // Handle login success
  const handleSuccess = () => {
    sessionStorage.setItem('isLoggedIn', true); // Updates the login status in session storage
    setIsLoggedIn(true); // Updates the login status to true
    setIsCardOpen(false); // Closes the credential request card
    window.location.reload(); // Reloads the page to reflect the login status
  };

  // Handle register success
  const handleRegisterSuccess = () => {
    setIsCardOpen(true); // Opens the credential request card
    setShowLoginForm(true); // Sets the form in the credential request card to login form
  };

  return (
    <nav>
      <div id="nav-logo-section" className="nav-section">
        <img src={logo} alt="logo"></img>
        <h1>Cool Tech Credential Management System</h1>
      </div>
      <div id="nav-link-section" className="nav-section">
        <Link className="link" to="/">
          Home
        </Link>
        {isLoggedIn ? (
          <Link className="link" onClick={handleLogout}>
            Sign Out
          </Link>
        ) : (
          <>
            <Link
              className="link"
              to="/"
              onClick={(event) => {
                event.preventDefault();
                setIsCardOpen(true);
                setShowLoginForm(true);
              }}
            >
              Login
            </Link>
            <span>|</span>
            <Link
              className="link"
              to="/"
              onClick={(event) => {
                event.preventDefault();
                setIsCardOpen(true);
                setShowLoginForm(false);
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
      {!isLoggedIn && isCardOpen && (
        <div className="credentialRequestCardContainer">
          <Card style={{ width: '18rem' }} className="card">
            <Card.Body className="cardBody">
              {showLoginForm ? (
                <Login onSuccess={handleSuccess} onToggleForm={() => setShowLoginForm(false)} />
              ) : (
                <Register onSuccess={handleRegisterSuccess} />
              )}
              <button onClick={() => setIsCardOpen(false)}>Close</button>
            </Card.Body>
          </Card>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
