// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 2
// File Name: UpdateCredential.js

import React from 'react';
import '../styles/GlobalStyle.css';

class UpdateCredential extends React.Component {
  state = {
    credentialId: '', // Stores the selected credential ID
    password: '', // Stores the new password for the credential
    credentials: [], // Stores the list of credentials
  };

  componentDidMount() {
    // Fetch credentials from the server when the component mounts
    fetch('/getCredentials', {
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ credentials: data }); // Updates the credentials state variable with the fetched data
      })
      .catch((err) => console.log(err));
  }

  // Handle input change event
  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value, // Updates the state variable corresponding to the input field name
    });
  };

  // Handle form submission
  handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(
      `/updateCredential/${this.state.credentialId}`, // Sends a PATCH request to update the selected credential
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ password: this.state.password }), // Sends the new password in the request body
      }
    );

    const data = await response.json();
    if (response.ok) {
      alert('Credential updated successfully'); // Displays a success message if the credential was updated successfully
    } else {
      alert(data.error); // Displays an error message if the credential update failed
    }
  };

  render() {
    return (
      <div className="container">
        <label>
          Credential:
          <select
            name="credentialId"
            value={this.state.credentialId}
            onChange={this.handleInputChange} // Updates the selected credential ID when the select value changes
          >
            <option value="">Select Credential</option>
            {this.state.credentials.map((credential) => (
              <option key={credential._id} value={credential._id}>
                {credential.username}
              </option>
            ))}
          </select>
          <br></br>
          <br></br>
        </label>
        <form onSubmit={this.handleSubmit}>
          <label>
            New Password:
            <input
              type="password"
              name="password"
              onChange={this.handleInputChange} // Updates the new password when the input value changes
            />
          </label>
          <br></br>
          <br></br>
          <input type="submit" value="Update Credential" />
        </form>
      </div>
    );
  }
}

export default UpdateCredential;
