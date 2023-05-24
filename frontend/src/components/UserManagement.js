// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 3
// File Name: UserManagement.js

import React, { useState, useEffect } from 'react'
import '../styles/GlobalStyle.css'
import '../styles/UserManagement.css'

const UserManagement = () => {
  // State variables
  const [users, setUsers] = useState([]) // Stores the list of users
  const [newRole, setNewRole] = useState('') // Stores the selected new role for a user
  const [selectedUserData, setSelectedUserData] = useState(null) // Stores the data of the selected user
  const [divisions, setDivisions] = useState([]) // Stores the list of divisions
  const [selectedDivisions, setSelectedDivisions] = useState([]) // Stores the divisions assigned to the selected user
  const [ous, setOUs] = useState([]) // Stores the list of OUs
  const [selectedOUs, setSelectedOUs] = useState([]) // Stores the OUs assigned to the selected user

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers() // Fetches the list of users from the server
    fetchDivisions() // Fetches the list of divisions from the server
    fetchOUs() // Fetches the list of OUs from the server
  }, [])

  // Update selected user data when it changes
  useEffect(() => {
    if (selectedUserData) {
      setSelectedUserData(selectedUserData) // Updates the selected user data
      setSelectedDivisions(selectedUserData.divisions || []) // Updates the assigned divisions for the selected user
      setSelectedOUs(selectedUserData.OUs || []) // Updates the assigned OUs for the selected user
    }
  }, [selectedUserData])

  // Fetch users from the server
  const fetchUsers = async () => {
    try {
      const response = await fetch('/getUsers', {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })
      const data = await response.json()
      setUsers(data) // Updates the users state variable with the fetched data
    } catch (error) {
      console.log(error)
    }
  }
  // Handle user click event
  const handleUserClick = (user) => {
    setSelectedUserData(user) // Updates the selected user data
    setSelectedDivisions(user.divisions || []) // Updates the assigned divisions for the selected user
    setSelectedOUs(user.OUs || []) // Updates the assigned OUs for the selected user
  }

  // Close the selected user card
  const closeCard = () => {
    setSelectedUserData(null) // Resets the selected user data
    setSelectedDivisions([]) // Resets the assigned divisions for the selected user
    setSelectedOUs([]) // Resets the assigned OUs for the selected user
  }

  // Handle change in user role
  const handleChangeRole = async () => {
    if (!selectedUserData || !newRole) {
      return
    }

    try {
      // Update the user's role on the server
      await fetch(`/changeUserRole/${selectedUserData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ role: newRole }),
      })

      // Update the user list with the new role
      const updatedUsers = users.map((user) => {
        if (user._id === selectedUserData._id) {
          return { ...user, role: newRole }
        }
        return user
      })
      setUsers(updatedUsers) // Updates the users state variable with the updated list

      // Update selected user data with the new role
      setSelectedUserData({ ...selectedUserData, role: newRole })
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch divisions from the server
  const fetchDivisions = async () => {
    try {
      const response = await fetch('/getDivisions', {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })
      const data = await response.json()
      setDivisions(data) // Updates the divisions state variable with the fetched data
    } catch (error) {
      console.log(error)
    }
  }

  // Handle division assignment
  const handleAssignDivision = async (divisionId) => {
    if (!selectedUserData || !divisionId) {
      return
    }

    // Check if the division is already assigned to the user
    if (selectedDivisions.includes(divisionId)) {
      return
    }

    try {
      // Assign the division to the user on the server
      await fetch('/assignUserToDivision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ userId: selectedUserData._id, divisionId }),
      })

      setSelectedDivisions([...selectedDivisions, divisionId]) // Updates the assigned divisions for the selected user
    } catch (error) {
      console.log(error)
    }
  }

  // Handle division removal
  const handleRemoveDivision = async (divisionId) => {
    if (!selectedUserData || !divisionId) {
      return
    }

    try {
      // Remove the division from the user on the server
      await fetch('/removeUserFromDivision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ userId: selectedUserData._id, divisionId }),
      })

      setSelectedDivisions((prevDivisions) =>
        prevDivisions.filter((division) => division !== divisionId),
      ) // Updates the assigned divisions for the selected user
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch OUs (Organisational Units) from the server
  const fetchOUs = async () => {
    try {
      const response = await fetch('/getOUs', {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })
      const data = await response.json()
      setOUs(data) // Updates the OUs state variable with the fetched data
    } catch (error) {
      console.log(error)
    }
  }
  // Handle OU (Organisational Unit) assignment
  const handleAssignOU = async (ouId) => {
    if (!selectedUserData || !ouId) {
      return
    }

    // Check if the OU is already assigned to the user
    if (selectedOUs.includes(ouId)) {
      return
    }

    try {
      // Assign the OU to the user on the server
      await fetch('/assignUserToOU', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ userId: selectedUserData._id, ouId }),
      })

      setSelectedOUs([...selectedOUs, ouId]) // Updates the assigned OUs for the selected user
    } catch (error) {
      console.log(error)
    }
  }
  // Handle OU removal
  const handleRemoveOU = async (ouId) => {
    if (!selectedUserData || !ouId) {
      return
    }

    try {
      // Remove the OU from the user on the server
      await fetch('/removeUserFromOU', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({ userId: selectedUserData._id, ouId }),
      })

      setSelectedOUs((prevOUs) => prevOUs.filter((ou) => ou !== ouId)) // Updates the assigned OUs for the selected user
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container">
      <h1 className="userHeaders">User Management</h1>
      <p className="userHeaders">Select a user account to edit.</p>

      {/* --------------- */}
      {/* Table of users: */}
      {/* --------------- */}
      <table>
        <thead>
          <tr>
            <th>Username:</th>
            <th>Role:</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} onClick={() => handleUserClick(user)}>
              <td>{user.username}</td>
              <td>{user.role || user.target}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="card-container">
        {selectedUserData && (
          <div className="card">
            <div className="card-header">
              {/* --------------------------------- */}
              {/* Display of users general details: */}
              {/* --------------------------------- */}
              <h2>User Details</h2>
            </div>
            <div className="card-body">
              <p>Username: {selectedUserData.username}</p>
              <p>Role: {selectedUserData.role || selectedUserData.target}</p>
              <p>OU's: {selectedUserData.OUs?.length}</p>
              <p>Divisions: {selectedUserData.divisions?.length}</p>
              <button type="button" onClick={closeCard}>
                Close
              </button>
              <br></br>
              <br></br>
              <br></br>
              <h2>Update Details:</h2>

              {/* ------------------------- */}
              {/* Update user Role section: */}
              {/* ------------------------- */}
              <h3>Update Role</h3>
              <select
                value={selectedUserData.role || selectedUserData.target}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option>Select a new role...</option>
                <option value="normal">Normal</option>
                <option value="management">Management</option>
                <option value="admin">Admin</option>
              </select>
              <br></br>
              <button type="button" onClick={handleChangeRole}>
                Change Role
              </button>
              <br></br>
              <br></br>
              <br></br>

              {/* ------------------------------ */}
              {/* Manage user Division sections: */}
              {/* ------------------------------ */}
              <h3>Assigned Divisions</h3>
              <ul>
                {selectedDivisions.map((division) => {
                  const foundDivision = divisions.find(
                    (item) => item._id === division,
                  )
                  return (
                    <li key={division}>
                      {foundDivision ? foundDivision.name : ''}
                    </li>
                  )
                })}
              </ul>
              <h4>Assign/Remove Divisions</h4>
              <select onChange={(e) => handleAssignDivision(e.target.value)}>
                <option>Select a division to assign...</option>
                {divisions.map((division) => (
                  <option key={division._id} value={division._id}>
                    {division.name}
                  </option>
                ))}
              </select>
              <select onChange={(e) => handleRemoveDivision(e.target.value)}>
                <option>Select a division to remove...</option>
                {selectedDivisions.map((division) => {
                  const foundDivision = divisions.find(
                    (item) => item._id === division,
                  )
                  return (
                    <option key={division} value={division}>
                      {foundDivision ? foundDivision.name : ''}
                    </option>
                  )
                })}
              </select>
              <br></br>
              <br></br>
              <br></br>

              {/* ----------------------------------------- */}
              {/* Manage User Organisational Units section: */}
              {/* ----------------------------------------- */}
              <h4>Assigned OUs</h4>
              <ul>
                {selectedOUs.map((ou) => {
                  const foundOU = ous.find((item) => item._id === ou)
                  return <li key={ou}>{foundOU ? foundOU.name : ''}</li>
                })}
              </ul>

              <h4>Assign/Remove OUs</h4>
              <select onChange={(e) => handleAssignOU(e.target.value)}>
                <option>Select an OU to assign...</option>
                {ous.map((ou) => (
                  <option key={ou._id} value={ou._id}>
                    {ou.name}
                  </option>
                ))}
              </select>
              <select onChange={(e) => handleRemoveOU(e.target.value)}>
                <option>Select an OU to remove...</option>
                {selectedOUs.map((ou) => {
                  const foundOU = ous.find((item) => item._id === ou)
                  return (
                    <option key={ou} value={ou}>
                      {foundOU ? foundOU.name : ''}
                    </option>
                  )
                })}
              </select>
            </div>
            <br></br>
            <div className="card-footer">
              <button onClick={closeCard}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
