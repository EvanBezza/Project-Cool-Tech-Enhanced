import { useState } from 'react'
import jwt_decode from 'jwt-decode'

const Login = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (response.ok) {
      const token = data.token
      sessionStorage.setItem('token', data.token)
      const decodedToken = jwt_decode(token)
      sessionStorage.setItem('role', decodedToken.role) // store the role
      props.onSuccess() // set to true when login is successful
    } else {
      alert(data.error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <br></br>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
