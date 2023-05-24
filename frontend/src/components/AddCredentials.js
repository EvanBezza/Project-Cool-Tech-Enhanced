// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task:2
// File Name: AddCredentials.js

import React from 'react'
import '../styles/GlobalStyle.css'

class AddCredentials extends React.Component {
  state = {
    credential: '', // Credential value
    password: '', // Password value
    divisions: [], // Division list
    selectedDivision: '', // Selected division value
  }

  componentDidMount() {
    // Fetch divisions from the server
    fetch(`/getDivisions`, {
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ divisions: data })
      })
      .catch((err) => console.log(err))
  }

  // Handle input change event
  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  // Handle form submit event
  handleSubmit = async (event) => {
    event.preventDefault()

    // Send a POST request to add the credential
    const response = await fetch(
      `/addCredential/${this.state.selectedDivision}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify(this.state),
      },
    )

    const data = await response.json()
    if (response.ok) {
      alert('Credential added successfully')
    } else {
      alert(data.error)
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="container">
        <h1>Add Credentials:</h1>
        <label>
          Division:
          <select name="selectedDivision" onChange={this.handleInputChange}>
            {/* Render the division options */}
            {this.state.divisions.map((division) => (
              <option key={division._id} value={division._id}>
                {division.name}
              </option>
            ))}
          </select>
        </label>
        <br></br>
        <h3>New Credential:</h3>
        <label>
          Name:
          <input
            type="text"
            name="username"
            onChange={this.handleInputChange}
          />
        </label>
        <br></br>
        <br></br>
        <label>
          Password:
          <input
            type="password"
            name="password"
            onChange={this.handleInputChange}
          />
        </label>
        <br></br>
        <br></br>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default AddCredentials
