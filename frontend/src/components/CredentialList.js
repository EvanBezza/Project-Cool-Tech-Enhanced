import React from 'react';

class CredentialList extends React.Component {
  state = {
    credentials: [],
    divisions: [],
    division: '', // Add division state
  };

  componentDidMount() {
    this.fetchDivisions();
  }

  fetchDivisions = () => {
    fetch(`/getDivisions`, {
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ divisions: data });
      })
      .catch((err) => console.log(err));
  };

  // Define handleChange function
  handleChange = (event) => {
    this.setState({ division: event.target.value }, this.fetchCredentials);
  };

  // Fetch credentials based on selected division
  fetchCredentials = async () => {
    const response = await fetch(`/getCredentials/${this.state.division}`, {
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    });

    const data = await response.json();
    this.setState({ credentials: data });
  };

  render() {
    const { credentials } = this.state;
  
    return (
      <div>
        <label>
          Division:
          <br />
          <select
            name="selectedDivision"
            value={this.state.division}
            onChange={this.handleChange}
          >
            <option value="">Select Division</option>
            {this.state.divisions.map((division) => (
              <option key={division._id} value={division._id}>
                {division.name}
              </option>
            ))}
          </select>
        </label>
        <h1>Credentials</h1>
        {credentials.length > 0 ? (
          <ul>
            {credentials.map((credential) => (
              <li key={credential._id}>
                {credential.credential}: {credential.username}
              </li>
            ))}
          </ul>
        ) : (
          <p>No credentials found</p>
        )}
      </div>
    );
  }
  
}

export default CredentialList;
