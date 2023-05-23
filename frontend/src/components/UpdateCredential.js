import React from 'react';

class UpdateCredential extends React.Component {
  state = {
    credentialId: '',
    password: '',
    credentials: [],
  };

  componentDidMount() {
    fetch('/getCredentials', {
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ credentials: data });
      })
      .catch((err) => console.log(err));
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(
      `/updateCredential/${this.state.credentialId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ password: this.state.password }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      alert('Credential updated successfully');
    } else {
      alert(data.error);
    }
  };

  render() {
    return (
      <div>
        <label>
          Credential:
          <select
            name="credentialId"
            value={this.state.credentialId}
            onChange={this.handleInputChange}
          >
            <option value="">Select Credential</option>
            {this.state.credentials.map((credential) => (
              <option key={credential._id} value={credential._id}>
                {credential.username}
              </option>
            ))}
          </select>
        </label>
        <form onSubmit={this.handleSubmit}>
          <label>
            New Password:
            <input
              type="password"
              name="password"
              onChange={this.handleInputChange}
            />
          </label>
          <input type="submit" value="Update Credential" />
        </form>
      </div>
    );
  }
}

export default UpdateCredential;
