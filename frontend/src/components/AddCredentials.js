// AddCredentials.js
import React from 'react'

class AddCredentials extends React.Component {
  state = {
    credential: '',
    password: '',
    divisions: [],
    selectedDivision: '',
  }

  componentDidMount() {
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

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
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
      <form onSubmit={this.handleSubmit}>
        <label>
          Division:
          <select name="selectedDivision" onChange={this.handleInputChange}>
            {this.state.divisions.map((division) => (
              <option key={division._id} value={division._id}>
                {division.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Credential:
          <input
            type="text"
            name="username"
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            onChange={this.handleInputChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default AddCredentials
