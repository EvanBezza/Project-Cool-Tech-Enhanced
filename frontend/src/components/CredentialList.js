// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 2
// File Name: CredentialList.js

import React from 'react'
import '../styles/GlobalStyle.css'

class CredentialList extends React.Component {
  state = {
    credentials: [],
    divisions: [],
    division: '', // Add division state to store selected division
  }

  componentDidMount() {
    this.fetchDivisions()
  }

  // Fetch divisions from the server
  fetchDivisions = () => {
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

  // Handle division selection change
  handleChange = (event) => {
    // Update the division state with the selected value
    this.setState({ division: event.target.value }, this.fetchCredentials)
  }

  // Fetch credentials based on the selected division
  fetchCredentials = async () => {
    const response = await fetch(`/getCredentials/${this.state.division}`, {
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    })

    const data = await response.json()
    // Update the credentials state with the fetched data
    this.setState({ credentials: data })
  }

  render() {
    const { credentials } = this.state

    return (
      <div className="container">
        <h1>View Credentials:</h1>
        <label>
          Division:
          <br />
          <select
            name="selectedDivision"
            value={this.state.division}
            onChange={this.handleChange}
          >
            <option value="">Select Division</option>
            {/* Render the divisions as options in the select dropdown */}
            {this.state.divisions.map((division) => (
              <option key={division._id} value={division._id}>
                {division.name}
              </option>
            ))}
          </select>
        </label>
        <h2>Credentials:</h2>
        {/* Render the list of credentials */}
        {credentials.length > 0 ? (
          <ul>
            {credentials.map((credential) => (
              <li key={credential._id}>{credential.username}</li>
            ))}
          </ul>
        ) : (
          <p>No credentials found</p>
        )}
      </div>
    )
  }
}

export default CredentialList
