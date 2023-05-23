import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap' // Import Card component from React Bootstrap

import '../styles/NavStyles.css'
import logo from '../images/noun-tech-2624685.png'
import Login from './Login'
import Register from './Register'

const Navbar = () => {
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') === 'true')

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('role')
    setIsLoggedIn(false)
    sessionStorage.setItem('isLoggedIn', false)
    window.location.reload();
  }

  const handleSuccess = () => {
    sessionStorage.setItem('isLoggedIn', true)
    setIsLoggedIn(true)
    setIsCardOpen(false)
    window.location.reload();
  }

  return (
    <nav>
      <div id="nav-logo-section" className="nav-section">
        <img src={logo} alt="logo"></img>
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
                event.preventDefault()
                setIsCardOpen(true)
                setShowLoginForm(true)
              }}
            >
              Login
            </Link>
            <span>|</span>
            <Link
              className="link"
              to="/"
              onClick={(event) => {
                event.preventDefault()
                setIsCardOpen(true)
                setShowLoginForm(false)
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
      {isCardOpen && (
        <div className="credentialRequestCardContainer">
          <Card style={{ width: '18rem' }} className="card">
            <Card.Body className="cardBody">
              {showLoginForm ? (
                <Login onSuccess={handleSuccess} />
              ) : (
                <Register onSuccess={handleSuccess} />
              )}
              <button onClick={() => setIsCardOpen(false)}>Close</button>
            </Card.Body>
          </Card>
        </div>
      )}
    </nav>
  )
}

export default Navbar
