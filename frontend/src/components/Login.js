// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 1
// File Name: Login.js

import { useState } from 'react';
import jwt_decode from 'jwt-decode';

const Login = (props) => {
  const [username, setUsername] = useState(''); // Stores the entered username
  const [password, setPassword] = useState(''); // Stores the entered password

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), // Sends the username and password in the request body
    });

    const data = await response.json();

    if (response.ok) {
      const token = data.token; // Extracts the token from the response data
      sessionStorage.setItem('token', data.token); // Stores the token in session storage
      const decodedToken = jwt_decode(token); // Decodes the token to access the payload
      sessionStorage.setItem('role', decodedToken.role); // Stores the role in session storage
      props.onSuccess(); // Calls the onSuccess function provided by the parent component to indicate successful login
    } else {
      alert(data.error); // Displays an error message if login fails
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Updates the username state when the input value changes
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Updates the password state when the input value changes
          placeholder="Password"
        />
        <br></br>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="#" onClick={props.onToggleForm}>Register</a>
      </p>
    </div>
  );
};

export default Login;
